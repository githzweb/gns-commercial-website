import Image from "next/image";

import { CaseStudyCard, CollectionCard, ServiceCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";
import { ButtonLink, Container, SectionHeading, WhatsAppIcon } from "@/components/ui";
import { SITE_URL, whatsappLink } from "@/lib/site";
import {
  getAllProducts,
  getCaseStudies,
  getCollections,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/sanity/lib/data";

const HERO_IMAGES = ["/images/hero-1.jpg", "/images/hero-2.jpg", "/images/hero-3.jpg", "/images/hero-4.jpg"];

const INDUSTRIES = [
  {
    title: "Restaurants & Cafes",
    text: "Reliable kitchen setups designed to help your chefs work faster and keep food fresh.",
    points: ["Durable stainless steel tables and sinks", "High-performance stoves and fryers", "Fast-cooling chillers and freezers"],
  },
  {
    title: "Supermarkets & Retail",
    text: "Modern display and storage solutions that make your products look great to customers.",
    points: ["Energy-saving display chillers", "Strong shelving systems for heavy stock", "Smooth-rolling trolleys and baskets"],
  },
  {
    title: "Hotels & Catering",
    text: "Heavy-duty equipment built to handle large crowds and busy banquet events.",
    points: ["Large-capacity ovens and steamers", "Walk-in cold rooms for bulk storage", "Custom stainless steel kitchen layouts"],
  },
  {
    title: "Central Kitchens",
    text: "Professional food processing machines that help you produce more in less time.",
    points: ["Heavy-duty mixers and grinders", "Automated food packaging tools", "Hygienic and easy-to-clean surfaces"],
  },
  {
    title: "Bakeries & Pastry Shops",
    text: "Specialised tools to help you bake perfectly and display your cakes beautifully.",
    points: ["Pro-grade deck and convection ovens", "Sleek cake and pastry display cases", "Dough mixers and preparation tables"],
  },
];

export default async function HomePage() {
  const [settings, collections, services, products, caseStudies, testimonials] = await Promise.all([
    getSiteSettings(),
    getCollections(),
    getServices(),
    getAllProducts(),
    getCaseStudies(),
    getTestimonials(),
  ]);
  const wa = whatsappLink(settings.whatsapp, "Hi GNS, I'd like to ask about your equipment.");

  // Two products with photos from each collection.
  const picks = collections.flatMap((c) =>
    products.filter((p) => p.collectionSlug === c.slug && p.image?.asset).slice(0, 2),
  );

  // Tells Google who GNS is (name, logo, contact, socials) so brand searches show the right site.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: settings.companyName || "GNS Commercial Equipment",
    alternateName: ["GNS", "GNS Commercial"],
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    description:
      "Commercial kitchen and retail equipment supplier in Johor, Malaysia – refrigeration, stainless steel fabrication, racking systems and food processing machines.",
    foundingDate: "2019",
    telephone: settings.phones?.[0],
    email: settings.email,
    address: settings.address,
    hasMap: settings.mapUrl,
    areaServed: ["Malaysia", "Singapore"],
    sameAs: settings.socialLinks?.map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            orgJsonLd,
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "GNS Commercial Equipment",
              alternateName: ["GNS", "GNS Commercial"],
              url: `${SITE_URL}/`,
            },
          ]).replace(/</g, "\\u003c"),
        }}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-10">
          {HERO_IMAGES.map((src, i) => (
            <div key={src} className="hero-slide absolute inset-0">
              <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        </div>
        <Container className="py-24 sm:py-32 lg:py-40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">Trusted F&amp;B &amp; retail partner</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            From vision to full-scale F&amp;B &amp; retail operations
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            High-quality commercial kitchen and retail equipment – from refrigeration and bakery ovens to custom
            stainless steel – engineered for durability and operational efficiency.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/shop">Browse products</ButtonLink>
            {wa && (
              <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                <WhatsAppIcon /> WhatsApp us
              </ButtonLink>
            )}
          </div>
          <p className="mt-8 text-sm text-white/60">Since 2019 · Based in Malaysia &amp; Singapore</p>
        </Container>
      </section>

      {/* Collections */}
      <section>
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Collections" title="Commercial-grade equipment" />
            <ButtonLink href="/shop" variant="outline">
              View all products
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c) => (
              <CollectionCard key={c._id} c={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* Who we are + stats */}
      <section className="bg-soft">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="Driven by expertise, focused on retail & F&B excellence"
              intro="GNS Commercial Equipment provides high-quality commercial kitchen and retail equipment tailored to the needs of the food and retail industries. From concept design to high-performance hardware, we are your partner in operational efficiency and commercial success."
            />
            <div className="mt-6">
              <ButtonLink href="/about" variant="dark">
                Learn more about us
              </ButtonLink>
            </div>
          </div>
          {settings.stats?.length ? (
            <dl className="grid grid-cols-2 gap-4">
              {settings.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white p-6">
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold text-brand sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </section>

      {/* Services */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Our expertise"
            title="Comprehensive solutions for every F&B and retail business"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s._id} s={s} />
            ))}
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="bg-soft">
        <Container className="py-16 sm:py-20">
          <SectionHeading eyebrow="Industries" title="Built for every industry" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INDUSTRIES.map((ind) => (
              <div key={ind.title} className="rounded-2xl bg-white p-6">
                <h3 className="font-semibold">{ind.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{ind.text}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {ind.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-brand">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Products */}
      {picks.length > 0 && (
        <section>
          <Container className="py-16 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Equipment portfolio" title="Explore our product range" />
              <ButtonLink href="/shop" variant="outline">
                View all products
              </ButtonLink>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {picks.map((p) => (
                <li key={p._id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Case studies */}
      {caseStudies.length > 0 && (
        <section className="bg-soft">
          <Container className="py-16 sm:py-20">
            <SectionHeading eyebrow="Real-world success" title="Real results from real projects" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {caseStudies.map((c) => (
                <CaseStudyCard key={c._id} c={c} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section>
          <Container className="py-16 sm:py-20">
            <SectionHeading eyebrow="Happy clients" title="Trusted by clients, proven by results" center />
            <div className="mx-auto mt-10 grid max-w-4xl gap-6">
              {testimonials.map((t) => (
                <figure key={t._id} className="rounded-2xl border border-line p-8 text-center">
                  <p className="text-brand" aria-label="5 out of 5 stars">
                    ★★★★★
                  </p>
                  <blockquote className="mt-4 text-lg leading-8">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 font-semibold">
                    {t.name}
                    {t.company && <span className="font-normal text-muted"> · {t.company}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
