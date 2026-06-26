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
        className="ai-assistant-entry"
      >
        <span className="ai-assistant-entry__pulse ai-assistant-entry__pulse--outer" />
        <span className="ai-assistant-entry__pulse ai-assistant-entry__pulse--inner" />
        <span className="ai-assistant-entry__icon" aria-hidden="true">
          <Bot className="size-4" strokeWidth={2.2} />
        </span>
      </button>

      <CyberDialog open={open} onOpenChange={setOpen}>
        <CyberDialogContent className="flex h-[min(88vh,860px)] max-h-[88vh] w-[calc(100%-1rem)] max-w-6xl flex-col gap-0 overflow-hidden border-cyan-300/18 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.07),transparent_22%),radial-gradient(circle_at_top_right,rgba(163,230,53,0.03),transparent_16%),linear-gradient(180deg,rgba(5,7,9,0.99),rgba(3,4,6,1))] p-0 shadow-[0_0_54px_rgba(34,211,238,0.10)] before:bg-[linear-gradient(135deg,rgba(34,211,238,0.04),transparent_45%,rgba(163,230,53,0.03))]">
          <CyberDialogHeader className="shrink-0 border-b border-cyan-300/10 px-5 py-4 text-left sm:px-6">
            <div className="flex flex-col gap-4">
              <div>
                <CyberDialogTitle className="font-display text-2xl uppercase tracking-[0.08em] text-cyan-50 sm:text-3xl">
                  {text.title}
                </CyberDialogTitle>
                <CyberDialogDescription className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
                  {text.description}
                </CyberDialogDescription>
              </div>
              <div className="rounded-sm border border-cyan-300/10 bg-white/[0.02] p-3">
                <p className="font-tech block text-sm font-semibold uppercase tracking-[0.1em] text-zinc-300">
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
                        onClick={() => setRequestType(option.value as AssistanceType)}
                        className={`inline-flex min-h-10 items-center rounded-sm border px-3 py-2 text-left font-tech text-[11px] uppercase tracking-[0.1em] transition ${
                          isActive
                            ? "border-cyan-300/24 bg-cyan-300/[0.05] text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,0.04)]"
                            : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-cyan-300/16 hover:bg-white/[0.04] hover:text-white"
                        }`}
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
            <section className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,rgba(8,10,12,0.98),rgba(4,5,7,1))]">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {messages.length ? (
                  <div className="space-y-4">
                    {messages.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[min(100%,42rem)] rounded-md border px-4 py-3 text-sm leading-6 shadow-[0_12px_32px_rgba(0,0,0,0.16)] ${
                            entry.role === "user"
                              ? "border-cyan-300/24 bg-cyan-300/[0.05] text-cyan-50 shadow-[0_14px_36px_rgba(34,211,238,0.06)]"
                              : "border-emerald-300/12 bg-white/[0.03] text-zinc-100 shadow-[0_14px_36px_rgba(16,185,129,0.04)]"
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                            {entry.role === "user" ? (
                              <>
                                <MessageSquareText className="size-3.5 text-cyan-200" />
                                {text.types[entry.requestType]}
                              </>
                            ) : (
                              <>
                                <Bot className="size-3.5 text-emerald-200" />
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
                      <div className="mx-auto grid size-16 place-items-center rounded-full border border-cyan-300/14 bg-white/[0.03] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.06)]">
                        <Bot className="size-7" />
                      </div>
                      <p className="mt-5 font-display text-2xl uppercase tracking-[0.08em] text-cyan-50">
                        {text.emptyTitle}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-400">{text.emptyText}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-cyan-300/8 bg-black/28 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  <CyberTextarea
                    label={text.inputLabel}
                    value={message}
                    placeholder={text.inputPlaceholder}
                    className="min-h-28 border-cyan-300/18 bg-white/[0.02] focus-visible:border-cyan-300/55 focus-visible:ring-cyan-300/14"
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
                      className="border-cyan-300/42 bg-cyan-400/[0.08] text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.10)] hover:bg-cyan-300/[0.14]"
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
