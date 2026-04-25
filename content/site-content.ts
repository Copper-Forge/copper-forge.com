export const siteContent = {
  brand: {
    name: "Copper Forge",
    tagline: "Technical Consulting",
  },
  navigation: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Precision Delivery for Complex Software Systems",
    title: "Engineering strategy and execution that move your roadmap forward.",
    description:
      "Copper Forge partners with product and platform teams to turn high-risk initiatives into dependable outcomes. We design practical architecture, remove delivery bottlenecks, and ship resilient software with your team.",
    primaryCta: { label: "Start a Conversation", href: "#contact" },
    secondaryCta: { label: "View Engagement Model", href: "#services" },
    highlights: [
      "Principal-level technical leadership",
      "Hands-on implementation with your team",
      "Reliable delivery under real constraints",
    ],
  },
  services: {
    title: "Core Services",
    intro:
      "Focused consulting engagements built to solve immediate engineering problems while strengthening long-term capability.",
    items: [
      {
        name: "Architecture and Technical Direction",
        description:
          "Define system boundaries, integration strategies, and delivery roadmaps for high-impact platform and product work.",
      },
      {
        name: "Delivery Acceleration",
        description:
          "Stabilize execution by improving planning, reducing technical drag, and unblocking teams across product and infrastructure.",
      },
      {
        name: "Modernization and Reliability",
        description:
          "Upgrade legacy systems, improve operational confidence, and establish sustainable engineering patterns.",
      },
    ],
  },
  proof: {
    title: "Selected Impact",
    intro:
      "Representative outcomes from consulting partnerships across product, platform, and operations.",
    metrics: [
      { value: "35%", label: "Cycle-time reduction on core delivery stream" },
      { value: "99.95%", label: "Service availability after reliability overhaul" },
      { value: "4x", label: "Increase in release cadence for critical workflows" },
    ],
    cases: [
      {
        name: "Platform Migration",
        description:
          "Led a phased migration strategy that reduced release risk while preserving delivery velocity for customer-facing teams.",
      },
      {
        name: "Incident Recovery Program",
        description:
          "Implemented reliability guardrails, observability standards, and runbook discipline to restore operational confidence.",
      },
      {
        name: "Product Launch Enablement",
        description:
          "Embedded with engineering leadership to shape architecture and execution for an on-time multi-team product launch.",
      },
    ],
  },
  about: {
    title: "Built for Critical Initiatives",
    paragraphs: [
      "Copper Forge is designed for teams tackling technically difficult programs with real business pressure. Engagements are pragmatic, direct, and outcome-driven.",
      "We work as a force multiplier for your existing engineering organization: aligning technical decisions to business priorities and delivering implementation that holds up in production.",
    ],
  },
  contact: {
    title: "Start the Conversation",
    intro:
      "Tell us what you are building, where the current friction is, and how you prefer to connect. We will follow up promptly.",
    submitLabel: "Send Inquiry",
    successMessage:
      "Thanks, your message has been received. We will reach out shortly.",
  },
  footer: {
    note: "Copper Forge Technical Consulting",
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
