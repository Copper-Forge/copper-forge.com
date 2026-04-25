import type { Metadata } from "next";
import Link from "next/link";

import { siteContent } from "@/content/site-content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for inquiries submitted to Copper Forge.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl border border-charcoal-800 bg-charcoal-900/85 p-8 lg:p-10">
        <p className="font-heading text-sm uppercase tracking-[0.24em] text-copper-accent-400">
          {siteContent.brand.name}
        </p>
        <h1 className="mt-3 font-heading text-4xl uppercase tracking-[0.08em] text-ivory-50">
          {siteContent.privacy.title}
        </h1>
        <p className="mt-3 text-steel-300">
          Effective date: {siteContent.privacy.effectiveDate}
        </p>

        <div className="mt-8 space-y-6">
          {siteContent.privacy.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="font-heading text-2xl uppercase tracking-[0.08em] text-copper-200">
                {section.heading}
              </h2>
              <p className="leading-relaxed text-steel-300">{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full border border-charcoal-700 px-6 py-3 font-heading text-sm uppercase tracking-[0.2em] text-ivory-100 transition hover:border-copper-700 hover:text-copper-accent-300"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
