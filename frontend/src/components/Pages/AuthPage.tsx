"use client";

import { useState } from "react";
import { FaLock, FaRegEnvelope, FaUserAstronaut } from "react-icons/fa";

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
import { Header } from "@/components/Header/Header";
import { type Dictionary, type Locale } from "@/lib/i18n";
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
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_22%,rgba(255,23,68,0.22),transparent_31%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.14),transparent_29%),linear-gradient(180deg,#050507,#000)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-70" />

      <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 overflow-hidden">
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

        <CyberCard variant="glass" className="p-2">
          <CyberCardContent className="p-5 sm:p-7">
            <CyberTabs
              value={mode}
              onValueChange={(value) => setMode(value as AuthMode)}
              className="w-full"
            >
              <CyberTabsList className="grid w-full grid-cols-2">
                <CyberTabsTrigger value="login">{auth.loginTab}</CyberTabsTrigger>
                <CyberTabsTrigger value="register">{auth.registerTab}</CyberTabsTrigger>
              </CyberTabsList>

              <CyberTabsContent
                value="login"
                className="mt-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
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
                className="mt-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <form className="space-y-5">
                  <CyberInput
                    label={auth.nameLabel}
                    placeholder={auth.namePlaceholder}
                    icon={<FaUserAstronaut aria-hidden="true" />}
                    autoComplete="nickname"
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
