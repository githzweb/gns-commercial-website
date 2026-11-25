import type { Metadata } from "next";

import { ServiceCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHeader } from "@/components/ui";
import { getServices } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Kitchen design & consultancy, commercial equipment supply, custom stainless steel fabrication, after-sales maintenance and turnkey project management.",
  alternates: { canonical: "/service" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="Our services"
        title="Everything you need, from design to after-sales"
        intro="We support F&B and retail businesses at every stage – planning, equipment, fabrication, installation and maintenance."
      />
      <Container className="grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s._id} s={s} />
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
