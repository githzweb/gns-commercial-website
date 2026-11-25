import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getAllProducts, getCaseStudies, getCollections, getServices } from "@/sanity/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, services, caseStudies] = await Promise.all([
    getAllProducts(),
    getCollections(),
    getServices(),
    getCaseStudies(),
  ]);
  const page = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    priority,
  });
  return [
    page("/", 1),
    page("/shop", 0.9),
    page("/service", 0.8),
    page("/case-study", 0.6),
    page("/about", 0.5),
    page("/contact", 0.7),
    page("/legal-pages/privacy-policy", 0.2),
    ...collections.map((c) => page(`/shop/collections/${c.slug}`, 0.8)),
    ...services.map((s) => page(`/service/${s.slug}`, 0.7)),
    ...caseStudies.map((c) => page(`/case-study/${c.slug}`, 0.5)),
    ...products.map((p) => page(`/shop/${p.slug}`, 0.7)),
  ];
}
