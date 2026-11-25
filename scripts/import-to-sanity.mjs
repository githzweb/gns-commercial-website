// Imports the scraped Framer catalogue (data/framer/*.json) into Sanity:
// collections, sub-categories and all products, including uploading photos.
//
// Run (after `npx sanity login`):
//   npx sanity exec scripts/import-to-sanity.mjs --with-user-token
//
// Safe to run again: documents use fixed IDs (createOrReplace) and uploaded
// images are remembered in data/framer/image-assets.json.

import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-11-01" });
const DIR = path.resolve("data/framer");
const ASSET_CACHE = path.join(DIR, "image-assets.json");

const products = JSON.parse(fs.readFileSync(path.join(DIR, "products.json"), "utf8"));
const { collections, subcategories } = JSON.parse(fs.readFileSync(path.join(DIR, "catalog.json"), "utf8"));
const assetCache = fs.existsSync(ASSET_CACHE) ? JSON.parse(fs.readFileSync(ASSET_CACHE, "utf8")) : {};

// ---- Fixes for typos on the old site (old URL keeps working via redirect) ----
const SLUG_FIXES = {
  "i-door-chiller-sc-240l": "1-door-chiller-sc-240l",
  "1door-chiller-sc-280l": "1-door-chiller-sc-280l",
  "1-door-chiller-sc320l": "1-door-chiller-sc-320l",
  "chest-freezeer-sc-sdw450g": "chest-freezer-sc-sdw450g",
  "chest-freezer-scsdw400": "chest-freezer-sc-sdw400",
  "heavy-duty-very-narrow-aisle-(vna)-pallet-racking": "heavy-duty-very-narrow-aisle-vna-pallet-racking",
  "twin-tank-electring-deep-fryer": "twin-tank-electric-deep-fryer",
  "mamak-series-eqquipment": "mamak-series-equipment",
};
const NAME_FIXES = [
  [/^I DOOR CHILLER/, "1 DOOR CHILLER"],
  [/^1DOOR CHILLER/, "1 DOOR CHILLER"],
  [/\(SC320L\)/, "(SC-320L)"],
  [/Chest Freezeer/i, "Chest Freezer"],
  [/ELECTRING/i, "ELECTRIC"],
  [/Eqquipment/, "Equipment"],
  [/\s+\)/, ")"],
];
const fixSlug = (s) => SLUG_FIXES[s] ?? s;
const fixName = (n) => NAME_FIXES.reduce((acc, [re, to]) => acc.replace(re, to), n.replace(/\s+/g, " ").trim());

const COLLECTION_DESCRIPTIONS = {
  "racking-system":
    "Commercial and industrial storage solutions – from heavy-duty warehouse pallet racking and multi-level storage platforms to retail gondola shelving and everyday storage racks.",
  "stainless-steel-equipment":
    "High-grade, durable stainless steel fabrication and storage solutions built for maximum hygiene and longevity in demanding commercial environments.",
  "food-processing-equipment":
    "Advanced machinery designed to streamline preparation, increase efficiency, and maintain consistency for high-volume food production.",
  "commercial-refrigerator":
    "Commercial chillers, freezers and display showcases for restaurants, supermarkets and retail stores.",
};

// ---- Helpers ----
const docId = (type, slug) => `${type}-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;
const ref = (id) => ({ _type: "reference", _ref: id, _key: key() });
const block = (text) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function uploadImage(url) {
  if (assetCache[url]) return assetCache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const filename = url.split("/").pop();
  const asset = await client.assets.upload("image", buf, {
    filename,
    source: { name: "framer", id: filename, url },
  });
  assetCache[url] = asset._id;
  fs.writeFileSync(ASSET_CACHE, JSON.stringify(assetCache, null, 2));
  return asset._id;
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn));
    process.stdout.write(`\r  ${Math.min(i + size, items.length)}/${items.length}`);
  }
  console.log();
}

// ---- Import ----
async function main() {
  console.log(`Project ${client.config().projectId} / ${client.config().dataset}`);

  // 1. Collections + sub-categories
  let tx = client.transaction();
  for (const c of collections) {
    tx = tx.createOrReplace({
      _id: docId("collection", c.slug),
      _type: "collection",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      description: COLLECTION_DESCRIPTIONS[c.slug],
      order: c.order,
    });
  }
  for (const s of subcategories) {
    const slug = fixSlug(s.slug);
    tx = tx.createOrReplace({
      _id: docId("subCategory", slug),
      _type: "subCategory",
      name: fixName(s.name),
      slug: { _type: "slug", current: slug },
      collection: { _type: "reference", _ref: docId("collection", s.collection) },
      order: s.order,
    });
  }
  await tx.commit();
  console.log(`✓ ${collections.length} collections, ${subcategories.length} sub-categories`);

  // 2. Product photos
  const urls = [...new Set(products.flatMap((p) => p.images))];
  console.log(`Uploading ${urls.length} photos (already done: ${urls.filter((u) => assetCache[u]).length})`);
  const failedImages = [];
  await inBatches(urls, 4, async (u) => {
    try {
      await uploadImage(u);
    } catch (e) {
      failedImages.push({ url: u, error: String(e) });
    }
  });

  // 3. Products, 25 per transaction
  const docs = products.map((p) => {
    const slug = fixSlug(p.slug);
    const name = fixName(p.name);
    return {
      _id: docId("product", slug),
      _type: "product",
      name,
      modelCode: p.modelCode ?? undefined,
      slug: { _type: "slug", current: slug },
      collection: { _type: "reference", _ref: docId("collection", p.collection) },
      subCategories: p.subCategories.map((s) => ref(docId("subCategory", fixSlug(s)))),
      images: p.images
        .filter((u) => assetCache[u])
        .map((u) => ({ _type: "image", _key: key(), asset: { _type: "reference", _ref: assetCache[u] }, alt: name })),
      shortDescription: p.shortDescription ?? undefined,
      details: p.details.map(block),
      specs: p.specs.map((s) => ({ _type: "spec", _key: key(), label: s.label, value: s.value })),
      deliveryNote: p.deliveryNote ?? undefined,
      featured: false,
      oldFramerUrl: p.oldUrl,
    };
  });
  console.log(`Writing ${docs.length} products`);
  for (let i = 0; i < docs.length; i += 25) {
    let t = client.transaction();
    for (const d of docs.slice(i, i + 25)) t = t.createOrReplace(d);
    await t.commit();
    process.stdout.write(`\r  ${Math.min(i + 25, docs.length)}/${docs.length}`);
  }
  console.log();

  // 4. Redirect list for renamed URLs (used later in next.config.ts)
  const redirects = products
    .filter((p) => fixSlug(p.slug) !== p.slug)
    .map((p) => ({ source: p.oldUrl, destination: `/shop/${fixSlug(p.slug)}` }));
  fs.writeFileSync(path.join(DIR, "redirects.json"), JSON.stringify(redirects, null, 2));

  console.log(
    `✓ Done. Products without photos: ${docs.filter((d) => !d.images.length).length}. ` +
      `Failed photo uploads: ${failedImages.length}. Renamed URLs: ${redirects.length}.`,
  );
  if (failedImages.length) fs.writeFileSync(path.join(DIR, "failed-images.json"), JSON.stringify(failedImages, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
