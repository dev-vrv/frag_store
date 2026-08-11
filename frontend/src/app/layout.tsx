import type { Metadata } from "next";
import Script from "next/script";

import AiAssistantLauncher from "@/components/Ai/AiAssistantLauncher";
import { GeometricBackdrop } from "@/components/Background/GeometricBackdrop";
import { CyberLoader } from "@/components/Loaders/CyberLoader";
import { CartProvider } from "@/components/Cart/CartProvider";
import { ContactProvider } from "@/components/Contacts/ContactProvider";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { getContactInfos } from "@/lib/contacts";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import "./globals.css";

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
    <html
      lang="ru"
      className="h-full"
      data-theme="dark"
      data-theme-preference="system"
      suppressHydrationWarning
    >
      <body className="relative min-h-full antialiased">
        <Script
          id="frag-store-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <div className="site-global-backdrop" aria-hidden="true">
          <div className="site-global-backdrop__base" />
          <div className="site-global-backdrop__grid cyber-grid" />
          <div className="site-global-backdrop__scanline cyber-scanline" />
          <GeometricBackdrop
            variant="home"
            gridOpacityClassName="opacity-0"
            scanlineOpacityClassName="opacity-0"
          />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">
          <CyberLoader />
          <CartProvider>
            <ContactProvider contacts={contacts}>
              {children}
              <AiAssistantLauncher />
              <BackToTopButton />
            </ContactProvider>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
