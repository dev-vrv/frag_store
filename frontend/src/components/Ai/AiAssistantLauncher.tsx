"use client";

import { Bot, MessageSquareText, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CyberButton,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberTextarea,
} from "@/components/cyber";
import { getLocaleFromPathname } from "@/lib/i18n";

type AssistanceType = "general" | "order" | "technical" | "warranty" | "partnership";
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  requestType: AssistanceType;
};

const assistantText = {
  ru: {
    trigger: "Открыть AI-ассистента",
    title: "AI-АССИСТЕНТ",
    description: "Выберите тип обращения и напишите сообщение.",
    typeLabel: "Тип обращения",
    inputLabel: "Сообщение",
    inputPlaceholder: "Опишите вопрос, проблему или задачу...",
    send: "Отправить",
    sending: "Отправляем...",
    emptyTitle: "Начните диалог",
    emptyText: "Задайте вопрос, и ассистент ответит в этом окне.",
    replyUnavailable: "В данный момент ассистент не доступен, пожалуйста попробуйте позже.",
    types: {
      general: "Общий вопрос",
      order: "Заказ и доставка",
      technical: "Техническая помощь",
      warranty: "Гарантия и возврат",
      partnership: "Сотрудничество",
    },
  },
  en: {
    trigger: "Open AI assistant",
    title: "AI ASSISTANT",
    description: "Choose the request type and send a message.",
    typeLabel: "Request type",
    inputLabel: "Message",
    inputPlaceholder: "Describe the question, issue, or task...",
    send: "Send",
    sending: "Sending...",
    emptyTitle: "Start the conversation",
    emptyText: "Ask a question and the assistant will reply in this chat.",
    replyUnavailable: "The assistant is currently unavailable, please try again later.",
    types: {
      general: "General question",
      order: "Order and delivery",
      technical: "Technical support",
      warranty: "Warranty and returns",
      partnership: "Partnership",
    },
  },
  kg: {
    trigger: "AI-ассистентти ачуу",
    title: "AI-АССИСТЕНТ",
    description: "Кайрылуу түрүн тандап, билдирүү жазыңыз.",
    typeLabel: "Кайрылуу түрү",
    inputLabel: "Билдирүү",
    inputPlaceholder: "Суроону, көйгөйдү же тапшырманы жазыңыз...",
    send: "Жөнөтүү",
    sending: "Жөнөтүлүүдө...",
    emptyTitle: "Сүйлөшүүнү баштаңыз",
    emptyText: "Суроо жазыңыз, ассистент ушул чатта жооп берет.",
    replyUnavailable: "Учурда ассистент жеткиликсиз, сураныч кийинчерээк кайра аракет кылыңыз.",
    types: {
      general: "Жалпы суроо",
      order: "Заказ жана жеткирүү",
      technical: "Техникалык жардам",
      warranty: "Кепилдик жана кайтаруу",
      partnership: "Өнөктөштүк",
    },
  },
} as const;

export default function AiAssistantLauncher() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const text = assistantText[locale];
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState<AssistanceType>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  const typeOptions = useMemo(
    () => [
      { value: "general", label: text.types.general },
      { value: "order", label: text.types.order },
      { value: "technical", label: text.types.technical },
      { value: "warranty", label: text.types.warranty },
      { value: "partnership", label: text.types.partnership },
    ],
    [text],
  );

  async function handleSend() {
    const normalized = message.trim();
    if (!normalized || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: normalized,
      requestType,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setIsSending(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: text.replyUnavailable,
          requestType,
        },
      ]);
      setIsSending(false);
    }, 650);
  }

  return (
    <>
      <button
        type="button"
        aria-label={text.trigger}
        onClick={() => setOpen(true)}
        className="floating-control ai-assistant-entry cyber-cut-small"
      >
        <span className="floating-control__icon ai-assistant-entry__icon" aria-hidden="true">
          <Bot className="size-4" strokeWidth={2.2} />
        </span>
        <span className="floating-control__copy">
          <span className="floating-control__eyebrow">02 // ONLINE</span>
          <span className="floating-control__label">{text.title}</span>
        </span>
        <span className="floating-control__status ai-assistant-entry__status" aria-hidden="true" />
      </button>

      <CyberDialog open={open} onOpenChange={setOpen}>
        <CyberDialogContent className="assistant-ui assistant-panel flex h-[min(88vh,860px)] max-h-[88vh] w-[calc(100%-1rem)] max-w-6xl flex-col gap-0 overflow-hidden p-0 before:hidden">
          <CyberDialogHeader className="assistant-divider shrink-0 border-b px-5 py-4 text-left sm:px-6">
            <div className="flex flex-col gap-4">
              <div>
                <CyberDialogTitle className="assistant-heading font-display text-2xl uppercase tracking-[0.08em] sm:text-3xl">
                  {text.title}
                </CyberDialogTitle>
                <CyberDialogDescription className="assistant-muted mt-2 max-w-3xl text-sm leading-6">
                  {text.description}
                </CyberDialogDescription>
              </div>
              <div className="assistant-surface rounded-sm border p-3">
                <p className="assistant-heading font-tech block text-sm font-semibold uppercase tracking-[0.1em]">
                  {text.typeLabel}
                </p>
                <div role="radiogroup" aria-label={text.typeLabel} className="mt-3 flex flex-wrap gap-2">
                  {typeOptions.map((option) => {
                    const isActive = option.value === requestType;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        data-active={isActive}
                        onClick={() => setRequestType(option.value as AssistanceType)}
                        className="assistant-type-option inline-flex min-h-10 items-center rounded-sm border px-3 py-2 text-left font-tech text-[11px] uppercase tracking-[0.1em] transition"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CyberDialogHeader>

          <div className="min-h-0 flex flex-1">
            <section className="flex min-h-0 flex-1 flex-col bg-[var(--assistant-bg)]">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {messages.length ? (
                  <div className="space-y-4">
                    {messages.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          data-role={entry.role}
                          className="assistant-message max-w-[min(100%,42rem)] rounded-md border px-4 py-3 text-sm leading-6"
                        >
                          <div className="assistant-message-meta assistant-muted mb-2 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.16em]">
                            {entry.role === "user" ? (
                              <>
                                <MessageSquareText className="size-3.5" />
                                {text.types[entry.requestType]}
                              </>
                            ) : (
                              <>
                                <Bot className="size-3.5" />
                                {text.title}
                              </>
                            )}
                          </div>
                          <p>{entry.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="grid h-full place-items-center">
                    <div className="max-w-lg text-center">
                      <div className="assistant-surface mx-auto grid size-16 place-items-center rounded-full border shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                        <Bot className="size-7" />
                      </div>
                      <p className="assistant-heading mt-5 font-display text-2xl uppercase tracking-[0.08em]">
                        {text.emptyTitle}
                      </p>
                      <p className="assistant-muted mt-3 text-sm leading-7">{text.emptyText}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="assistant-divider shrink-0 border-t bg-[var(--assistant-bg)] px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  <CyberTextarea
                    label={text.inputLabel}
                    labelClassName="assistant-heading"
                    value={message}
                    placeholder={text.inputPlaceholder}
                    className="assistant-field min-h-28"
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <CyberButton
                      type="button"
                      variant="secondary"
                      className="assistant-action"
                      onClick={() => void handleSend()}
                      disabled={!message.trim() || isSending}
                    >
                      {isSending ? text.sending : text.send}
                      <Send className="size-4" />
                    </CyberButton>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </CyberDialogContent>
      </CyberDialog>
    </>
  );
}
