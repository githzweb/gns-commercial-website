import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

// Build a resized image URL from a Sanity image field, e.g.
// urlFor(product.images[0]).width(800).url()
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
