import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function ComingSoon({
  title,
  description,
  todo,
}: {
  title: string;
  description: string;
  todo?: string[];
}) {
  return (
    <div>
      <Badge tone="cream">Wkrótce</Badge>
      <h1 className="mt-2">{title}</h1>
      <p className="text-text-secondary mt-2 max-w-2xl text-lg">
        {description}
      </p>
      {todo && todo.length > 0 && (
        <div className="bg-bg-surface border-border-soft mt-6 max-w-2xl rounded-lg border-2 border-dashed p-6">
          <h2 className="text-text-muted mb-3 text-[0.85rem] font-bold tracking-wider uppercase">
            TODO
          </h2>
          <ul className="prose-yy list-disc pl-5">
            {todo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6">
        <Link
          href="/admin"
          className="text-accent-cyan text-[0.9rem] hover:underline"
        >
          ← Wróć do dashboard
        </Link>
      </div>
    </div>
  );
}
