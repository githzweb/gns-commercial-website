import Link from "next/link";

import type { CaseStudySummary, CollectionSummary, ServiceSummary } from "@/sanity/lib/types";

import { SanityImage } from "./sanity-image";

export function CollectionCard({ c }: { c: CollectionSummary }) {
  return (
    <Link
      href={`/shop/collections/${c.slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-ink text-white"
    >
      <SanityImage
        image={c.image}
        alt={c.name}
        width={800}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative p-5">
        <p className="text-xs text-white/70">{c.productCount} products</p>
        <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
        <span className="mt-2 inline-block text-sm font-medium text-brand-light">View collection →</span>
      </div>
    </Link>
  );
}

export function ServiceCard({ s }: { s: ServiceSummary }) {
  return (
    <Link
      href={`/service/${s.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-soft">
        <SanityImage
          image={s.image}
          alt={s.title}
          width={800}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{s.title}</h3>
        {s.summary && <p className="mt-2 text-sm leading-6 text-muted">{s.summary}</p>}
        {s.features?.length ? (
          <ul className="mt-4 space-y-1 text-sm">
            {s.features.slice(0, 4).map((f) => (
              <li key={f.title} className="flex gap-2">
                <span className="text-brand">✓</span>
                {f.title}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="mt-auto pt-5 text-sm font-semibold text-brand">Learn more →</span>
      </div>
    </Link>
  );
}

export function CaseStudyCard({ c }: { c: CaseStudySummary }) {
  return (
    <Link href={`/case-study/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[16/10] bg-soft">
        <SanityImage
          image={c.image}
          alt={c.title}
          width={900}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          {c.projectType && <p className="text-xs font-semibold uppercase tracking-wider text-brand">{c.projectType}</p>}
          <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
          {c.summary && <p className="mt-2 text-sm leading-6 text-muted">{c.summary}</p>}
        </div>
        {c.resultValue && (
          <div className="shrink-0 text-right">
            <p className="text-3xl font-semibold text-brand">{c.resultValue}</p>
            <p className="max-w-[8rem] text-xs text-muted">{c.resultLabel}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
