import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /studio is kept out of Google by its own `noindex` tag (from next-sanity),
    // so it isn't listed here – robots.txt is public and shouldn't point at admin pages.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
