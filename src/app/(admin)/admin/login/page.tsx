import Image from "next/image";

import { LoginForm } from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logowanie · Admin",
  robots: { index: false, follow: false },
};

type SP = Promise<{ redirectTo?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-bg-base flex min-h-screen items-center justify-center px-4 py-10">
      <div className="bg-bg-surface border-border-soft w-full max-w-md rounded-lg border-[1.5px] p-8 shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/brand/logo-primary.png"
            alt="Yoko & Yoshi"
            width={56}
            height={56}
          />
          <div>
            <div className="text-text-muted text-[0.75rem] font-bold tracking-[0.18em] uppercase">
              Admin
            </div>
            <h1 className="text-2xl">Logowanie</h1>
          </div>
        </div>
        <LoginForm redirectTo={sp.redirectTo} />
      </div>
    </main>
  );
}
