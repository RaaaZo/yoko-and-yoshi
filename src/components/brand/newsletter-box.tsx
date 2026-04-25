import { YokoFace, YoshiFace } from "@/components/brand/icons";

import { NewsletterForm } from "./newsletter-form";

export function NewsletterBox() {
  return (
    <div
      className="border-border-default grid items-center gap-6 rounded-xl border-2 border-dashed p-8 md:grid-cols-[auto_1fr]"
      style={{
        background:
          "linear-gradient(135deg, var(--color-secondary-soft), var(--color-primary-soft))",
      }}
    >
      <div className="flex">
        <div className="bg-bg-surface rounded-full p-1 shadow-sm">
          <YokoFace size={72} />
        </div>
        <div className="bg-bg-surface -ml-4 rounded-full p-1 shadow-sm">
          <YoshiFace size={72} />
        </div>
      </div>
      <div>
        <h3 className="mb-1.5">
          List od Yoko <span className="amp">&</span> Yoshi
        </h3>
        <p className="text-text-secondary mb-3.5 text-[0.95rem]">
          Co tydzień: nowe poradniki, kuratorska selekcja produktów, kody
          zniżkowe naszych partnerów. Zero spamu — wymachujemy ogonem.
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
}
