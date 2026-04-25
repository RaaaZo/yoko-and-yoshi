import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { Toaster } from "sonner";
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
    default: "Yoko & Yoshi — sklep dla shibowiarzy i innych zwierzaków",
    template: "%s | Yoko & Yoshi",
  },
  description:
    "Kuratorska selekcja zabawek, akcesoriów i pielęgnacji dla psów, kotów i innych zwierząt — ze szczególną miłością do shib. Klikasz, kupujesz na Allegro, dostajesz pod drzwi.",
  applicationName: "Yoko & Yoshi",
  authors: [{ name: "Yoko & Yoshi" }],
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Yoko & Yoshi",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={cn(nunito.variable, dmSans.variable)}>
      <body className="bg-bg-base text-text-primary font-body min-h-screen antialiased">
        {children}
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
