"use client";

import {
  CircleCheck,
  Mail,
  Phone,
  Radio,
  Send,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { CyberButton, CyberInput, CyberTextarea } from "@/components/cyber";
import { sendContactMessage } from "@/lib/contacts";
import { type Locale } from "@/lib/i18n";

import { type ContactFormDictionary } from "./contact-content";

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
    const form = event.currentTarget;
    setIsSending(true);
    setStatus("idle");

    const formData = new FormData(form);

    try {
      await sendContactMessage({
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        locale,
      });

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      className="flex h-full flex-col"
      aria-busy={isSending || undefined}
      onChange={() => status !== "idle" && setStatus("idle")}
      onSubmit={handleSubmit}
    >
      <div className="contact-tone-divider border-b pb-5 sm:pb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="contact-label-red flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em]">
            <span className="h-px w-7 bg-[var(--contact-label-red)]" aria-hidden="true" />
            {dictionary.eyebrow}
          </p>
          <span
            className="contact-tone-muted hidden items-center gap-2 font-tech text-[9px] uppercase tracking-[0.18em] sm:inline-flex"
            aria-hidden="true"
          >
            <span className="size-1.5 bg-current" />
            TX / READY
          </span>
        </div>
        <h2 className="contact-tone-heading mt-3 font-display text-[1.7rem] uppercase leading-tight tracking-[0.025em] sm:text-3xl">
          {dictionary.title}
        </h2>
        <p className="contact-tone-muted mt-3 max-w-xl text-sm leading-6">
          {dictionary.description}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
        <CyberInput
          name="name"
          label={dictionary.nameLabel}
          labelClassName="contact-tone-heading"
          placeholder={dictionary.namePlaceholder}
          autoComplete="name"
          icon={<UserRound />}
          maxLength={120}
          tone="neutral"
          required
        />
        <CyberInput
          name="email"
          type="email"
          label={dictionary.emailLabel}
          labelClassName="contact-tone-heading"
          placeholder={dictionary.emailPlaceholder}
          autoComplete="email"
          icon={<Mail />}
          tone="neutral"
          required
        />
        <div className="sm:col-span-2">
          <CyberInput
            name="phone"
            type="tel"
            label={
              <span className="flex items-center justify-between gap-3">
                <span>{dictionary.phoneLabel}</span>
                <span className="contact-tone-muted text-[9px] font-normal tracking-[0.14em]">
                  {dictionary.optionalLabel}
                </span>
              </span>
            }
            labelClassName="contact-tone-heading"
            placeholder={dictionary.phonePlaceholder}
            autoComplete="tel"
            icon={<Phone />}
            maxLength={64}
            tone="neutral"
          />
        </div>
        <div className="sm:col-span-2">
          <CyberTextarea
            name="message"
            label={dictionary.messageLabel}
            labelClassName="contact-tone-heading"
            placeholder={dictionary.messagePlaceholder}
            minLength={10}
            maxLength={4000}
            tone="neutral"
            required
          />
        </div>
      </div>

      {status !== "idle" ? (
        <div
          role={status === "error" ? "alert" : "status"}
          className="contact-tone-surface mt-5 flex items-start gap-3 border p-3.5"
        >
          {status === "success" ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <p className="font-tech text-sm leading-5">
            {status === "success" ? dictionary.success : dictionary.error}
          </p>
        </div>
      ) : null}

      <div className="mt-auto pt-5 sm:pt-6">
        <CyberButton
          type="submit"
          variant="primary"
          loading={isSending}
          className="contact-action w-full"
        >
          <Send aria-hidden="true" />
          {dictionary.submit}
        </CyberButton>
        <p className="contact-tone-muted mt-3 flex items-start gap-2 font-tech text-[10px] leading-5 tracking-[0.04em]">
          <Radio className="mt-1 size-3 shrink-0" aria-hidden="true" />
          {dictionary.responseNote}
        </p>
      </div>
    </form>
  );
}
