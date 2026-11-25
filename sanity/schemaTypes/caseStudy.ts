import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Project name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "/case-study/<this>",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "projectType", title: "Project type", type: "string", description: 'e.g. "Hotel & Resort Project"' }),
    defineField({ name: "summary", title: "Short summary", type: "text", rows: 2 }),
    defineField({ name: "resultValue", title: "Headline result – number", type: "string", description: 'e.g. "30%"' }),
    defineField({ name: "resultLabel", title: "Headline result – label", type: "string", description: 'e.g. "Peak hour service speed"' }),
    defineField({ name: "image", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Story", type: "array", of: [defineArrayMember({ type: "block" })] }),
    defineField({
      name: "specs",
      title: "Technical specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Results (numbers)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", description: 'e.g. "30%"', validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Photos",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "order", title: "Order (lower shows first)", type: "number" }),
    defineField({ name: "oldFramerUrl", title: "Old Framer URL", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "projectType", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Customer name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Company (optional)", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});
