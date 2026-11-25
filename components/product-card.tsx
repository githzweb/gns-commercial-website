import Link from "next/link";

import type { ProductCard as ProductCardType } from "@/sanity/lib/types";

import { SanityImage } from "./sanity-image";

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square bg-white">
        <SanityImage
          image={product.image}
          alt={product.name}
          width={500}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
          className="object-contain p-4 transition group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{product.collectionName}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <span className="mt-auto pt-3 text-xs font-semibold text-brand">Enquire for price →</span>
      </div>
    </Link>
  );
}
