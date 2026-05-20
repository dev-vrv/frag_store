"use client";

import Link from "next/link";
import { useState } from "react";
import { FaLock, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
  CyberLaserText,
  CyberTabs,
  CyberTabsContent,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface AuthPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

type AuthMode = "login" | "register";

export function AuthPage({ locale, dictionary }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const auth = dictionary.auth;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-zinc-50">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_24%,rgba(255,23,68,0.3),transparent_31%),radial-gradient(circle_at_78%_18%,rgba(127,29,29,0.42),transparent_30%),radial-gradient(circle_at_58%_78%,rgba(217,70,239,0.08),transparent_24%),linear-gradient(180deg,#050507_0%,#120507_48%,#000_100%)]" />
      <div className="cyber-grid absolute inset-0 -z-20 opacity-70" />
      <div className="cyber-scanline absolute inset-0 -z-10 opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

      <section className="grid min-h-screen w-full items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(520px,44vw)] lg:px-0 lg:py-0">
        <div className="relative min-h-[26rem] overflow-hidden lg:ml-8 lg:min-h-[34rem] lg:max-w-3xl xl:ml-16">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500",
              mode === "login"
                ? "translate-y-0 opacity-100"
                : "-translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="red" glow>
              {auth.loginTab}
            </CyberBadge>
            <CyberLaserText
              as="h1"
              text={auth.brand}
              className="mt-7 block text-5xl text-red-100 sm:text-7xl"
              speedMs={42}
            />
            <h2 className="font-display mt-8 text-2xl font-normal uppercase tracking-[0.08em] text-lime-100">
              {auth.loginWelcomeTitle}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              {auth.loginWelcomeText}
            </p>
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-all duration-500",
              mode === "register"
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="violet" glow>
              {auth.registerTab}
            </CyberBadge>
            <CyberLaserText
              as="h1"
              text={auth.brand}
              className="mt-7 block text-5xl text-red-100 sm:text-7xl"
              speedMs={42}
            />
            <h2 className="font-display mt-8 text-2xl font-normal uppercase tracking-[0.08em] text-cyan-100">
              {auth.registerWelcomeTitle}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              {auth.registerWelcomeText}
            </p>
          </div>
        </div>

        <CyberCard
          variant="glass"
          className="rounded-none p-2 lg:flex lg:min-h-screen lg:items-center"
        >
          <CyberCardContent className="w-full p-5 sm:p-7 lg:px-10">
            <Link
              href={localizePath("/", locale)}
              className="font-display mb-8 inline-flex flex-col items-start leading-none tracking-[0.08em] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/35"
              aria-label="Frag Store"
            >
              <span className="text-3xl font-normal text-red-500 sm:text-4xl">FRAG</span>
              <span className="mt-1 text-2xl font-normal text-white sm:text-3xl">STORE</span>
            </Link>
            <CyberTabs
              value={mode}
              onValueChange={(value) => setMode(value as AuthMode)}
              className="w-full"
            >
              <CyberTabsList className="grid w-full grid-cols-2 rounded-none">
                <CyberTabsTrigger value="login">{auth.loginTab}</CyberTabsTrigger>
                <CyberTabsTrigger value="register">{auth.registerTab}</CyberTabsTrigger>
              </CyberTabsList>

              <CyberTabsContent
                value="login"
                className="mt-5 animate-in rounded-none fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <form className="space-y-5">
                  <CyberInput
                    label={auth.emailLabel}
                    type="email"
                    placeholder={auth.emailPlaceholder}
                    icon={<FaRegEnvelope aria-hidden="true" />}
                    autoComplete="email"
                  />
                  <CyberInput
                    label={auth.passwordLabel}
                    type="password"
                    placeholder={auth.passwordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="current-password"
                  />
                  <p className="font-tech text-sm text-zinc-500">{auth.loginHint}</p>
                  <CyberButton type="submit" variant="primary" className="w-full">
                    {auth.loginSubmit}
                  </CyberButton>
                </form>
              </CyberTabsContent>

              <CyberTabsContent
                value="register"
                className="mt-5 animate-in rounded-none fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <form className="space-y-5">
                  <CyberInput
                    label={auth.phoneLabel}
                    type="tel"
                    placeholder={auth.phonePlaceholder}
                    icon={<FaPhoneAlt aria-hidden="true" />}
                    autoComplete="tel"
                  />
                  <CyberInput
                    label={auth.emailLabel}
                    type="email"
                    placeholder={auth.emailPlaceholder}
                    icon={<FaRegEnvelope aria-hidden="true" />}
                    autoComplete="email"
                  />
                  <CyberInput
                    label={auth.passwordLabel}
                    type="password"
                    placeholder={auth.passwordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="new-password"
                  />
                  <CyberInput
                    label={auth.confirmPasswordLabel}
                    type="password"
                    placeholder={auth.confirmPasswordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="new-password"
                  />
                  <p className="font-tech text-sm text-zinc-500">{auth.registerHint}</p>
                  <CyberButton type="submit" variant="neon" className="w-full">
                    {auth.registerSubmit}
                  </CyberButton>
                </form>
              </CyberTabsContent>
            </CyberTabs>
          </CyberCardContent>
        </CyberCard>
      </section>
    </main>
  );
}
