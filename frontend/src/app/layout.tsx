import type { Metadata } from "next";
import { Exo_2, JetBrains_Mono } from "next/font/google";

import { CyberLoader } from "@/components/Loaders/CyberLoader";
import { CartProvider } from "@/components/Cart/CartProvider";
import { ContactProvider } from "@/components/Contacts/ContactProvider";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { getContactInfos } from "@/lib/contacts";
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contacts = await getContactInfos();

  return (
    <html lang="ru" className="h-full">
      <body
        className={`${exo.variable} ${jetbrainsMono.variable} relative min-h-full antialiased`}
      >
        <div className="site-global-backdrop" aria-hidden="true">
          <div className="site-global-backdrop__base" />
          <div className="site-global-backdrop__grid cyber-grid" />
          <div className="site-global-backdrop__scanline cyber-scanline" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">
          <CyberLoader />
          <CartProvider>
            <ContactProvider contacts={contacts}>
              {children}
              <BackToTopButton />
            </ContactProvider>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
