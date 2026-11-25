import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "details", title: "Details & specs" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "main",
      description: 'Full name as customers see it, e.g. "1 DOOR CHILLER (SC-200L)"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "modelCode",
      title: "Model code",
      type: "string",
      group: "main",
      description: 'e.g. "SC-200L". Used in search and the WhatsApp message.',
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "main",
      description: "The product's web address: /shop/<this>. Click Generate after typing the name.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      group: "main",
      to: [{ type: "collection" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subCategories",
      title: "Sub-categories",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "reference", to: [{ type: "subCategory" }] })],
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "main",
      description: "The first photo is the main one shown in the shop.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Short description of the photo",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "main",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({
      name: "details",
      title: "Product details",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      group: "details",
      description: 'Shown as a table, e.g. "Capacity" → "200L".',
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "deliveryNote",
      title: "Shipping & returns",
      type: "string",
      group: "details",
      initialValue: "Own delivery provided",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      description: "Optional. Leave empty to use the product name.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "Optional. Leave empty to use the short description.",
    }),
    defineField({
      name: "oldFramerUrl",
      title: "Old Framer URL",
      type: "string",
      group: "seo",
      readOnly: true,
      description: "Where this product lived on the old site (used for redirects).",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "collection.name", media: "images.0" },
  },
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
});
