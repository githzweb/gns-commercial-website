import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type Spec = { label: string; value: string };
export type Stat = { value: string; label: string };

export type CollectionSummary = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: SanityImage;
  productCount: number;
};

export type SubCategorySummary = {
  _id: string;
  name: string;
  slug: string;
  collectionSlug: string;
};

export type ProductCard = {
  _id: string;
  name: string;
  slug: string;
  modelCode?: string;
  image?: SanityImage;
  collectionSlug: string;
  collectionName: string;
  subSlugs: string[];
};

export type Product = ProductCard & {
  images?: SanityImage[];
  shortDescription?: string;
  details?: PortableTextBlock[];
  specs?: Spec[];
  deliveryNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  subCategories: { name: string; slug: string }[];
};

export type ServiceSummary = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  image?: SanityImage;
  features?: { title: string; text?: string }[];
};

export type Service = ServiceSummary & {
  overview?: PortableTextBlock[];
  capabilities?: { title: string; items?: string[] }[];
  workflow?: string[];
  faqs?: { question: string; answer?: string }[];
  brochureUrl?: string;
};

export type CaseStudySummary = {
  _id: string;
  title: string;
  slug: string;
  projectType?: string;
  summary?: string;
  resultValue?: string;
  resultLabel?: string;
  image?: SanityImage;
};

export type CaseStudy = CaseStudySummary & {
  body?: PortableTextBlock[];
  specs?: Spec[];
  stats?: Stat[];
  gallery?: SanityImage[];
};

export type Testimonial = { _id: string; quote: string; name: string; company?: string };

export type SiteSettings = {
  companyName?: string;
  phones?: string[];
  whatsapp?: string;
  email?: string;
  address?: string;
  mapUrl?: string;
  openingHours?: string;
  socialLinks?: { platform: string; url: string }[];
  stats?: Stat[];
};
