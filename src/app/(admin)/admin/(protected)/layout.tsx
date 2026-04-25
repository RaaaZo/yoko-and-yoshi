import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/lib/actions/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin") redirect("/");

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <AdminSidebar
        userLabel={
          (profile as { full_name?: string; email?: string } | null)
            ?.full_name ||
          (profile as { email?: string } | null)?.email ||
          "Admin"
        }
      />
      <div className="flex min-h-screen flex-col">
        <header className="bg-bg-surface border-border-soft sticky top-0 z-20 flex items-center gap-4 border-b px-6 py-3">
          <Link href="/admin" className="md:hidden">
            <Image
              src="/brand/logo-primary.png"
              alt="Yoko & Yoshi"
              width={36}
              height={36}
            />
          </Link>
          <div className="text-text-muted text-[0.78rem] tracking-[0.16em] uppercase">
            Yoko & Yoshi · admin
          </div>
          <form action={signOut} className="ml-auto">
            <button
              type="submit"
              className="text-text-secondary hover:text-text-primary text-[0.85rem] underline-offset-3 hover:underline"
            >
              Wyloguj
            </button>
          </form>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
