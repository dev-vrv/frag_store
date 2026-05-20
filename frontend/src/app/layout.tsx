import type { Metadata } from "next";
import { Exo_2, JetBrains_Mono } from "next/font/google";

import { CyberLoader } from "@/components/Loaders/CyberLoader";
import { ContactProvider } from "@/components/Contacts/ContactProvider";
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
        className={`${exo.variable} ${jetbrainsMono.variable} flex min-h-full flex-col antialiased`}
      >
        <CyberLoader />
        <ContactProvider contacts={contacts}>{children}</ContactProvider>
      </body>
    </html>
  );
}
