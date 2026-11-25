// Scrapes every product from the old Framer site into data/framer/products.json.
// Run: node scripts/scrape-framer.mjs
//
// Sub-category membership is filtered in the browser on the Framer site, so it
// can't be read from the HTML – it was captured once into
// data/framer/subcategories.json and is merged in here.

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const BASE = "https://gnscommercialequipment.framer.website";
const OUT_DIR = path.resolve("data/framer");
// Framer only server-renders full pages for normal browsers.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

// The collection filter pages on the old site, and the clean slug we'll use.
const COLLECTIONS = [
  { slug: "commercial-refrigerator", name: "Commercial Refrigerator", oldUrl: "/commercial-regrigerator", order: 1 },
  { slug: "stainless-steel-equipment", name: "Stainless Steel Equipment", oldUrl: "/stainless-steel-equipment", order: 2 },
  { slug: "racking-system", name: "Racking System", oldUrl: "/rack", order: 3 },
  { slug: "food-processing-equipment", name: "Food Processing Equipment", oldUrl: "/food-processing-equipment", order: 4 },
];

const SECTION_TITLES = ["Product Details", "Size", "Shipping and Returns"];
// Site-wide images (logo, collection cards, icons) – never product photos.
const SITE_IMAGES = new Set([
  "mm5Z4oNJ2DyRh6D69hQQbtkU.png",
  "qAOPnAeTcK7n7OV9Tw89KNJzJQ.png",
  "l3onBRNxYjhrnPoxz7BEyLCMM.png",
  "0CWrfaihAMwbIyGepfY3OirMtEw.png",
  "pIkNFlQegpt6drEW7IsebQl4n8.png",
]);

const LABEL_FIXES = {
  "N.Capacity": "Net Capacity",
  "G.Capacity": "Gross Capacity",
  "In Chiller Dim": "Dimensions (chiller)",
  "In Freezer Dim": "Dimensions (freezer)",
  "Temp.": "Temperature",
  Temp: "Temperature",
  Dim: "Dimensions",
  "Dim.": "Dimensions",
};

async function get(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.text();
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

const productLinks = (html) =>
  [...new Set([...html.matchAll(/href="\.\/shop\/([^"]+)"/g)].map((m) => m[1]))].filter(
    (s) => !s.startsWith("collections"),
  );

// HTML fragment -> clean lines of text (keeps <br> and paragraph breaks).
function htmlToLines(html) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h[1-6])>/gi, "\n");
  return cheerio
    .load(withBreaks)
    .root()
    .text()
    .split("\n")
    .map((l) => l.replace(/[\t ]+/g, " ").trim())
    .filter(Boolean);
}

// A spec label is 1–3 Title-case words right before a colon, e.g. "Power:",
// "Dough Capacity:", "Temp. :", "N.Capacity :". Many products on the old site
// have specs run together with no line breaks ("230VDough Capacity: 6 kg"), so
// we find labels anywhere in the line, not only at the start.
const LABEL_RE = /((?:[A-Z][a-z.]+\.?\s?){1,3})\s*:\s*/g;

function splitSpecs(lines) {
  const specs = [];
  const text = [];
  for (const line of lines) {
    const hits = [...line.matchAll(LABEL_RE)];
    if (!hits.length) {
      text.push(line);
      continue;
    }
    let before = line.slice(0, hits[0].index).trim();
    const found = [];
    hits.forEach((h, i) => {
      const end = i + 1 < hits.length ? hits[i + 1].index : line.length;
      let raw = h[1].trim();
      // "LitersDimensions" = end of the previous value ("20 Liters") glued to
      // the next label ("Dimensions"). Split at the last lowercase/"." -> Uppercase.
      const glue = raw.match(/^(.*[a-z.])([A-Z][A-Za-z. ]*)$/);
      if (glue && !/^In /.test(glue[1])) {
        const [, tail, rest] = glue;
        if (found.length) found[found.length - 1].value += ` ${tail.trim()}`;
        else before = `${before} ${tail}`.trim();
        raw = rest.trim();
      } else if (glue) {
        raw = `${glue[1].trim()} ${glue[2].trim()}`; // "In ChillerDim" -> "In Chiller Dim"
      }
      const label = LABEL_FIXES[raw] ?? raw;
      const value = line.slice(h.index + h[0].length, end).trim();
      found.push({ label, value });
    });
    // "Gas Type: LPG (Gas Pressure: 2.8-3 kpa)" -> drop the broken brackets.
    found.forEach((s, i) => {
      if (s.value.endsWith("(") && found[i + 1]?.value.endsWith(")")) {
        s.value = s.value.slice(0, -1).trim();
        found[i + 1].value = found[i + 1].value.slice(0, -1).trim();
      }
    });
    if (before) text.push(before);
    specs.push(...found.filter((s) => s.value));
  }
  return { specs, text };
}

