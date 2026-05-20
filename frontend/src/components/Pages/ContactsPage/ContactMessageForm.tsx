"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { CyberButton, CyberInput, CyberTextarea } from "@/components/cyber";
import { sendContactMessage } from "@/lib/contacts";
import { type Locale } from "@/lib/i18n";

export interface ContactFormDictionary {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  success: string;
  error: string;
}

export interface ContactMessageFormProps {
  locale: Locale;
  dictionary: ContactFormDictionary;
}

export function ContactMessageForm({
  locale,
  dictionary,
}: ContactMessageFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus("idle");

    const formData = new FormData(event.currentTarget);

    try {
      await sendContactMessage({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        message: String(formData.get("message") || ""),
        locale,
      });

      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <h2 className="font-display text-3xl uppercase text-red-100">
        {dictionary.title}
      </h2>

      <CyberInput
        name="name"
        label={dictionary.nameLabel}
        placeholder={dictionary.namePlaceholder}
        autoComplete="name"
        required
      />
      <CyberInput
        name="email"
        type="email"
        label={dictionary.emailLabel}
        placeholder={dictionary.emailPlaceholder}
        autoComplete="email"
        required
      />
      <CyberInput
        name="phone"
        type="tel"
        label={dictionary.phoneLabel}
        placeholder={dictionary.phonePlaceholder}
        autoComplete="tel"
      />
      <CyberTextarea
        name="message"
        label={dictionary.messageLabel}
        placeholder={dictionary.messagePlaceholder}
        minLength={10}
        required
      />

      {status !== "idle" ? (
        <p
          className={
            status === "success"
              ? "font-tech text-sm text-lime-200"
              : "font-tech text-sm text-red-300"
          }
        >
          {status === "success" ? dictionary.success : dictionary.error}
        </p>
      ) : null}

      <CyberButton type="submit" variant="primary" loading={isSending}>
        <Send aria-hidden="true" />
        {dictionary.submit}
      </CyberButton>
    </form>
  );
}
