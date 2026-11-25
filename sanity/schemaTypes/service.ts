import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "/service/<this>",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", title: "Short summary", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "overview", title: "Overview", type: "array", of: [defineArrayMember({ type: "block" })] }),
    defineField({
      name: "features",
      title: "Key features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities (grouped lists)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "capabilityGroup",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "workflow",
      title: "Workflow steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({ name: "brochure", title: "Brochure (PDF)", type: "file", options: { accept: "application/pdf" } }),
    defineField({ name: "order", title: "Order (lower shows first)", type: "number" }),
    defineField({ name: "oldFramerUrl", title: "Old Framer URL", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});
