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
      "Copper Forge helps founders and operators turn strong ideas into working systems. We bring experienced technical leadership, disciplined execution, and a delivery model built around outcomes.",
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
      title: "Consulting Like It Should Be",
      description:
        "If your project excites our team, we will work with you to find a practical path forward.",
    },
    {
      title: "Flexible Finances",
      description:
        "For select projects we believe in, we can structure deferred compensation or equity-based agreements.",
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
        name: "Technical Strategy",
        description:
          "Translate business goals into a clear technical direction, phased roadmap, and execution plan.",
      },
      {
        name: "Error Elimination",
        description:
          "Identify root causes, remove recurring failure points, and ship with stronger production confidence.",
      },
    ],
  },
  process: {
    title: "How We Work",
    intro:
      "A disciplined, collaborative process that keeps scope, delivery, and expectations aligned from day one.",
    steps: [
      "Collaborative requirements investigation",
      "Technical plan creation",
      "Pricing and milestone agreement",
      "Build and implementation",
      "Customer acceptance",
      "Payout by agreed milestones",
    ],
  },
  engagement: {
    title: "Engagement Snapshot",
    items: [
      { label: "Typical engagement", value: "3 months" },
      { label: "Typical team", value: "3 senior specialists" },
      {
        label: "Best fit",
        value: "Projects aimed at delivering solutions that make the world a better place.",
      },
    ],
  },
  about: {
    title: "Experienced. Creative. Disciplined.",
    paragraphs: [
      "Copper Forge is a technical consulting firm for teams with strong ideas and meaningful goals.",
      "We focus on practical strategy, high-quality implementation, and accountable delivery.",
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
