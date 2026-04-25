import "server-only";

import { logger } from "@/lib/logger";

/**
 * Allegro REST API client.
 *
 * Auth: OAuth2 device flow. Client credentials are kept in env
 * (ALLEGRO_CLIENT_ID, ALLEGRO_CLIENT_SECRET). Per-user/admin refresh
 * tokens are persisted in `settings` table under `admin.allegro_refresh_token`
 * (encrypt with Supabase Vault before reading in production).
 *
 * Phase 4 ships only the structural skeleton — the actual OAuth flow and
 * full mapping live in follow-up work. The stub is good enough to be
 * imported and unit-tested.
 */

const BASE_URL = "https://api.allegro.pl";

export type AllegroOffer = {
  id: string;
  name: string;
  primaryImage?: { url: string };
  images?: Array<{ url: string }>;
  sellingMode?: { price?: { amount: string; currency: string } };
  description?: { sections?: Array<{ items?: Array<{ content?: string }> }> };
  parameters?: Array<{ name: string; values?: string[] }>;
};

export class AllegroClient {
  constructor(private accessToken: string) {}

  async getOffer(offerId: string): Promise<AllegroOffer | null> {
    try {
      const res = await fetch(`${BASE_URL}/sale/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
        next: { revalidate: 3600, tags: [`allegro:offer:${offerId}`] },
      });
      if (!res.ok) {
        logger.warn(
          { offerId, status: res.status },
          "Allegro offer fetch failed",
        );
        return null;
      }
      return (await res.json()) as AllegroOffer;
    } catch (err) {
      logger.error({ err, offerId }, "Allegro client error");
      return null;
    }
  }

  async listMyOffers(opts: { limit?: number; offset?: number } = {}) {
    const params = new URLSearchParams({
      limit: String(opts.limit ?? 100),
      offset: String(opts.offset ?? 0),
    });
    try {
      const res = await fetch(`${BASE_URL}/sale/offers?${params}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
      });
      if (!res.ok) return { offers: [] as AllegroOffer[] };
      const data = (await res.json()) as { offers?: AllegroOffer[] };
      return { offers: data.offers ?? [] };
    } catch (err) {
      logger.error({ err }, "Allegro listMyOffers error");
      return { offers: [] as AllegroOffer[] };
    }
  }
}

/**
 * Refresh a stored OAuth refresh token. Returns a fresh access token,
 * or null if refresh fails (caller should prompt the admin to re-auth).
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} | null> {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    logger.warn("ALLEGRO_CLIENT_ID/SECRET not configured");
    return null;
  }
  try {
    const res = await fetch("https://allegro.pl/auth/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (err) {
    logger.error({ err }, "Allegro token refresh failed");
    return null;
  }
}
