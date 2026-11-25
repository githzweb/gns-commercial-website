import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CaseStudyCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { Container } from "@/components/ui";
import { getCaseStudies, getCaseStudy } from "@/sanity/lib/data";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary, alternates: { canonical: `/case-study/${slug}` } };
}

export default function CaseStudyPage(props: PageProps<"/case-study/[slug]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-soft" />}>
      {props.params.then(({ slug }) => (
        <CaseStudyContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function CaseStudyContent({ slug }: { slug: string }) {
  const [c, all] = await Promise.all([getCaseStudy(slug), getCaseStudies()]);
  if (!c) notFound();
  const others = all.filter((x) => x.slug !== slug).slice(0, 2);

  return (
    <>
      <Container className="pt-10">
        <Link href="/case-study" className="text-sm text-muted hover:text-ink">
          ← All case studies
        </Link>
        {c.projectType && <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand">{c.projectType}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{c.title}</h1>
        {c.summary && <p className="mt-4 max-w-2xl text-lg text-muted">{c.summary}</p>}
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl bg-soft">
          <SanityImage image={c.image} alt={c.title} width={1600} className="object-cover" priority />
        </div>
      </Container>

      {c.stats?.length ? (
        <Container className="mt-8">
          <dl className="grid grid-cols-3 gap-3 sm:gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-soft p-4 text-center sm:p-6">
                <dd className="text-2xl font-semibold text-brand sm:text-4xl">{s.value}</dd>
                <dt className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      ) : null}

      <Container className="grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <PortableText value={c.body} />
        </div>
        {c.specs?.length ? (
          <aside className="h-fit rounded-2xl border border-line p-6">
            <h2 className="font-semibold">Technical specifications</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {c.specs.map((s) => (
                <div key={s.label}>
                  <dt className="font-medium">{s.label}</dt>
                  <dd className="text-muted">{s.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </Container>

      {c.gallery?.length ? (
        <Container className="pb-16">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {c.gallery.map((img, i) => (
              <li key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-soft">
                <SanityImage image={img} alt={`${c.title} photo ${i + 1}`} width={700} sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      {others.length > 0 && (
        <section className="bg-soft">
          <Container className="py-16">
            <h2 className="text-2xl font-semibold">Other case studies</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {others.map((o) => (
                <CaseStudyCard key={o._id} c={o} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
