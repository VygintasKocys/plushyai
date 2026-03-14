import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Plushify - Transform Photos into Adorable Plushies",
    template: "%s | Plushify",
  },
  description:
    "Transform your photos into adorable plushie versions with AI. Upload any image and get a cute, cuddly plushie rendition in seconds.",
  keywords: [
    "Plushify",
    "AI plushie generator",
    "photo to plushie",
    "AI image transformation",
    "cute plushie art",
    "stuffed animal generator",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Plushify" }],
  creator: "Plushify",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Plushify",
    title: "Plushify - Transform Photos into Adorable Plushies",
    description:
      "Transform your photos into adorable plushie versions with AI. Upload any image and get a cute, cuddly plushie rendition in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plushify - Transform Photos into Adorable Plushies",
    description:
      "Transform your photos into adorable plushie versions with AI. Upload any image and get a cute, cuddly plushie rendition in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Plushify",
  description:
    "Transform your photos into adorable plushie versions with AI. Upload any image and get a cute, cuddly plushie rendition in seconds.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "9",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Plushify",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
