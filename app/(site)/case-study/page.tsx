import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHeader } from "@/components/ui";
import { getCaseStudies } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Commercial kitchen and retail projects completed by GNS – resorts, cafes, supermarkets and restaurants.",
  alternates: { canonical: "/case-study" },
};

export default async function CaseStudiesPage() {
  const items = await getCaseStudies();
  return (
    <>
      <PageHeader
        eyebrow="Our case studies"
        title="Real results from real projects"
        intro="A look at kitchens and stores we've equipped – and the difference it made."
      />
      <Container className="grid gap-6 py-14 md:grid-cols-2">
        {items.map((c) => (
          <CaseStudyCard key={c._id} c={c} />
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
