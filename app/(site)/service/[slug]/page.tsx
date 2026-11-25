import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CtaBand } from "@/components/cta-band";
import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { getService, getServices } from "@/sanity/lib/data";

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/service/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = await getService(slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: { canonical: `/service/${slug}` } };
}

export default function ServicePage(props: PageProps<"/service/[slug]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-soft" />}>
      {props.params.then(({ slug }) => (
        <ServiceContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function ServiceContent({ slug }: { slug: string }) {
  const [service, all] = await Promise.all([getService(slug), getServices()]);
  if (!service) notFound();
  const others = all.filter((s) => s.slug !== slug);
  const faqs = service.faqs?.filter((f) => f.answer) ?? [];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-10 opacity-50">
          <SanityImage image={service.image} alt="" width={1600} className="object-cover" priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 to-black/30" />
        <Container className="py-20 sm:py-28">
          <Link href="/service" className="text-sm text-white/70 hover:text-white">
            ← All services
          </Link>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{service.title}</h1>
          {service.summary && <p className="mt-5 max-w-2xl text-lg text-white/80">{service.summary}</p>}
          <div className="mt-8">
            <ButtonLink href={`/contact?service=${encodeURIComponent(service.title)}`}>Get a free quote</ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>Service overview</Eyebrow>
          <div className="mt-4 text-base">
            <PortableText value={service.overview} />
          </div>
        </div>
        {service.features?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f.title} className="rounded-2xl bg-soft p-5">
                <p className="font-semibold">{f.title}</p>
                {f.text && <p className="mt-2 text-sm leading-6 text-muted">{f.text}</p>}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>

      {service.capabilities?.length ? (
        <section className="bg-soft">
          <Container className="py-16">
            <SectionHeading eyebrow="Capabilities" title="What's included" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {service.capabilities.map((c) => (
                <div key={c.title} className="rounded-2xl bg-white p-6">
                  <h3 className="font-semibold">{c.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {c.items?.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-brand">✓</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {service.workflow?.length ? (
        <Container className="py-16">
          <SectionHeading eyebrow="Simple & transparent" title="Our proven workflow" />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {service.workflow.map((step, i) => (
              <li key={step} className="rounded-2xl border border-line p-6">
                <p className="text-sm font-semibold text-brand">Step {i + 1}</p>
                <p className="mt-2 text-lg font-semibold">{step}</p>
              </li>
            ))}
          </ol>
          {service.brochureUrl && (
            <div className="mt-6">
              <ButtonLink href={service.brochureUrl} variant="outline" target="_blank">
                Download brochure
              </ButtonLink>
            </div>
          )}
        </Container>
      ) : null}

      {faqs.length > 0 && (
        <section className="bg-soft">
          <Container className="py-16">
            <SectionHeading eyebrow="Common questions" title="Frequently asked questions" />
            <div className="mt-8 max-w-3xl divide-y divide-line rounded-2xl bg-white">
              {faqs.map((f) => (
                <details key={f.question} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.question}
                    <span className="text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {others.length > 0 && (
        <Container className="py-16">
          <h2 className="text-2xl font-semibold">Other services</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((s) => (
              <li key={s._id}>
                <Link
                  href={`/service/${s.slug}`}
                  className="block h-full rounded-xl border border-line p-4 text-sm font-medium hover:border-ink"
                >
                  {s.title} →
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <CtaBand />
    </>
  );
}
