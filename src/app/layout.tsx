import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { Toaster } from "sonner";

import { PlausibleAnalytics } from "@/components/brand/plausible";
import { cn } from "@/lib/utils";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yokoyoshi.pl",
  ),
  title: {
    default:
      "Yoko & Yoshi — polski przewodnik dla opiekunów psów, kotów i shib",
    template: "%s | Yoko & Yoshi",
  },
  description:
    "Polski przewodnik dla opiekunów psów i kotów. Polecamy najlepsze akcesoria — ze szczególnym targetem na shiby. Klikasz, kupujesz na Allegro, dostajesz pod drzwi.",
  applicationName: "Yoko & Yoshi",
  authors: [{ name: "Yoko & Yoshi" }],
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Yoko & Yoshi",
  },
  twitter: { card: "summary_large_image" },
  // No `icons` here — Next.js auto-detects src/app/icon.png and apple-icon.png
  // via the metadata file convention.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={cn(nunito.variable, dmSans.variable)}>
      <body className="bg-bg-base text-text-primary font-body min-h-screen antialiased">
        {children}
        <PlausibleAnalytics />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              borderRadius: "var(--radius-md)",
            },
          }}
        />
      </body>
    </html>
  );
}
