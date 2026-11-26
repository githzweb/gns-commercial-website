import { telLink, whatsappLink } from "@/lib/site";
import type { Branch } from "@/sanity/lib/types";

import { SanityImage } from "./sanity-image";
import { WhatsAppIcon } from "./ui";

/** Free Google Maps embed (no API key) for an address. */
function mapEmbed(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function mapLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function BranchCard({ b }: { b: Branch }) {
  const wa = whatsappLink(b.whatsapp, `Hi GNS (${b.name}), I'd like to ask about your equipment.`);
  const hasMap = b.showMap !== false && !!b.address;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      {b.photo?.asset?._ref ? (
        <div className="relative aspect-[16/9] bg-soft">
          <SanityImage image={b.photo} alt={b.photo.alt || b.name} width={900} sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : hasMap ? (
        <iframe
          title={`Map: ${b.name}`}
          src={mapEmbed(b.address!)}
          className="aspect-[16/9] w-full border-0 bg-soft"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-ink p-6 text-center text-white">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">{b.country}</p>
            <p className="mt-1 text-lg font-semibold">{b.name}</p>
            <p className="mt-1 text-sm text-white/70">Call or WhatsApp us for directions</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {b.country && <span className="rounded-full bg-soft px-2.5 py-0.5 text-xs font-medium">{b.country}</span>}
          {b.kind && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{b.kind}</span>}
        </div>
        <h3 className="mt-3 text-xl font-semibold">{b.name}</h3>
        {b.tradingName && <p className="text-sm text-muted">Trading as {b.tradingName}</p>}
        {b.summary && <p className="mt-3 text-sm leading-6 text-muted">{b.summary}</p>}

        <dl className="mt-5 space-y-4 text-sm">
          {b.address && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Address</dt>
              <dd className="mt-1 leading-6">
                {b.address}
                <a href={mapLink(b.address)} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-brand">
                  Open in Google Maps →
                </a>
              </dd>
            </div>
          )}
          {b.otherAddress && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Registered office</dt>
              <dd className="mt-1 leading-6">{b.otherAddress}</dd>
            </div>
          )}
          {b.phones?.length ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Phone / WhatsApp</dt>
              <dd className="mt-1">
                {b.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="block font-medium hover:text-brand">
                    {p}
                  </a>
                ))}
              </dd>
            </div>
          ) : null}
          {b.openingHours && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Opening hours</dt>
              <dd className="mt-1 whitespace-pre-line leading-6">{b.openingHours}</dd>
            </div>
          )}
          {b.website && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Website</dt>
              <dd className="mt-1">
                <a href={b.website} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                  {b.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {wa && (
          <div className="mt-auto pt-6">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
            >
              <WhatsAppIcon /> WhatsApp this branch
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export function BranchesGrid({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((b) => (
        <BranchCard key={b._key} b={b} />
      ))}
    </div>
  );
}
