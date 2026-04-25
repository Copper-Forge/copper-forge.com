import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { siteContent } from "@/content/site-content";

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-charcoal-950 text-ivory-100">
      <BackgroundDecor />

      <header className="sticky top-0 z-40 border-b border-charcoal-800/80 bg-charcoal-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <Image
              src="/copper_forge_logo.png"
              alt="Copper Forge"
              width={180}
              height={56}
              className="h-auto w-36 sm:w-44"
              priority
            />
          </a>
          <nav aria-label="Primary Navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm uppercase tracking-[0.2em] text-steel-300">
              {siteContent.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-copper-accent-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#contact"
            className="rounded-full border border-copper-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-copper-200 transition hover:border-copper-500 hover:bg-copper-600/10"
          >
            Contact
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-18 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-24">
          <div className="space-y-7 animate-rise">
            <p className="font-heading text-sm uppercase tracking-[0.24em] text-copper-accent-400">
              {siteContent.hero.eyebrow}
            </p>
            <h1 className="font-heading text-4xl leading-tight text-ivory-50 sm:text-5xl lg:text-6xl">
              {siteContent.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-steel-300">
              {siteContent.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={siteContent.hero.primaryCta.href}
                className="rounded-full bg-copper-500 px-7 py-3 font-heading text-sm uppercase tracking-[0.2em] text-charcoal-950 transition hover:bg-copper-accent-500"
              >
                {siteContent.hero.primaryCta.label}
              </a>
              <a
                href={siteContent.hero.secondaryCta.href}
                className="rounded-full border border-charcoal-700 px-7 py-3 font-heading text-sm uppercase tracking-[0.2em] text-ivory-100 transition hover:border-copper-700 hover:text-copper-accent-300"
              >
                {siteContent.hero.secondaryCta.label}
              </a>
            </div>
            <ul className="space-y-2 pt-3 text-steel-300">
              {siteContent.hero.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-copper-500" aria-hidden />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="animate-rise-delayed rounded-3xl border border-charcoal-800 bg-charcoal-900/70 p-6 shadow-2xl shadow-charcoal-950/60">
            <p className="font-heading text-xs uppercase tracking-[0.25em] text-copper-accent-400">
              Why Teams Choose Copper Forge
            </p>
            <div className="mt-5 space-y-5">
              {siteContent.proof.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-charcoal-700 bg-charcoal-850 px-5 py-4">
                  <p className="font-heading text-3xl uppercase tracking-[0.08em] text-copper-300">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-steel-300">{metric.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <Section
          id="services"
          title={siteContent.services.title}
          intro={siteContent.services.intro}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {siteContent.services.items.map((service) => (
              <article
                key={service.name}
                className="group rounded-2xl border border-charcoal-800 bg-charcoal-900/65 p-6 transition hover:border-copper-700/60 hover:bg-charcoal-900"
              >
                <h3 className="font-heading text-xl uppercase tracking-[0.08em] text-ivory-50">
                  {service.name}
                </h3>
                <p className="mt-3 text-steel-300">{service.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="work" title={siteContent.proof.title} intro={siteContent.proof.intro}>
          <div className="grid gap-5 md:grid-cols-3">
            {siteContent.proof.cases.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-charcoal-800 bg-gradient-to-b from-charcoal-900 to-charcoal-900/40 p-6"
              >
                <h3 className="font-heading text-xl uppercase tracking-[0.08em] text-copper-accent-300">
                  {item.name}
                </h3>
                <p className="mt-3 text-steel-300">{item.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="about" title={siteContent.about.title} intro={siteContent.about.paragraphs[0]}>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-steel-300">
            {siteContent.about.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 rounded-3xl border border-charcoal-800 bg-charcoal-900/80 p-7 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div className="space-y-5">
              <p className="font-heading text-sm uppercase tracking-[0.25em] text-copper-accent-400">
                Contact
              </p>
              <h2 className="font-heading text-3xl uppercase tracking-[0.06em] text-ivory-50 lg:text-4xl">
                {siteContent.contact.title}
              </h2>
              <p className="text-steel-300">{siteContent.contact.intro}</p>
            </div>
            <ContactForm
              submitLabel={siteContent.contact.submitLabel}
              successMessage={siteContent.contact.successMessage}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-charcoal-800 bg-charcoal-950/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-steel-400 sm:flex-row lg:px-8">
          <p>{siteContent.footer.note}</p>
          <Link
            href={siteContent.footer.privacyHref}
            className="transition-colors hover:text-copper-accent-300"
          >
            {siteContent.footer.privacyLabel}
          </Link>
        </div>
      </footer>
    </div>
  );
}

type SectionProps = {
  id: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

function Section({ id, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="font-heading text-sm uppercase tracking-[0.25em] text-copper-accent-400">
          {id}
        </p>
        <h2 className="mt-3 font-heading text-3xl uppercase tracking-[0.06em] text-ivory-50 lg:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-steel-300">{intro}</p>
      </div>
      {children}
    </section>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-[-220px] z-0 h-[560px] bg-[radial-gradient(circle_at_top,_rgba(184,115,51,0.34),_rgba(13,17,23,0)_68%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-260px] top-[35%] z-0 h-[520px] w-[520px] rounded-full bg-copper-700/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-250px] top-[55%] z-0 h-[500px] w-[500px] rounded-full bg-slate-700/20 blur-3xl"
        aria-hidden
      />
    </>
  );
}
