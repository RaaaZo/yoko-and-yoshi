import Script from "next/script";

/**
 * Plausible analytics — privacy-friendly, cookieless, GDPR-compliant.
 * Renders the script only if NEXT_PUBLIC_PLAUSIBLE_DOMAIN is configured.
 */
export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
