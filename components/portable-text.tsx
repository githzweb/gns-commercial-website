import { PortableText as BasePortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 text-muted">{children}</p>,
    h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-ink">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-5 text-muted">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-5 text-muted">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="text-brand underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export function PortableText({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="space-y-4">
      <BasePortableText value={value} components={components} />
    </div>
  );
}
