import type { SchemaTypeDefinition } from "sanity";

import { caseStudy, testimonial } from "./caseStudy";
import { collection, subCategory } from "./collection";
import { product } from "./product";
import { service } from "./service";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  product,
  collection,
  subCategory,
  service,
  caseStudy,
  testimonial,
  siteSettings,
];
