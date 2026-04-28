import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ContactMessageActions } from "./contact-message-actions";

export const dynamic = "force-dynamic";

type ContactStatus = "new" | "in_progress" | "resolved" | "spam";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  resolved_at: string | null;
};

const STATUS_LABEL: Record<ContactStatus, string> = {
  new: "Nowa",
  in_progress: "W toku",
  resolved: "Rozwiązana",
  spam: "Spam",
};

const STATUS_TONE: Record<
  ContactStatus,
  "primary" | "secondary" | "cream" | "success"
> = {
  new: "primary",
  in_progress: "secondary",
  resolved: "success",
  spam: "cream",
};

export default async function ContactAdminPage() {
  const supabase = await getSupabaseServerClient();
  const { data, count } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, status, created_at, resolved_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as Message[];
  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <div>
      <Badge tone="cyan">Kontakt</Badge>
      <h1 className="mt-2 mb-2">Wiadomości ({count ?? 0})</h1>
      <p className="text-text-secondary mb-6">
        {newCount > 0
          ? `${newCount} ${pluralize(newCount, "nowa", "nowe", "nowych")} do przeczytania.`
          : "Wszystko ogarnięte."}
      </p>

      {rows.length === 0 ? (
        <div className="bg-bg-surface border-border-soft rounded-lg border-2 border-dashed p-12 text-center">
          <p className="text-text-secondary">
            Brak wiadomości. Gdy ktoś wyśle coś przez formularz kontaktowy,
            pojawi się tutaj.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {rows.map((msg) => (
            <li
              key={msg.id}
              className="bg-bg-surface border-border-soft rounded-lg border-[1.5px] p-5"
            >
              <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-semibold">
                      {msg.name}
                    </span>
                    <Badge tone={STATUS_TONE[msg.status]}>
                      {STATUS_LABEL[msg.status]}
                    </Badge>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-accent-cyan text-[0.88rem] hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
                <div className="text-text-muted text-[0.82rem]">
                  {new Date(msg.created_at).toLocaleString("pl-PL")}
                </div>
              </header>
              <p className="text-text-primary mb-4 whitespace-pre-line text-[0.95rem] leading-relaxed">
                {msg.message}
              </p>
              <ContactMessageActions id={msg.id} status={msg.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const lastTwo = n % 100;
  const last = n % 10;
  if (n === 1) return one;
  if (lastTwo >= 12 && lastTwo <= 14) return many;
  if (last >= 2 && last <= 4) return few;
  return many;
}
