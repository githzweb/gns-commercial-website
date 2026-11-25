import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Container } from "@/components/ui";

// Shown for any unknown URL and when a page calls notFound().
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="flex flex-col items-center py-24 text-center">
          <p className="text-sm font-semibold text-brand">404</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Page not found</h1>
          <p className="mt-3 max-w-md text-muted">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Try our product catalogue instead.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/shop">Browse products</ButtonLink>
            <ButtonLink href="/" variant="outline">
              Go home
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
