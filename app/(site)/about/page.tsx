import type { Metadata } from "next";
import Image from "next/image";

import { ServiceCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHeader, SectionHeading } from "@/components/ui";
import { getServices, getSiteSettings } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "GNS Commercial Equipment provides commercial kitchen design, custom fabrication and equipment distribution for F&B and retail businesses across Malaysia and Singapore.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  return (
    <>
      <PageHeader
        eyebrow="Since 2019"
        title="About GNS Commercial Equipment"
        intro="Since 2019, GNS Commercial Equipment has been a leader in high-end culinary and retail solutions across Malaysia. We specialise in precision kitchen design, custom fabrication and reliable equipment distribution to help your business operate at peak efficiency."
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/hero-3.jpg" alt="Commercial equipment supplied by GNS" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading eyebrow="Our story" title="Building excellence in commercial F&B and retail solutions" />
          <div className="mt-6 space-y-4 leading-7 text-muted">
            <p>
              GNS Commercial Equipment began with a vision to provide reliable, high-performance culinary and retail
              hardware that businesses could depend on. Since our founding in 2019, we have grown into a team of skilled
              specialists dedicated to serving the F&amp;B and retail sectors across Malaysia and Singapore.
            </p>
            <p>
              We believe that a successful business starts with the right foundation – high-quality equipment designed
              for durability and operational efficiency.
            </p>
          </div>
        </div>
      </Container>

      {settings.stats?.length ? (
        <section className="bg-soft">
          <Container className="py-14">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {settings.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white p-6">
                  <dd className="text-3xl font-semibold text-brand sm:text-4xl">{s.value}</dd>
                  <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      <Container className="py-16">
        <SectionHeading eyebrow="Our capabilities" title="How we help" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s._id} s={s} />
          ))}
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
