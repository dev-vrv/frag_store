import { ContactMessageForm } from "@/components/Contacts/ContactMessageForm";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { type Locale } from "@/lib/i18n";

import { type ContactFormDictionary } from "./contact-content";

export interface ContactFormCardProps {
  locale: Locale;
  dictionary: ContactFormDictionary;
  className?: string;
  contentClassName?: string;
}

export function ContactFormCard({
  locale,
  dictionary,
  className,
  contentClassName = "p-6 sm:p-8",
}: ContactFormCardProps) {
  return (
    <ContactPanel className={className} contentClassName={contentClassName}>
      <ContactMessageForm locale={locale} dictionary={dictionary} />
    </ContactPanel>
  );
}
