// All Sanity reads for the website. Each function is cached ("use cache") and
// tagged "sanity", so a Sanity webhook can refresh everything at once with
// revalidateTag("sanity") (Phase 4). Until then, content refreshes every hour.

import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";

import { isSanityConfigured } from "../env";
import { client } from "./client";
import type {
  CaseStudy,
  CaseStudySummary,
  CollectionSummary,
  Product,
  ProductCard,
  Service,
  ServiceSummary,
  SiteSettings,
  SubCategorySummary,
  Testimonial,
} from "./types";

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!isSanityConfigured) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set (see .env.example)");
  return client.fetch<T>(query, params);
}

const PRODUCT_CARD = `{
  _id, name, "slug": slug.current, modelCode,
  "image": images[0],
  "collectionSlug": collection->slug.current,
  "collectionName": collection->name,
  "subSlugs": coalesce(subCategories[]->slug.current, [])
}`;

// ---- Settings ----
const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]`);
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return (await fetchSanity<SiteSettings | null>(SETTINGS_QUERY)) ?? {};
}

// ---- Catalogue ----
const COLLECTIONS_QUERY = defineQuery(`*[_type == "collection"] | order(order asc) {
  _id, name, "slug": slug.current, description, image,
  "productCount": count(*[_type == "product" && references(^._id)])
}`);
export async function getCollections(): Promise<CollectionSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(COLLECTIONS_QUERY);
}

const SUBCATEGORIES_QUERY = defineQuery(`*[_type == "subCategory"] | order(order asc) {
  _id, name, "slug": slug.current, "collectionSlug": collection->slug.current
}`);
export async function getSubCategories(): Promise<SubCategorySummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(SUBCATEGORIES_QUERY);
}

const ALL_PRODUCTS_QUERY = defineQuery(`*[_type == "product"] | order(collection->order asc, name asc) ${PRODUCT_CARD}`);
/** Every product as a lightweight card – the shop filters this list in memory. */
export async function getAllProducts(): Promise<ProductCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(ALL_PRODUCTS_QUERY);
}

const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0] {
  ...${PRODUCT_CARD},
  images, shortDescription, details, specs, deliveryNote, seoTitle, seoDescription,
  "subCategories": coalesce(subCategories[]->{name, "slug": slug.current}, [])
}`);
export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(PRODUCT_QUERY, { slug });
}

// ---- Services ----
const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(order asc) {
  _id, title, "slug": slug.current, summary, image, features
}`);
export async function getServices(): Promise<ServiceSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(SERVICES_QUERY);
}

const SERVICE_QUERY = defineQuery(`*[_type == "service" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, summary, image, features, overview, capabilities, workflow, faqs,
  "brochureUrl": brochure.asset->url
}`);
export async function getService(slug: string): Promise<Service | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(SERVICE_QUERY, { slug });
}

// ---- Case studies ----
const CASE_STUDIES_QUERY = defineQuery(`*[_type == "caseStudy"] | order(order asc) {
  _id, title, "slug": slug.current, projectType, summary, resultValue, resultLabel, image
}`);
export async function getCaseStudies(): Promise<CaseStudySummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(CASE_STUDIES_QUERY);
}

const CASE_STUDY_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, projectType, summary, resultValue, resultLabel, image,
  body, specs, stats, gallery
}`);
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(CASE_STUDY_QUERY, { slug });
}

// ---- Testimonials ----
const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial"] | order(_createdAt asc) { _id, quote, name, company }`);
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return fetchSanity(TESTIMONIALS_QUERY);
}
