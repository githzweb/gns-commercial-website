import { whatsappLink } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/data";

import { ButtonLink, Container, WhatsAppIcon } from "./ui";

export async function CtaBand({
  title = "Ready to start your next project?",
  text = "Tell us about your kitchen or store. We'll help with layout, equipment selection and a quotation.",
}: {
  title?: string;
  text?: string;
}) {
  const settings = await getSiteSettings();
  const wa = whatsappLink(settings.whatsapp, "Hi GNS, I'd like to discuss a project.");
  return (
    <section className="bg-ink text-white">
      <Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          <p className="mt-3 text-white/70">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {wa && (
            <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp">
              <WhatsAppIcon /> WhatsApp us
            </ButtonLink>
          )}
          <ButtonLink href="/contact">Get a quote</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
