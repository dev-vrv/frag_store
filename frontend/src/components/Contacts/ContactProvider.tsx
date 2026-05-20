"use client";

import { createContext, useContext, type ReactNode } from "react";

import { type ContactInfo } from "@/lib/contacts";
import { defaultLocale, type Locale } from "@/lib/i18n";

const ContactContext = createContext<ContactInfo[]>([]);

export function ContactProvider({
  contacts,
  children,
}: {
  contacts: ContactInfo[];
  children: ReactNode;
}) {
  return (
    <ContactContext.Provider value={contacts}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactInfo(locale: Locale) {
  const contacts = useContext(ContactContext);

  return (
    contacts.find((contact) => contact.locale === locale) ??
    contacts.find((contact) => contact.locale === defaultLocale) ??
    null
  );
}
