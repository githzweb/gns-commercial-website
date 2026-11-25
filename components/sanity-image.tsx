import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  image?: SanityImageType | null;
  alt: string;
  /** Width of the image requested from Sanity's CDN. */
  width?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** Fills its (relatively positioned) parent with a Sanity image, or a grey placeholder. */
export function SanityImage({ image, alt, width = 900, sizes = "100vw", className = "object-contain", priority }: Props) {
  if (!image?.asset?._ref) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-soft text-xs text-muted">
        Photo coming soon
      </div>
    );
  }
  return (
    <Image
      src={urlFor(image).width(width).url()}
      alt={image.alt || alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
