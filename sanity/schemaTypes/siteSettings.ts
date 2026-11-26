import { defineArrayMember, defineField, defineType } from "sanity";

// One single document holding company details used across the whole site.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "branches", title: "Branches" },
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
      name: "branches",
      title: "Branches",
      type: "array",
      group: "branches",
      description: "Shown on the Contact page (in this order) and in the footer.",
      of: [
        defineArrayMember({
          type: "object",
          name: "branch",
          fields: [
            defineField({ name: "name", title: "Branch name", type: "string", description: 'e.g. "Johor Bahru (HQ & showroom)"', validation: (r) => r.required() }),
            defineField({ name: "tradingName", title: "Trading name (if different)", type: "string", description: 'e.g. "GNS Kitchen and Food Equipment"' }),
            defineField({ name: "country", title: "Country", type: "string" }),
            defineField({ name: "kind", title: "Type", type: "string", options: { list: ["Showroom", "Showroom (by appointment)", "Sales office", "Sales coverage (no showroom)"] } }),
            defineField({ name: "summary", title: "What this branch does", type: "text", rows: 2 }),
            defineField({ name: "address", title: "Showroom / visiting address", type: "text", rows: 2 }),
            defineField({ name: "otherAddress", title: "Other address (e.g. registered office)", type: "text", rows: 2 }),
            defineField({ name: "phones", title: "Phone / WhatsApp numbers", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "whatsapp", title: "WhatsApp (digits only, with country code)", type: "string", validation: (r) => r.regex(/^\d{9,15}$/, { name: "digits only" }) }),
            defineField({ name: "openingHours", title: "Opening hours", type: "text", rows: 3 }),
            defineField({ name: "website", title: "Website", type: "url" }),
            defineField({ name: "showMap", title: "Show a map", type: "boolean", initialValue: true }),
            defineField({ name: "photo", title: "Branch photo", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Short description", type: "string" })] }),
          ],
          preview: { select: { title: "name", subtitle: "kind", media: "photo" } },
        }),
      ],
    }),
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
