import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS, telLink } from "@/lib/site";
import { getCollections, getSiteSettings } from "@/sanity/lib/data";

import { Container } from "./ui";

export async function SiteFooter() {
  const [settings, collections] = await Promise.all([getSiteSettings(), getCollections()]);

  return (
    <footer className="mt-auto bg-ink text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="" width={48} height={48} className="rounded-full bg-white" />
            <p className="font-semibold text-white">{settings.companyName ?? "GNS Commercial Equipment"}</p>
          </div>
          <p className="mt-4 text-sm leading-6">
            Commercial kitchen and retail equipment for F&amp;B and retail businesses in Malaysia and Singapore.
          </p>
          {settings.socialLinks?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {settings.socialLinks.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs hover:border-white hover:text-white"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Products</p>
          <ul className="mt-4 space-y-2 text-sm">
            {collections.map((c) => (
              <li key={c._id}>
                <Link href={`/shop/collections/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/legal-pages/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-white">Contact</p>
          {settings.address && <p className="mt-4 leading-6">{settings.address}</p>}
          <ul className="mt-3 space-y-1">
            {settings.phones?.map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="hover:text-white">
                  {p}
                </a>
              </li>
            ))}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
          {settings.openingHours && <p className="mt-3 whitespace-pre-line leading-6">{settings.openingHours}</p>}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 text-xs text-white/50">
          © GNS Commercial Equipment (GNS Group Resources). All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
