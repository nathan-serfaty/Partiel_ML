import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Partiels ML · Pertinence des langages à l'ère de l'IA générative",
  description:
    "Étude empirique sur 21 165 observations, 60 langages, 2004-2024 : l'IA générative tue-t-elle vraiment certains langages de programmation ?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrument.variable}`}>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
