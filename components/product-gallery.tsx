"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/** Main photo + thumbnails. Images are rendered on the server and passed in. */
export function ProductGallery({ slides, thumbs }: { slides: ReactNode[]; thumbs: ReactNode[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">{slides[active]}</div>
      {thumbs.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {thumbs.map((t, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg border bg-white ${
                  i === active ? "border-ink" : "border-line"
                }`}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
