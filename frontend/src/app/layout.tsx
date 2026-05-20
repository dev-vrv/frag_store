import type { Metadata } from "next";
import { Exo_2, JetBrains_Mono } from "next/font/google";

import { CyberLoader } from "@/components/Loaders/CyberLoader";
import "./globals.css";

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frag Store",
  description: "Frag Store interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body
        className={`${exo.variable} ${jetbrainsMono.variable} flex min-h-full flex-col antialiased`}
      >
        <CyberLoader />
        {children}
      </body>
    </html>
  );
}
