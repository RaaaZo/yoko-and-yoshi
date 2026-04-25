import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: number;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  occurred_at: string;
};

export default async function AuditLogPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("audit_log")
    .select("id, actor_id, action, entity_type, entity_id, occurred_at")
    .order("occurred_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as AuditRow[];

  return (
    <div>
      <Badge tone="cyan">Audyt</Badge>
      <h1 className="mt-2 mb-6">Dziennik akcji</h1>

      <div className="bg-bg-surface border-border-soft overflow-hidden rounded-lg border-[1.5px]">
        <table className="w-full text-[0.92rem]">
          <thead className="bg-bg-elevated text-text-muted text-[0.78rem] uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Kiedy</th>
              <th className="px-4 py-3 text-left">Akcja</th>
              <th className="px-4 py-3 text-left">Typ</th>
              <th className="px-4 py-3 text-left">Encja</th>
              <th className="px-4 py-3 text-left">Aktor</th>
            </tr>
          </thead>
          <tbody className="divide-border-soft divide-y">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="text-text-muted px-4 py-3 text-[0.85rem]">
                  {new Date(r.occurred_at).toLocaleString("pl-PL")}
                </td>
                <td className="px-4 py-3 font-semibold">{r.action}</td>
                <td className="px-4 py-3">{r.entity_type}</td>
                <td className="text-text-muted px-4 py-3 font-mono text-[0.78rem]">
                  {r.entity_id?.slice(0, 8) ?? "—"}
                </td>
                <td className="text-text-muted px-4 py-3 font-mono text-[0.78rem]">
                  {r.actor_id?.slice(0, 8) ?? "system"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-text-secondary px-4 py-12 text-center"
                >
                  Pusto. Wpisy zaczną się pojawiać przy pierwszych akcjach
                  administracyjnych.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
