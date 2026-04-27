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
  metadataBase: new URL("https://austintherapistexchange.com"),
  title: "Austin Therapist Exchange",
  description: "A private therapist referral network for Austin clinicians.",
  applicationName: "Austin Therapist Exchange"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${sans.variable} ${serif.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
