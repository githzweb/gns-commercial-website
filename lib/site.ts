// Small shared helpers for the public site.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Products" },
  { href: "/service", label: "Services" },
  { href: "/case-study", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** wa.me link with an optional pre-filled message. */
export function whatsappLink(number: string | undefined, message?: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** "+6012-242 4758" -> "tel:+60122424758" */
export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
