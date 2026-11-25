import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ShopBrowser, ShopBrowserSkeleton } from "@/components/shop-browser";
import { Container, PageHeader } from "@/components/ui";
import { getCollections } from "@/sanity/lib/data";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = (await getCollections()).find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.description,
    alternates: { canonical: `/shop/collections/${slug}` },
  };
}

export default function CollectionPage(props: PageProps<"/shop/collections/[slug]">) {
  return (
    <Suspense
      fallback={
        <Container className="py-10">
          <ShopBrowserSkeleton />
        </Container>
      }
    >
      {Promise.all([props.params, props.searchParams]).then(([{ slug }, sp]) => (
        <CollectionContent slug={slug} filters={{ q: str(sp.q), sub: str(sp.sub), page: str(sp.page) }} />
      ))}
    </Suspense>
  );
}

async function CollectionContent({ slug, filters }: { slug: string; filters: { q?: string; sub?: string; page?: string } }) {
  const collection = (await getCollections()).find((c) => c.slug === slug);
  if (!collection) notFound();
  return (
    <>
      <PageHeader eyebrow="Collection" title={collection.name} intro={collection.description} />
      <Container className="py-10">
        <ShopBrowser collection={slug} filters={filters} />
      </Container>
    </>
  );
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
