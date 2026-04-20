import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";

import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Trusted Therapist Collective",
  description: "A trust-based referral and visibility network for Austin clinicians."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${sans.variable} ${serif.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
