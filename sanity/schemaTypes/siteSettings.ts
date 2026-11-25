import { defineArrayMember, defineField, defineType } from "sanity";

// One single document holding company details used across the whole site.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "social", title: "Social & shops" },
    { name: "stats", title: "Homepage stats" },
  ],
  fields: [
    defineField({ name: "companyName", title: "Company name", type: "string", group: "contact" }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "Digits only with country code, e.g. 60122424758",
      validation: (r) => r.regex(/^\d{9,15}$/, { name: "digits only" }),
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3, group: "contact" }),
    defineField({ name: "mapUrl", title: "Google Maps link", type: "url", group: "contact" }),
    defineField({ name: "openingHours", title: "Opening hours", type: "text", rows: 3, group: "contact" }),
    defineField({
      name: "socialLinks",
      title: "Social & shop links",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["WhatsApp", "Facebook", "Instagram", "TikTok", "Lazada", "Shopee", "Mudah", "Other"] },
              validation: (r) => r.required(),
            }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", description: 'e.g. "100+"', validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
