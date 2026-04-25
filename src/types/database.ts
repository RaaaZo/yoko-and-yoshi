/**
 * Supabase database types — STUB.
 *
 * Regenerate from the live schema with:
 *   SUPABASE_PROJECT_ID=<your-project-ref> pnpm db:types
 *
 * Until then, this stub satisfies @supabase/ssr generics. Queries are
 * effectively untyped — TypeScript will allow any column reference.
 * Tighten this by running the generator after the first migration push.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      }
    >;
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: Record<
      string,
      { Args: Record<string, unknown>; Returns: unknown }
    >;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, Record<string, unknown>>;
  };
};
