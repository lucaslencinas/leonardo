import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ReactNode } from "react";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${nunito.variable}`}
    >
      <head>
        <title>Leonardo - Baby Leo Predictions</title>
        <meta
          name="description"
          content="Family prediction game for baby Leo's arrival"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-baby-blue/20 via-baby-cream/30 to-baby-mint/20 font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
