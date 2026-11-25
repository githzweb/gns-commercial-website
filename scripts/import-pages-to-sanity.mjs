// Imports services, case studies, testimonials and site settings into Sanity
// from data/framer/{services,case-studies,site}.json, including images.
//
// Run (after `npx sanity login`):
//   npx sanity exec scripts/import-pages-to-sanity.mjs --with-user-token
//
// Safe to run again (fixed IDs + image cache shared with import-to-sanity.mjs).

import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-11-01" });
const DIR = path.resolve("data/framer");
const ASSET_CACHE = path.join(DIR, "image-assets.json");
const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));

const services = read("services.json");
const caseStudies = read("case-studies.json");
const site = read("site.json");
const assetCache = fs.existsSync(ASSET_CACHE) ? read("image-assets.json") : {};

let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;
const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function image(url, alt) {
  if (!url) return undefined;
  if (!assetCache[url]) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`download failed ${res.status} ${url}`);
    const filename = url.split("/").pop();
    const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
      filename,
      source: { name: "framer", id: filename, url },
    });
    assetCache[url] = asset._id;
    fs.writeFileSync(ASSET_CACHE, JSON.stringify(assetCache, null, 2));
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetCache[url] }, ...(alt ? { alt } : {}) };
}

// The Commercial Equipment overview is split into pieces on the Framer page.
const OVERVIEW_FIXES = [
  [
    "meet the rigorous demands of modern systems,",
    "meet the rigorous demands of modern culinary operations. Our catalog features advanced thermal cooking suites, precision refrigeration systems,",
  ],
];
// GNS was founded in 2019 (confirmed by Machi) – the old site sometimes said 2005.
const fixText = (t) =>
  OVERVIEW_FIXES.reduce((acc, [a, b]) => acc.replace(a, b), t).replace(/([Ss]ince) 2005/g, "$1 2019");

async function main() {
  console.log(`Project ${client.config().projectId} / ${client.config().dataset}`);
  const tx = client.transaction();

  for (const s of services) {
    tx.createOrReplace({
      _id: `service-${s.slug}`,
      _type: "service",
      title: s.title,
      slug: { _type: "slug", current: s.slug },
      summary: s.summary,
      image: await image(s.image),
      overview: [block(fixText(s.overview))],
      features: s.features.map((f) => ({ _type: "feature", _key: key(), title: f.title, text: f.text })),
      capabilities: s.capabilities.map((c) => ({ _type: "capabilityGroup", _key: key(), title: c.title, items: c.items })),
      workflow: s.workflow,
      faqs: s.faqs.map((f) => ({ _type: "faq", _key: key(), question: f.question, ...(f.answer ? { answer: f.answer } : {}) })),
      order: s.order,
      oldFramerUrl: s.oldUrl,
    });
  }
  console.log(`✓ ${services.length} services`);

  for (const [i, c] of caseStudies.entries()) {
    const gallery = [];
    for (const u of c.gallery) gallery.push({ ...(await image(u)), _key: key() });
    tx.createOrReplace({
      _id: `caseStudy-${c.slug}`,
      _type: "caseStudy",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      projectType: c.projectType,
      summary: c.summary,
      resultValue: c.stats[0][0],
      resultLabel: c.stats[0][1],
      image: await image(c.cover, c.title),
      body: c.sections.flatMap(([heading, text]) => [block(heading, "h3"), block(text)]),
      specs: c.specs.map(([label, value]) => ({ _type: "spec", _key: key(), label, value })),
      stats: c.stats.map(([value, label]) => ({ _type: "stat", _key: key(), value, label })),
      gallery,
      order: i + 1,
      oldFramerUrl: c.oldUrl,
    });
  }
  console.log(`✓ ${caseStudies.length} case studies`);

  site.testimonials.forEach((t, i) =>
    tx.createOrReplace({ _id: `testimonial-${i + 1}`, _type: "testimonial", name: t.name, quote: t.quote }),
  );

  const st = site.settings;
  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: st.companyName,
    phones: st.phones,
    whatsapp: st.whatsapp,
    email: st.email,
    address: st.address,
    openingHours: st.openingHours,
    socialLinks: st.socialLinks.map(([platform, url]) => ({ _type: "socialLink", _key: key(), platform, url })),
    stats: st.stats.map(([value, label]) => ({ _type: "stat", _key: key(), value, label })),
  });

  // Collection cover images (from the old homepage collection cards).
  const COLLECTION_IMAGES = {
    "racking-system": "https://framerusercontent.com/images/qAOPnAeTcK7n7OV9Tw89KNJzJQ.png",
    "commercial-refrigerator": "https://framerusercontent.com/images/l3onBRNxYjhrnPoxz7BEyLCMM.png",
    "stainless-steel-equipment": "https://framerusercontent.com/images/0CWrfaihAMwbIyGepfY3OirMtEw.png",
    "food-processing-equipment": "https://framerusercontent.com/images/pIkNFlQegpt6drEW7IsebQl4n8.png",
  };
  for (const [slug, url] of Object.entries(COLLECTION_IMAGES)) {
    const img = await image(url);
    tx.patch(`collection-${slug}`, (p) => p.set({ image: img }));
  }

  await tx.commit();
  console.log(`✓ ${site.testimonials.length} testimonial(s), site settings, collection images`);

  // Add renamed service / case-study URLs to the redirect list.
  const redirectsFile = path.join(DIR, "redirects.json");
  const redirects = fs.existsSync(redirectsFile) ? read("redirects.json") : [];
  const extra = [
    ...services.filter((s) => s.oldUrl !== `/service/${s.slug}`).map((s) => ({ source: s.oldUrl, destination: `/service/${s.slug}` })),
    ...caseStudies.map((c) => ({ source: c.oldUrl, destination: `/case-study/${c.slug}` })),
  ];
  const merged = [...redirects.filter((r) => !extra.find((e) => e.source === r.source)), ...extra];
  fs.writeFileSync(redirectsFile, JSON.stringify(merged, null, 2));
  console.log(`✓ redirects.json now has ${merged.length} entries`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
