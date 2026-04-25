import type { Metadata } from "next";
import { Rajdhani, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const headingFont = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://copper-forge.com"),
  title: {
    default: "Copper Forge | Technical Consulting",
    template: "%s | Copper Forge",
  },
  description:
    "Copper Forge provides technical consulting for architecture, delivery acceleration, and reliability modernization.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Copper Forge | Technical Consulting",
    description:
      "Architecture strategy and hands-on execution for complex engineering initiatives.",
    url: "https://copper-forge.com",
    siteName: "Copper Forge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 981,
        height: 310,
        alt: "Copper Forge Technical Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Copper Forge | Technical Consulting",
    description:
      "Architecture strategy and hands-on execution for complex engineering initiatives.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
