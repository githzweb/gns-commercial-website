import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopBrowser, ShopBrowserSkeleton } from "@/components/shop-browser";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse 300+ commercial refrigerators, stainless steel equipment, racking systems and food processing machines. Enquire on WhatsApp for prices.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <>
      <PageHeader
        eyebrow="Our equipment"
        title="Explore our equipment"
        intro="High-performance commercial solutions for F&B and retail businesses. Search by name or model and enquire on WhatsApp for prices."
      />
      <Container className="py-10">
        <Suspense fallback={<ShopBrowserSkeleton />}>
          {props.searchParams.then((sp) => (
            <ShopBrowser filters={{ q: str(sp.q), sub: str(sp.sub), page: str(sp.page) }} />
          ))}
        </Suspense>
      </Container>
    </>
  );
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
