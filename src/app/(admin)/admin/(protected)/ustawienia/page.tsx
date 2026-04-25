import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Setting = { key: string; value: unknown; updated_at: string };

export default async function SettingsPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value, updated_at")
    .order("key");

  const rows = (data ?? []) as Setting[];

  return (
    <div>
      <Badge tone="cyan">Ustawienia</Badge>
      <h1 className="mt-2 mb-2">Konfiguracja serwisu</h1>
      <p className="text-text-secondary mb-6">
        Wartości w tabeli <code>settings</code>. Edycja inline — wkrótce.
        Obecnie aktualizuj przez SQL w Supabase Studio.
      </p>

      <div className="bg-bg-surface border-border-soft overflow-hidden rounded-lg border-[1.5px]">
        <table className="w-full text-[0.92rem]">
          <thead className="bg-bg-elevated text-text-muted text-[0.78rem] uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Klucz</th>
              <th className="px-4 py-3 text-left">Wartość</th>
              <th className="px-4 py-3 text-left">Zmiana</th>
            </tr>
          </thead>
          <tbody className="divide-border-soft divide-y">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="font-mono text-[0.85rem]">
                  <span className="inline-block px-4 py-3">{r.key}</span>
                </td>
                <td className="text-text-secondary px-4 py-3 font-mono text-[0.85rem]">
                  {JSON.stringify(r.value)}
                </td>
                <td className="text-text-muted px-4 py-3 text-[0.85rem]">
                  {new Date(r.updated_at).toLocaleDateString("pl-PL")}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-text-secondary px-4 py-12 text-center"
                >
                  Pusto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
