// Scrapes the 6 service pages from the old Framer site into data/framer/services.json.
// Run: node scripts/scrape-framer-services.mjs
//
// FAQ answers are hidden until clicked on the Framer site, so only the first
// answer per page is in the HTML. Answers read by hand from the live site are
// added from EXTRA_ANSWERS; the rest are left empty to fill in Sanity Studio.

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const BASE = "https://gnscommercialequipment.framer.website";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

// Old (template) URL -> clean new slug, in the order shown on the site.
const SERVICES = [
  ["product-assembly", "design-consultancy"],
  ["commercial-equipment", "commercial-equipment"],
  ["custom-stainless-steel-fabrication", "custom-stainless-steel-fabrication"],
  ["after-sales-maintenance", "after-sales-maintenance"],
  ["surface-finishing", "retail-supermarket-equipment"],
  ["quality-control-testing", "turnkey-project-management"],
];

const EXTRA_ANSWERS = {
  "Do you provide 3D renderings of the kitchen?":
    "Yes, we provide full 3D visualizations so you can experience the workflow before equipment is ordered.",
  "Can you design for very small or compact spaces?":
    "Absolutely. We specialize in space-saving solutions for cloud kitchens, kiosks, and compact cafes.",
  "Do you handle the actual gas and electrical work?":
    "We provide the precise technical M&E layouts that your licensed contractors can use for accurate site preparation.",
  "Is there an initial consultation fee?":
    "We offer a complimentary introductory consultation to discuss your project scope and provide a preliminary quote.",
};

const SKIP = new Set(["Category", "Details", "Service overview", "Capabilities & Features", "Product assembly"]);

function parse(html) {
  const $ = cheerio.load(html);
  $("script,style,nav,footer").remove();
  // Flatten into an ordered list of {tag, text} / {img}
  const items = [];
  $("h1,h2,h3,p,img").each((_, e) => {
    if (e.tagName === "img") {
      const src = ($(e).attr("src") || "").split("?")[0];
      if (/framerusercontent\.com\/images\/.+\.(png|jpe?g|webp)$/i.test(src)) items.push({ img: src });
      return;
    }
    const text = $(e).text().replace(/\s+/g, " ").trim();
    if (text) items.push({ tag: e.tagName, text });
  });

  const title = items.find((i) => i.tag === "h1")?.text;
  const h1 = items.findIndex((i) => i.tag === "h1");
  const summary = items.slice(h1 + 1).find((i) => i.tag === "p")?.text;
  const image = items.slice(h1 + 1).find((i) => i.img)?.img ?? null;

  const idx = (pred, from = 0) => {
    const i = items.slice(from).findIndex(pred);
    return i < 0 ? -1 : i + from;
  };
  const capStart = idx((i) => i.text === "Capabilities & Features");
  const wfStart = idx((i) => i.text === "Our proven workflow");
  const faqStart = idx((i) => i.text === "Frequently asked questions");
  const faqEnd = idx((i) => i.text === "Get in touch", faqStart);

  // Overview = longest paragraph before the capabilities section.
  const intro = items.slice(h1 + 1, capStart).filter((i) => i.tag === "p" && !SKIP.has(i.text));
  const overview = intro.reduce((a, b) => (b.text.length > (a?.text.length ?? 0) ? b : a), null)?.text ?? "";

  // Features = h2 + following p pairs (deduped), excluding the service title itself.
  const features = [];
  items.slice(h1 + 1, capStart).forEach((it, k, arr) => {
    if (it.tag !== "h2" || it.text === title) return;
    const next = arr[k + 1];
    if (next?.tag === "p" && !features.find((f) => f.title === it.text)) features.push({ title: it.text, text: next.text });
  });

  // Capabilities: group titles have no full stop, items end with "."
  const capabilities = [];
  for (const it of items.slice(capStart + 1, wfStart > 0 ? wfStart : faqStart)) {
    if (it.tag !== "p" || SKIP.has(it.text) || it.text === "Simple & Transparent") continue;
    if (!it.text.endsWith(".")) capabilities.push({ title: it.text, items: [] });
    else capabilities.at(-1)?.items.push(it.text);
  }

  const workflow = items.slice(wfStart + 1, faqStart).filter((i) => i.tag === "h3").map((i) => i.text);

  const faqs = [];
  items.slice(faqStart + 1, faqEnd).forEach((it, k, arr) => {
    if (it.tag !== "h2" || !it.text.endsWith("?") || faqs.find((f) => f.question === it.text)) return;
    const next = arr[k + 1];
    const answer = next?.tag === "p" && next.text !== "Common questions" ? next.text : EXTRA_ANSWERS[it.text] ?? null;
    faqs.push({ question: it.text, answer });
  });

  return { title, summary, image, overview, features, capabilities, workflow, faqs };
}

const out = [];
for (const [i, [old, slug]] of SERVICES.entries()) {
  const html = await (await fetch(`${BASE}/service/${old}`, { headers: HEADERS })).text();
  const s = parse(html);
  out.push({ slug, oldUrl: `/service/${old}`, order: i + 1, ...s });
  console.log(
    `${slug}: features ${s.features.length}, capability groups ${s.capabilities.length}, ` +
      `workflow ${s.workflow.length}, faqs ${s.faqs.length} (answered ${s.faqs.filter((f) => f.answer).length}), image ${!!s.image}`,
  );
}
fs.writeFileSync(path.resolve("data/framer/services.json"), JSON.stringify(out, null, 2));
