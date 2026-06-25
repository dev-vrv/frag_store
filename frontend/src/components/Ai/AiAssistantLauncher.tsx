"use client";

import { Bot, Headset, MessageSquareText, Send, ShieldCheck, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CyberButton,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberInput,
  CyberNativeSelect,
} from "@/components/cyber";
import { getLocaleFromPathname } from "@/lib/i18n";

type AssistanceType = "general" | "order" | "technical" | "warranty" | "partnership";
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const assistantText = {
  ru: {
    trigger: "Открыть AI-ассистента",
    title: "AI-АССИСТЕНТ",
    description: "Выберите тип обращения и напишите сообщение. Пока интерфейс работает в режиме заглушки.",
    typeLabel: "Тип обращения",
    typeHint: "Контекст обращения будет передан ассистенту, когда backend будет подключен.",
    inputLabel: "Сообщение",
    inputPlaceholder: "Опишите вопрос, проблему или задачу...",
    send: "Отправить",
    sending: "Отправляем...",
    emptyTitle: "Чат готов к диалогу",
    emptyText: "Напишите сообщение, и система вернет временный ответ о недоступности ассистента.",
    statusTitle: "Статус канала",
    statusText: "Frontend-заглушка активна. Ответы backend-ассистента пока не подключены.",
    availability: "Ассистент офлайн",
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
    description: "Choose the request type and send a message. The interface currently runs in placeholder mode.",
    typeLabel: "Request type",
    typeHint: "This context will be passed to the assistant once the backend is connected.",
    inputLabel: "Message",
    inputPlaceholder: "Describe the question, issue, or task...",
    send: "Send",
    sending: "Sending...",
    emptyTitle: "Chat is ready",
    emptyText: "Send a message and the system will return the temporary assistant-unavailable response.",
    statusTitle: "Channel status",
    statusText: "Frontend placeholder is active. Backend assistant responses are not connected yet.",
    availability: "Assistant offline",
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
    description: "Кайрылуу түрүн тандап, билдирүү жазыңыз. Азыр интерфейс убактылуу заглушка режиминде.",
    typeLabel: "Кайрылуу түрү",
    typeHint: "Backend кошулганда бул контекст ассистентке өткөрүлөт.",
    inputLabel: "Билдирүү",
    inputPlaceholder: "Суроону, көйгөйдү же тапшырманы жазыңыз...",
    send: "Жөнөтүү",
    sending: "Жөнөтүлүүдө...",
    emptyTitle: "Чат даяр",
    emptyText: "Билдирүү жөнөтүңүз, система ассистент жеткиликсиз деген убактылуу жооп берет.",
    statusTitle: "Канал абалы",
    statusText: "Frontend-заглушка активдүү. Backend-ассистенттин жооптору азырынча кошула элек.",
    availability: "Ассистент офлайн",
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

function createInitialMessage(text: (typeof assistantText)["ru"]) {
  return [
    {
      id: "assistant-intro",
      role: "assistant" as const,
      text: text.replyUnavailable,
    },
  ];
}

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
  const displayedMessages = useMemo(
    () => [...createInitialMessage(text), ...messages],
    [messages, text],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [displayedMessages, open]);

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
        <CyberDialogContent className="flex h-[min(88vh,860px)] max-h-[88vh] w-[calc(100%-1rem)] max-w-6xl flex-col gap-0 overflow-hidden p-0">
          <CyberDialogHeader className="shrink-0 border-b border-white/10 px-5 py-4 text-left sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CyberDialogTitle className="font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
                  {text.title}
                </CyberDialogTitle>
                <CyberDialogDescription className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
                  {text.description}
                </CyberDialogDescription>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-red-300/18 bg-red-500/[0.08] px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em] text-red-100 sm:inline-flex">
                <ShieldCheck className="size-3.5" />
                {text.availability}
              </div>
            </div>
          </CyberDialogHeader>

          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-white/10 bg-black/25 p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="space-y-5">
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] text-cyan-100">
                      <Headset className="size-5" />
                    </div>
                    <div>
                      <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        {text.statusTitle}
                      </p>
                      <p className="mt-1 text-sm text-zinc-200">{text.availability}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{text.statusText}</p>
                </div>

                <CyberNativeSelect
                  label={text.typeLabel}
                  helperText={text.typeHint}
                  value={requestType}
                  onValueChange={(value) => setRequestType(value as AssistanceType)}
                  options={typeOptions}
                />

                <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-200" />
                    <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {text.types[requestType]}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {text.replyUnavailable}
                  </p>
                </div>
              </div>
            </aside>

            <section className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,rgba(10,10,12,0.95),rgba(6,6,8,0.98))]">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {displayedMessages.length ? (
                  <div className="space-y-4">
                    {displayedMessages.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[min(100%,42rem)] rounded-md border px-4 py-3 text-sm leading-6 shadow-[0_12px_32px_rgba(0,0,0,0.16)] ${
                            entry.role === "user"
                              ? "border-cyan-300/22 bg-cyan-300/[0.08] text-cyan-50"
                              : "border-white/10 bg-white/[0.03] text-zinc-200"
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                            {entry.role === "user" ? (
                              <>
                                <MessageSquareText className="size-3.5 text-cyan-200" />
                                {text.types[requestType]}
                              </>
                            ) : (
                              <>
                                <Bot className="size-3.5 text-red-200" />
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
                      <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-200">
                        <Bot className="size-7" />
                      </div>
                      <p className="mt-5 font-display text-2xl uppercase tracking-[0.08em] text-white">
                        {text.emptyTitle}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-400">{text.emptyText}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-white/10 bg-black/20 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  <CyberInput
                    label={text.inputLabel}
                    value={message}
                    placeholder={text.inputPlaceholder}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <CyberButton type="button" variant="primary" onClick={() => void handleSend()} disabled={!message.trim() || isSending}>
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
