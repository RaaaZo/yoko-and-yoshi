/**
 * Supabase database types — STUB.
 *
 * Regenerate from the live schema with:
 *   SUPABASE_PROJECT_ID=<your-project-ref> pnpm db:types
 *
 * Until then, this stub satisfies @supabase/ssr generics by widening
 * every table operation to `unknown`. Queries are effectively untyped —
 * TypeScript will allow any column reference. Tighten this by running
 * the generator after the first migration push.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AnyRow = { [key: string]: unknown };

type Tables = {
  [table: string]: {
    Row: AnyRow;
    Insert: AnyRow;
    Update: AnyRow;
    Relationships: [];
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: { [view: string]: { Row: AnyRow } };
    Functions: {
      [fn: string]: { Args: AnyRow; Returns: unknown };
    };
    Enums: { [name: string]: string };
    CompositeTypes: { [name: string]: AnyRow };
  };
};
