export const siteContent = {
  brand: {
    name: "Copper Forge",
    tagline: "Technical Consulting",
  },
  navigation: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Technical Consulting for Ambitious Ideas",
    title: "Bring the idea. We deliver the technical reality.",
    description:
      "Copper Forge helps turn ideas into working systems. We bring experienced technical leadership, accountable execution, and a delivery model built around outcomes.",
    primaryCta: { label: "Send Your Brief", href: "#contact" },
    secondaryCta: { label: "How We Work", href: "#process" },
    highlights: [
      "Senior experts from discovery through delivery",
      "No hourly billing and no hidden overrun risk",
      "Flexible deal structures for select projects",
    ],
  },
  valueProps: [
    {
      title: "Top Tier Talent",
      description:
        "From discovery to delivery, you work with senior experts only. Every team member brings years of experience in their field.",
    },
    {
      title: "Always On Budget",
      description:
        "We do not bill hourly. Pricing is fixed to milestones and only changes when scope changes.",
    },
    {
      title: "Flexible Finances",
      description:
        "For select projects, we can structure deferred compensation and equity-based agreements.",
    },
  ],
  services: {
    title: "Core Services",
    intro:
      "Focused consulting engagements designed to turn ideas into reliable, production-ready outcomes.",
    items: [
      {
        name: "Modernization",
        description:
          "Upgrade aging systems, reduce technical friction, and improve reliability without stalling delivery.",
      },
      {
        name: "Escape from SaaS",
        description:
          "Stop renting software that doesn't quite fit. We build custom tools that replace recurring SaaS with a one-time build and optional support.",
      },
      {
        name: "Technical Strategy",
        description:
          "Translate business goals into a clear technical direction, phased roadmap, and execution plan.",
      },
    ],
  },
  process: {
    title: "How We Work",
    intro:
      "A collaborative engagement flow that keeps scope, timelines, and expectations aligned from day one.",
    steps: [
      "Discovery: define goals, constraints, and success criteria together",
      "Plan: map the technical approach, milestones, and delivery risks",
      "Agreement: confirm scope, timelines, and payment terms",
      "Delivery: implement in phases with regular check-ins",
      "Acceptance: complete final validation and handoff",
    ],
  },
  engagement: {
    title: "Engagement Snapshot",
    items: [
      { label: "Typical engagement", value: "3 months" },
      { label: "Typical team", value: "3 senior specialists" },
      {
        label: "Best fit",
        value: "Projects with clear objectives, giving additional weight to work that creates meaningful public or social impact.",
      },
    ],
  },
  about: {
    title: "Experienced. Creative. Impactful.",
    paragraphs: [
      "Copper Forge helps teams turn important business problems into reliable software systems.",
      "We focus on practical strategy, high-quality implementation, and outcomes that improve how people and organizations operate in the real world.",
    ],
  },
  contact: {
    title: "Start with a Brief",
    intro:
      "Send your brief and tell us whether you prefer email or a callback. We respond within one business day.",
    submitLabel: "Send Brief",
    successMessage:
      "Thanks, your brief has been received. We will follow up within one business day.",
  },
  footer: {
    note: "Copyright © 2026 Copper Forge, LLC.",
    privacyHref: "/privacy",
    privacyLabel: "Privacy",
  },
  privacy: {
    title: "Privacy Notice",
    effectiveDate: "April 25, 2026",
    sections: [
      {
        heading: "Information We Collect",
        body: "When you submit the contact form, we collect your name, company name, email address, phone number (if provided), preferred contact method, and message content.",
      },
      {
        heading: "How We Use Information",
        body: "We use submitted information solely to respond to your inquiry, evaluate consulting fit, and continue business communication you request.",
      },
      {
        heading: "Data Sharing",
        body: "We do not sell personal information. We use service providers to operate this site and deliver email communications required to respond to inquiries.",
      },
      {
        heading: "Retention",
        body: "Inquiry data is retained only as long as needed to manage active discussions, legal obligations, or legitimate business records.",
      },
      {
        heading: "Contact",
        body: "For privacy requests related to inquiry data, contact us through the website form and include the phrase 'Privacy Request' in your message.",
      },
    ],
  },
} as const;
