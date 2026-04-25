import { CookieBanner } from "@/components/brand/cookie-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-bg-base min-h-[calc(100vh-200px)]">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
