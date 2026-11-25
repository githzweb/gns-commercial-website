import { whatsappLink } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/data";

import { WhatsAppIcon } from "./ui";

/** Floating WhatsApp button shown on every page. */
export async function WhatsAppFloat() {
  const settings = await getSiteSettings();
  const href = whatsappLink(settings.whatsapp, "Hi GNS, I'd like to ask about your equipment.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GNS on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
