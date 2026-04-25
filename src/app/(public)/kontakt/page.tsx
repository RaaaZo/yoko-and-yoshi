import { ContactForm } from "./contact-form";

import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z Yoko & Yoshi — pytania o produkty, propozycje współpracy, zgłoszenia błędów.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Badge tone="cyan">Kontakt</Badge>
        <h1 className="mt-4 mb-3 text-[3rem] leading-tight">
          Powiedz nam coś.
        </h1>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed">
          Pytanie o produkt, propozycja współpracy, zgłoszenie błędu — piszemy z
          reguły tego samego dnia.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
