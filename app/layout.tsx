import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SITE_URL } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GNS Commercial Equipment | Commercial Kitchen & Retail Equipment in Johor",
    template: "%s | GNS Commercial Equipment",
  },
  description:
    "GNS Commercial Equipment supplies commercial kitchen and retail equipment in Malaysia and Singapore – refrigeration, stainless steel fabrication, racking systems and food processing machines.",
  applicationName: "GNS Commercial Equipment",
  keywords: [
    "GNS",
    "GNS Commercial Equipment",
    "commercial kitchen equipment Johor",
    "commercial refrigerator Malaysia",
    "stainless steel kitchen equipment",
  ],
  openGraph: {
    siteName: "GNS Commercial Equipment",
    locale: "en_MY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
