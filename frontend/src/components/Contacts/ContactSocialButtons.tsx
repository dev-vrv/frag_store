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
}: {
  locale: Locale;
  channels?: SocialKey[];
  className?: string;
  linkClassName?: string;
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
          className={cn(
            "grid size-11 place-items-center border border-white/15 bg-white/5 text-zinc-100 transition hover:border-lime-300/60 hover:text-lime-200",
            linkClassName,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