// Lines in the "Size" section without a label, e.g. "1253 x 715 x 2092 mm" or
// several sizes run together: 4' X 30" X 33"5' X 30" X 33"
function sizeSpecs(lines, existing) {
  const dims = existing.find((s) => s.label === "Dimensions");
  const digits = (s) => (s.match(/\d+/g) || []).join(",");
  const sizes = lines
    .flatMap((l) => l.split(/(?<=["'])(?=\d)/))
    .map((s) => s.trim())
    .filter(Boolean)
    // skip if it just repeats the Dimensions spec
    .filter((s) => !(dims && digits(s).startsWith(digits(dims.value))));
  if (!sizes.length) return [];
  return [{ label: sizes.length > 1 ? "Available sizes" : "Size", value: sizes.join(", ") }];
}

// "SC-200L" from "1 DOOR CHILLER (SC-200L)"; "B20" from "B20 Commercial Food Mixer (20L)".
const isModel = (s) => /^[A-Z]{1,5}[A-Z0-9]*[-/ ]?[A-Z0-9]*\d[A-Z0-9.\-/]*$/i.test(s) && /[A-Z]/i.test(s[0]);
function modelCodeOf(name) {
  const paren = (name.match(/\(([^)]+)\)\s*$/) || [])[1]?.trim();
  if (paren && isModel(paren)) return paren;
  const first = name.split(/\s+/)[0];
  if (first && /\d/.test(first) && /[A-Z]/i.test(first) && isModel(first)) return first;
  return null;
}

function parseProduct(slug, html) {
  const $ = cheerio.load(html);
  const els = $("h2, h3, img, p").toArray();
  const h3i = els.findIndex((e) => e.tagName === "h3");
  const endi = els.findIndex((e, i) => i > h3i && e.tagName === "h2" && $(e).text().trim() === "Collections");
  if (h3i < 0) throw new Error(`no product name on ${slug}`);

  const name = $(els[h3i]).text().replace(/\s+/g, " ").trim();
  const modelCode = modelCodeOf(name);

  // Product photos: content images in the main area, before the Collections section.
  const images = [];
  for (const e of els.slice(0, endi > 0 ? endi : undefined)) {
    if (e.tagName !== "img") continue;
    const src = ($(e).attr("src") || "").split("?")[0];
    const file = src.split("/").pop();
    if (!src.includes("framerusercontent.com/images/")) continue;
    if (!/\.(png|jpe?g|webp)$/i.test(file) || SITE_IMAGES.has(file)) continue;
    if (!images.includes(src)) images.push(src);
  }

  // Short description: first real paragraph after the name.
  let shortDescription = null;
  for (const e of els.slice(h3i + 1, endi > 0 ? endi : undefined)) {
    if (e.tagName !== "p") continue;
    const t = $(e).text().trim();
    if (!t || t === name || t === "WhatsApp us" || t.startsWith('"Send us') || SECTION_TITLES.includes(t)) continue;
    shortDescription = t;
    break;
  }

  // Accordion sections: title <p> -> content is the next sibling of its block.
  const sections = {};
  $("p").each((_, p) => {
    const title = $(p).text().trim();
    if (!SECTION_TITLES.includes(title) || sections[title]) return;
    const content = $(p).parent().parent().next();
    sections[title] = content.length ? htmlToLines($.html(content)) : [];
  });

  const details = splitSpecs(sections["Product Details"] ?? []);
  const size = splitSpecs(sections["Size"] ?? []);
  const specs = [...details.specs, ...size.specs];
  specs.push(...sizeSpecs(size.text, specs));

  // The standard intro sentence is often glued to the next text with no space.
  const detailText = details.text
    .flatMap((t) => t.split(/(?<=practical functionality\.)/))
    .map((t) => t.trim())
    .filter(Boolean);

  const delivery = (sections["Shipping and Returns"] ?? []).join(" ").trim();

  return {
    slug,
    oldUrl: `/shop/${slug}`,
    name,
    modelCode,
    shortDescription,
    details: detailText,
    specs,
    deliveryNote: /^own deliver(y)? provided$/i.test(delivery) ? "Own delivery provided" : delivery || null,
    images,
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. All product slugs + which collection each is in.
  const all = productLinks(await get(`${BASE}/shop`));
  const collectionOf = {};
  for (const c of COLLECTIONS) {
    for (const s of productLinks(await get(BASE + c.oldUrl))) collectionOf[s] = c.slug;
  }
  console.log(`found ${all.length} products`);

  // 2. Sub-categories (captured from the browser).
  const subRaw = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "subcategories.json"), "utf8"));
  const subsOf = {};
  for (const [subSlug, [, items]] of Object.entries(subRaw)) {
    for (const s of items) (subsOf[s] ??= []).push(subSlug);
  }

  // 3. Every product page, 6 at a time.
  const products = [];
  const failed = [];
  for (let i = 0; i < all.length; i += 6) {
    const batch = all.slice(i, i + 6);
    const results = await Promise.allSettled(batch.map(async (s) => parseProduct(s, await get(`${BASE}/shop/${s}`))));
    results.forEach((r, j) => {
      if (r.status === "fulfilled") {
        products.push({ ...r.value, collection: collectionOf[batch[j]] ?? null, subCategories: subsOf[batch[j]] ?? [] });
      } else failed.push({ slug: batch[j], error: String(r.reason) });
    });
    process.stdout.write(`\r${products.length + failed.length}/${all.length}`);
  }
  console.log();

  // 4. Sub-category -> collection (the collection most of its products are in).
  const subcategories = Object.entries(subRaw).map(([slug, [name, items]], i) => {
    const counts = {};
    for (const s of items) counts[collectionOf[s]] = (counts[collectionOf[s]] ?? 0) + 1;
    const collection = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    return { slug, name, collection, order: i + 1 };
  });

  fs.writeFileSync(path.join(OUT_DIR, "products.json"), JSON.stringify(products, null, 2));
  fs.writeFileSync(
    path.join(OUT_DIR, "catalog.json"),
    JSON.stringify({ collections: COLLECTIONS, subcategories }, null, 2),
  );
  if (failed.length) fs.writeFileSync(path.join(OUT_DIR, "failed.json"), JSON.stringify(failed, null, 2));

  // 5. Quick report.
  const n = (f) => products.filter(f).length;
  console.log({
    products: products.length,
    failed: failed.length,
    noImage: n((p) => p.images.length === 0),
    multiImage: n((p) => p.images.length > 1),
    noShortDescription: n((p) => !p.shortDescription),
    noSpecs: n((p) => p.specs.length === 0),
    noCollection: n((p) => !p.collection),
    noSubCategory: n((p) => p.subCategories.length === 0),
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
