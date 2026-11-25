import Link from "next/link";

import { getAllProducts, getCollections, getSubCategories } from "@/sanity/lib/data";
import type { ProductCard as ProductCardType } from "@/sanity/lib/types";

import { ProductCard } from "./product-card";
import { ShopSearch } from "./shop-search";

const PER_PAGE = 24;

type Filters = { q?: string; sub?: string; page?: string };

// Every search word must match the start of a word in the product name/model.
// Numbers must match a whole number: "3" finds "3 DOOR" but not "SC-320L";
// "200" still finds "SC-200L".
function matches(p: ProductCardType, q: string) {
  const tokens = `${p.name} ${p.modelCode ?? ""} ${p.collectionName}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const compact = tokens.join("");
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .every(
      (word) =>
        tokens.some((t) => t.startsWith(word) && !(/^\d+$/.test(word) && /\d/.test(t[word.length] ?? ""))) ||
        (word.length >= 4 && compact.includes(word)), // e.g. "sc200l" without the dash
    );
}

/**
 * Product grid with search, sub-category filters and pagination.
 * `collection` fixes the collection (collection pages); otherwise all products.
 */
export async function ShopBrowser({ collection, filters }: { collection?: string; filters: Filters }) {
  const [products, collections, subCategories] = await Promise.all([
    getAllProducts(),
    getCollections(),
    getSubCategories(),
  ]);

  const basePath = collection ? `/shop/collections/${collection}` : "/shop";
  const q = (filters.q ?? "").trim();
  const sub = filters.sub ?? "";

  let list = collection ? products.filter((p) => p.collectionSlug === collection) : products;
  if (sub) list = list.filter((p) => p.subSlugs.includes(sub));
  if (q) list = list.filter((p) => matches(p, q));

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(filters.page) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const subs = subCategories.filter((s) => !collection || s.collectionSlug === collection);
  const href = (changes: Partial<Filters>) => {
    const params = new URLSearchParams();
    const next = { q, sub, page: undefined as string | undefined, ...changes };
    if (next.q) params.set("q", next.q);
    if (next.sub) params.set("sub", next.sub);
    if (next.page && next.page !== "1") params.set("page", next.page);
    return `${basePath}${params.size ? `?${params}` : ""}`;
  };

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Filters */}
      <aside className="min-w-0 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Collections</p>
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            <li>
              <Link href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"} className={chip(!collection)}>
                All products
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c._id}>
                <Link href={`/shop/collections/${c.slug}`} className={chip(collection === c.slug)}>
                  {c.name} <span className="opacity-60">({c.productCount})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {subs.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Categories</p>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
              <li>
                <Link href={href({ sub: "" })} className={chip(!sub)} scroll={false}>
                  All
                </Link>
              </li>
              {subs.map((s) => (
                <li key={s._id}>
                  <Link href={href({ sub: s.slug })} className={chip(sub === s.slug)} scroll={false}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Results */}
      <div className="min-w-0">
        <ShopSearch />
        <p className="mt-4 text-sm text-muted">
          {list.length} {list.length === 1 ? "product" : "products"}
          {q && (
            <>
              {" "}
              for “<span className="font-medium text-ink">{q}</span>”
            </>
          )}
        </p>

        {shown.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {shown.map((p) => (
              <li key={p._id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="font-medium">No products found.</p>
            <p className="mt-1 text-sm text-muted">Try another word, or ask us on WhatsApp – we can source it for you.</p>
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pages">
            {page > 1 && (
              <Link href={href({ page: String(page - 1) })} className={chip(false)}>
                ← Previous
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href({ page: String(n) })}
                className={chip(n === page)}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </Link>
            ))}
            {page < pages && (
              <Link href={href({ page: String(page + 1) })} className={chip(false)}>
                Next →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

export function ShopBrowserSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="h-40 animate-pulse rounded-2xl bg-soft" />
      <div>
        <div className="h-12 animate-pulse rounded-full bg-soft" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-soft" />
          ))}
        </div>
      </div>
    </div>
  );
}
