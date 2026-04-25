import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Sub = {
  id: string;
  email: string;
  confirmed: boolean;
  subscribed_at: string;
  source: string | null;
};

export default async function NewsletterAdminPage() {
  const supabase = await getSupabaseServerClient();
  const { data, count } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, confirmed, subscribed_at, source", { count: "exact" })
    .order("subscribed_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as Sub[];

  return (
    <div>
      <Badge tone="cyan">Newsletter</Badge>
      <h1 className="mt-2 mb-2">Subskrybenci ({count ?? 0})</h1>
      <p className="text-text-secondary mb-6">
        Eksport CSV i compose maila — wkrótce.
      </p>

      <div className="bg-bg-surface border-border-soft overflow-hidden rounded-lg border-[1.5px]">
        <table className="w-full text-[0.92rem]">
          <thead className="bg-bg-elevated text-text-muted text-[0.78rem] uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Źródło</th>
              <th className="px-4 py-3 text-left">Zapis</th>
            </tr>
          </thead>
          <tbody className="divide-border-soft divide-y">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">
                  {r.confirmed ? (
                    <Badge tone="success">Potwierdzony</Badge>
                  ) : (
                    <Badge tone="cream">Pending</Badge>
                  )}
                </td>
                <td className="text-text-muted px-4 py-3">{r.source ?? "—"}</td>
                <td className="text-text-muted px-4 py-3 text-[0.85rem]">
                  {new Date(r.subscribed_at).toLocaleString("pl-PL")}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-text-secondary px-4 py-12 text-center"
                >
                  Brak subskrybentów.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
