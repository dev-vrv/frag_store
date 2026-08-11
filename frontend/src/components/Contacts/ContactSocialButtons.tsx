"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { useContactInfo } from "@/components/Contacts/ContactProvider";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SocialKey =
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x";

const socialLinks = [
  ["whatsapp", "WhatsApp", FaWhatsapp],
  ["telegram", "Telegram", FaTelegram],
  ["instagram", "Instagram", FaInstagram],
  ["facebook", "Facebook", FaFacebookF],
  ["youtube", "YouTube", FaYoutube],
  ["tiktok", "TikTok", FaTiktok],
  ["x", "X", FaXTwitter],
] as const;

export function ContactSocialButtons({
  locale,
  channels,
  className,
  linkClassName,
  tone = "cyber",
}: {
  locale: Locale;
  channels?: SocialKey[];
  className?: string;
  linkClassName?: string;
  tone?: "cyber" | "contact";
}) {
  const contactInfo = useContactInfo(locale);
  const allowedChannels = channels ? new Set(channels) : null;
  const socials = socialLinks
    .filter(([key]) => !allowedChannels || allowedChannels.has(key))
    .map(([key, label, Icon]) => ({
      href: contactInfo?.[key] || "",
      label,
      Icon,
    }))
    .filter((item) => item.href);

  if (!socials.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {socials.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className={cn(
            "group relative grid size-10 place-items-center overflow-hidden border transition-[border-color,background-color,color,transform,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-x-2 before:bottom-0 before:h-px before:origin-left before:scale-x-0 before:transition-transform before:duration-300 hover:-translate-y-0.5 hover:before:scale-x-100 focus-visible:outline-none focus-visible:ring-2 motion-reduce:hover:transform-none sm:size-11",
            tone === "contact"
              ? "contact-tone-surface contact-interactive-surface before:bg-current focus-visible:ring-current/20"
              : "border-cyan-300/16 bg-cyan-300/[0.035] text-zinc-300 before:bg-cyan-200 hover:border-cyan-300/45 hover:bg-cyan-300/[0.08] hover:text-cyan-100 hover:shadow-[0_0_22px_rgba(34,211,238,0.1)] focus-visible:ring-cyan-300/35",
            linkClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
