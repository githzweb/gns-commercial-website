import type { Metadata } from "next";
import { Suspense } from "react";

import { ButtonLink, Container, PageHeader, WhatsAppIcon } from "@/components/ui";
import { telLink, whatsappLink } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/data";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact GNS Commercial Equipment in Johor Bahru for quotations, layout planning, custom stainless steel fabrication and maintenance.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const wa = whatsappLink(settings.whatsapp, "Hi GNS, I'd like to ask about your equipment.");

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Let's build your dream kitchen or store"
        intro="Our specialists can help with layout planning, technical specifications and custom equipment. Reach out for a professional consultation."
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          {wa && (
            <div className="rounded-2xl bg-soft p-6">
              <p className="font-semibold">Fastest reply: WhatsApp</p>
              <p className="mt-1 text-sm text-muted">Send us a message or a photo of what you need.</p>
              <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="mt-4">
                <WhatsAppIcon /> Chat on WhatsApp
              </ButtonLink>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Call or email</p>
            <ul className="mt-3 space-y-1">
              {settings.phones?.map((p) => (
                <li key={p}>
                  <a href={telLink(p)} className="text-lg font-medium hover:text-brand">
                    {p}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-brand">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {settings.address && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Find us</p>
              <p className="mt-3 leading-7">{settings.address}</p>
              <a
                href={settings.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-brand"
              >
                Open in Google Maps →
              </a>
            </div>
          )}
          {settings.openingHours && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Working hours</p>
              <p className="mt-3 whitespace-pre-line leading-7">{settings.openingHours}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Send us your enquiry</h2>
          <div className="mt-6">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-soft" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
