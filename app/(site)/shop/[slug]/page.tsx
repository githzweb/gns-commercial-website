import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableText } from "@/components/portable-text";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { SanityImage } from "@/components/sanity-image";
import { ButtonLink, Container, WhatsAppIcon } from "@/components/ui";
import { SITE_URL, whatsappLink } from "@/lib/site";
import { getAllProducts, getProduct, getSiteSettings } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return {};
  const image = p.images?.[0]?.asset ? urlFor(p.images[0]).width(1200).url() : undefined;
  return {
    title: p.seoTitle || p.name,
    description: p.seoDescription || p.shortDescription,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: { images: image ? [image] : undefined },
  };
}

export default function ProductPage(props: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      {props.params.then(({ slug }) => (
        <ProductContent slug={slug} />
      ))}
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <Container className="grid gap-10 py-16 lg:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-soft" />
      <div className="space-y-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-24 animate-pulse rounded bg-soft" />
      </div>
    </Container>
  );
}

async function ProductContent({ slug }: { slug: string }) {
  const [product, settings, all] = await Promise.all([getProduct(slug), getSiteSettings(), getAllProducts()]);
  if (!product) notFound();

  const url = `${SITE_URL}/shop/${product.slug}`;
  const wa = whatsappLink(settings.whatsapp, `Hi GNS, I'm interested in ${product.name}. ${url}`);
  const images = product.images?.filter((i) => i.asset) ?? [];

  // Related: same sub-category first, then same collection.
  const related = all
    .filter((p) => p._id !== product._id && p.collectionSlug === product.collectionSlug)
    .sort((a, b) => {
      const score = (p: typeof a) => p.subSlugs.filter((s) => product.subSlugs.includes(s)).length;
      return score(b) - score(a);
    })
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.modelCode,
    description: product.shortDescription,
    image: images.map((i) => urlFor(i).width(1200).url()),
    brand: { "@type": "Brand", name: "GNS Commercial Equipment" },
    category: product.collectionName,
  };

  return (
    <>
      <Container className="py-6">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-ink">
            Products
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/shop/collections/${product.collectionSlug}`} className="hover:text-ink">
            {product.collectionName}
          </Link>
        </nav>
      </Container>

      <Container className="grid gap-10 pb-16 lg:grid-cols-2">
        <ProductGallery
          slides={
            images.length
              ? images.map((img, i) => (
                  <SanityImage
                    key={i}
                    image={img}
                    alt={product.name}
                    width={1000}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-6"
                    priority={i === 0}
                  />
                ))
              : [<SanityImage key="none" image={null} alt={product.name} />]
          }
          thumbs={images.map((img, i) => (
            <SanityImage key={i} image={img} alt="" width={160} sizes="80px" className="object-contain p-1" />
          ))}
        />

        <div>
          {product.subCategories.length > 0 && (
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              {product.subCategories.map((s) => s.name).join(" · ")}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          {product.modelCode && <p className="mt-2 text-sm text-muted">Model: {product.modelCode}</p>}
          {product.shortDescription && <p className="mt-5 leading-7 text-muted">{product.shortDescription}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {wa && (
              <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                <WhatsAppIcon /> Ask on WhatsApp
              </ButtonLink>
            )}
            <ButtonLink href={`/contact?product=${encodeURIComponent(product.name)}`} variant="outline">
              Request a quote
            </ButtonLink>
          </div>
          <p className="mt-3 text-xs text-muted">Prices on request – we usually reply within working hours.</p>

          {product.specs?.length ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Specifications</h2>
              <dl className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line text-sm">
                {product.specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-[40%_1fr] gap-3 px-4 py-3 odd:bg-soft">
                    <dt className="font-medium">{s.label}</dt>
                    <dd className="text-muted">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {product.details?.length ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Product details</h2>
              <div className="mt-3 text-sm">
                <PortableText value={product.details} />
              </div>
            </div>
          ) : null}

          {product.deliveryNote && (
            <div className="mt-8 rounded-xl bg-soft p-4 text-sm">
              <p className="font-semibold">Shipping &amp; returns</p>
              <p className="mt-1 text-muted">{product.deliveryNote}</p>
            </div>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line bg-soft">
          <Container className="py-14">
            <h2 className="text-2xl font-semibold">Related products</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p._id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
