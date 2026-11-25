import type { Metadata } from "next";

import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/legal-pages/privacy-policy" },
};

const SECTIONS: { title: string; intro?: string; items?: string[]; outro?: string }[] = [
  {
    title: "Information We Collect",
    intro: "We may collect the following types of information:",
    items: [
      "Personal & Contact Information: Name, email address, phone number, and delivery/billing addresses provided during checkout, account registration, or general inquiries.",
      "Order & Transaction Information: Details regarding your equipment purchases, quotation requests, payment methods, and transaction history.",
      "Usage Data: IP address, browser type, pages visited, and time spent on our site (collected automatically via cookies or analytics tools to help us optimize your browsing experience).",
    ],
  },
  {
    title: "How We Use Your Information",
    intro: "We use the information we collect to:",
    items: [
      "Process and fulfill your orders, including coordinating logistics and our Delivered by Seller (DBS) shipments.",
      "Respond to your product inquiries, warranty claims, or service requests.",
      "Provide and improve our equipment catalog and customer service.",
      "Communicate important updates regarding your order status, business updates, or promotional offers.",
      "Analyze website performance and user behavior to improve our digital storefronts.",
      "Ensure legal compliance and prevent misuse of our platforms.",
    ],
  },
  {
    title: "Sharing Your Information",
    intro: "We do not sell or trade your personal data. We may share your information with:",
    items: [
      "Trusted third-party service providers: Courier and logistics partners, payment gateways, and software providers (e.g., web hosting, analytics) who assist in operating our business and delivering your equipment.",
      "Legal authorities: Law enforcement or government agencies if required by law.",
    ],
    outro: "All third-party services comply with applicable data protection laws.",
  },
  {
    title: "Cookies & Tracking Technologies",
    intro:
      "Our website uses cookies and similar technologies to enhance user experience and gather usage statistics. You can manage or disable cookies in your browser settings.",
  },
  {
    title: "Data Security",
    intro:
      "We implement appropriate technical and organizational measures to safeguard your personal data from unauthorized access, alteration, or disclosure.",
  },
  {
    title: "Your Rights",
    intro: "You have the right to:",
    items: [
      "Access or update your personal information.",
      "Request the deletion of your data.",
      "Withdraw consent or opt-out of marketing communications at any time.",
    ],
  },
  {
    title: "Third-Party Links",
    intro:
      "Our website and digital platforms may contain links to third-party websites. We are not responsible for their content or privacy practices. We encourage you to review their privacy policies before sharing any data.",
  },
  {
    title: "Changes to This Policy",
    intro:
      "We may update this Privacy Policy from time to time to reflect changes in our operations or legal obligations. Any changes will be posted on this page with the updated date. We recommend checking back periodically to stay informed.",
  },
  {
    title: "Contact Us",
    intro:
      "If you have any questions about this Privacy Policy or how we handle your data, please contact our team at our Tebrau, Johor Bahru office or reach out through our official customer support channels.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy policy"
        intro="At GNS Commercial Equipment (operating under GNS Group Resources), we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the data you share with us when you interact with our website, our official e-commerce stores (including Shopee, Lazada, and TikTok Shop), and when purchasing our commercial kitchen and retail equipment."
      />
      <Container className="max-w-3xl py-14">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              {s.intro && <p className="mt-3 leading-7 text-muted">{s.intro}</p>}
              {s.items && (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-muted">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
              {s.outro && <p className="mt-3 leading-7 text-muted">{s.outro}</p>}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
