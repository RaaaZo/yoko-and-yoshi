/**
 * No-op Supabase client.
 *
 * Used when NEXT_PUBLIC_SUPABASE_URL / *_ANON_KEY are missing so the app
 * doesn't crash at server-render time. Every terminal query resolves to
 * `{ data: null/[], error: { message } }` — query helpers in lib/db
 * already treat that as "no data" and return empty arrays.
 *
 * The intent is graceful degradation in dev (run `pnpm dev` with no
 * .env.local) and a defensive net in prod (missing env shouldn't 500
 * the public site — it should render empty and log loudly).
 */

import { logger } from "@/lib/logger";

const ERR = {
  message:
    "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
  code: "supabase_not_configured",
} as const;

let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  logger.warn(ERR.message);
}

type Terminal = Promise<{ data: null; error: typeof ERR }> & {
  data: null;
  error: typeof ERR;
};

function makeTerminal(): Terminal {
  warnOnce();
  const result = { data: null, error: ERR };
  const promise = Promise.resolve(result) as Terminal;
  // expose data/error directly so callers using `await` or destructuring both work
  Object.assign(promise, result);
  return promise;
}

// Chainable PostgREST-shaped query builder. Every method returns the same
// proxy so chains like .from().select().eq().eq().order().limit() compose
// correctly. Awaiting or terminal calls (single, maybeSingle, then, etc.)
// resolve to the stub error response.
function makeQueryProxy(): unknown {
  const target: Record<string, unknown> = {};
  const handler: ProxyHandler<typeof target> = {
    get(_t, prop) {
      if (prop === "then") {
        // Awaiting the proxy directly behaves like awaiting a terminal —
        // returns `{ data: [], error }` so list queries get an empty array.
        return (resolve: (v: { data: never[]; error: typeof ERR }) => void) => {
          warnOnce();
          resolve({ data: [], error: ERR });
        };
      }
      if (prop === "catch" || prop === "finally") {
        return () => proxy;
      }
      if (prop === "single" || prop === "maybeSingle") {
        return () => makeTerminal();
      }
      // Terminal-ish helpers used in admin (csv/explain): same fallback.
      if (prop === "csv" || prop === "explain" || prop === "geojson") {
        return () => makeTerminal();
      }
      // Every other method returns the chainable proxy.
      return () => proxy;
    },
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

export type StubSupabaseClient = {
  from: (table: string) => unknown;
  rpc: (fn: string, args?: unknown) => unknown;
  auth: {
    getUser: () => Promise<{
      data: { user: null };
      error: typeof ERR;
    }>;
    getSession: () => Promise<{
      data: { session: null };
      error: typeof ERR;
    }>;
    signInWithPassword: () => Promise<{
      data: { user: null; session: null };
      error: typeof ERR;
    }>;
    signOut: () => Promise<{ error: null }>;
    signInWithOtp: () => Promise<{ data: null; error: typeof ERR }>;
  };
  storage: {
    from: (bucket: string) => unknown;
  };
};

export function createStubSupabaseClient(): StubSupabaseClient {
  warnOnce();
  return {
    from: () => makeQueryProxy(),
    rpc: () => makeQueryProxy(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: ERR }),
      getSession: async () => ({ data: { session: null }, error: ERR }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: ERR,
      }),
      signOut: async () => ({ error: null }),
      signInWithOtp: async () => ({ data: null, error: ERR }),
    },
    storage: {
      from: () => makeQueryProxy(),
    },
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
