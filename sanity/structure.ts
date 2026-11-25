import type { StructureResolver } from "sanity/structure";

// The left-hand menu in Sanity Studio.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("GNS Content")
    .items([
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("collection").title("Collections"),
      S.documentTypeListItem("subCategory").title("Sub-categories"),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
