import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipLink } from "@/components/accessibility/skip-link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AIuditor — Stop Overpaying for AI Tools",
  description:
    "Analyze your AI stack and uncover hidden savings across ChatGPT, Claude, Cursor, Gemini, and more. Free audit in under 60 seconds.",
  keywords: [
    "AI tools",
    "AI spending",
    "cost optimization",
    "ChatGPT",
    "Claude",
    "Cursor",
    "GitHub Copilot",
    "AI audit",
    "SaaS optimization",
  ],
  authors: [{ name: "AIuditor" }],
  openGraph: {
    title: "AIuditor — Stop Overpaying for AI Tools",
    description:
      "Analyze your AI stack and uncover hidden savings in under 60 seconds. Free audit for startups and teams.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIuditor — Stop Overpaying for AI Tools",
    description:
      "Analyze your AI stack and uncover hidden savings in under 60 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <SkipLink />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
