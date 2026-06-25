"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { FaLock, FaPhoneAlt, FaRegEnvelope, FaUser } from "react-icons/fa";

import { GeometricBackdrop } from "@/components/Background/GeometricBackdrop";
import { BrandLogo } from "@/components/Brand/BrandLogo";
import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
  CyberTabs,
  CyberTabsContent,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { login, persistAuthCookies, register } from "@/lib/auth";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface AuthPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

type AuthMode = "login" | "register";

interface LoginFormState {
  email: string;
  password: string;
}

interface RegisterFormState {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
}

const initialLoginForm: LoginFormState = {
  email: "",
  password: "",
};

const initialRegisterForm: RegisterFormState = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  password_confirm: "",
};

export function AuthPage({ locale, dictionary }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialRegisterForm);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
  const [registerNotice, setRegisterNotice] = useState("");
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isRegisterPending, setIsRegisterPending] = useState(false);
  const auth = dictionary.auth;
  const profilePath = localizePath("/profile", locale);
  const isAuthLocked = isLoginPending || isRegisterPending;

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAuthLocked) {
      return;
    }

    setLoginError("");
    setLoginNotice("");
    setRegisterError("");
    setRegisterNotice("");
    setIsLoginPending(true);

    try {
      const response = await login(loginForm);
      persistAuthCookies(response);
      setLoginNotice(auth.loginSuccessNotice);
      window.location.assign(profilePath);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : auth.errorFallback);
      setIsLoginPending(false);
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAuthLocked) {
      return;
    }

    setRegisterError("");
    setRegisterNotice("");
    setLoginError("");
    setLoginNotice("");
    setIsRegisterPending(true);

    try {
      const response = await register(registerForm);
      persistAuthCookies(response);
      setRegisterNotice(auth.registerSuccessNotice);
      window.location.assign(profilePath);
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : auth.errorFallback);
      setIsRegisterPending(false);
    }
  }

  return (
    <main
      className={cn(
        "relative isolate min-h-screen overflow-hidden bg-black text-zinc-50 transition-colors duration-700",
        mode === "login" ? "selection:bg-red-400/30" : "selection:bg-fuchsia-400/30",
      )}
    >
      <div className="absolute inset-0 -z-30">
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,23,68,0.3),transparent_31%),radial-gradient(circle_at_78%_18%,rgba(127,29,29,0.42),transparent_30%),radial-gradient(circle_at_58%_78%,rgba(217,70,239,0.08),transparent_24%),linear-gradient(180deg,#050507_0%,#120507_48%,#000_100%)] transition-opacity duration-700",
            mode === "login" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(217,70,239,0.34),transparent_32%),radial-gradient(circle_at_62%_78%,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,#040509_0%,#16051a_52%,#020204_100%)] transition-opacity duration-700",
            mode === "register" ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <div className="absolute inset-0 -z-20">
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(255,23,68,0.14),transparent_34%),radial-gradient(circle_at_72%_72%,rgba(190,242,100,0.08),transparent_24%)] transition-opacity duration-700",
            mode === "login" ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_76%_70%,rgba(217,70,239,0.14),transparent_24%)] transition-opacity duration-700",
            mode === "register" ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <GeometricBackdrop
        className={cn("absolute inset-0 -z-20 transition-opacity duration-700", mode === "login" ? "opacity-100" : "opacity-0")}
        variant="auth-login"
        gridOpacityClassName="opacity-70"
        scanlineOpacityClassName="opacity-35"
      />
      <GeometricBackdrop
        className={cn("absolute inset-0 -z-20 transition-opacity duration-700", mode === "register" ? "opacity-100" : "opacity-0")}
        variant="auth-register"
        gridOpacityClassName="opacity-55"
        scanlineOpacityClassName="opacity-25"
      />
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-700",
          mode === "login" ? "via-red-400/85" : "via-fuchsia-300/85",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-700",
          mode === "login" ? "via-red-500/70" : "via-cyan-300/75",
        )}
      />

      <section className="grid min-h-screen w-full items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(520px,44vw)] lg:px-0 lg:py-0">
        <div className="relative min-h-[26rem] overflow-hidden lg:ml-8 lg:min-h-[34rem] lg:max-w-3xl xl:ml-16">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500",
              mode === "login" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="red" glow>
              {auth.loginTab}
            </CyberBadge>
            <div className="mt-7">
              <BrandLogo className="w-[13rem] sm:w-[18rem]" imageClassName="brightness-[1.12]" priority />
            </div>
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
              mode === "register" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="violet" glow>
              {auth.registerTab}
            </CyberBadge>
            <div className="mt-7">
              <BrandLogo className="w-[13rem] sm:w-[18rem]" imageClassName="brightness-[1.12]" priority />
            </div>
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
          className={cn(
            "rounded-md p-2 transition-all duration-700 lg:flex lg:min-h-screen lg:items-center",
            mode === "login"
              ? "border-red-500/20 bg-black/38 shadow-[0_0_44px_rgba(255,23,68,0.12)]"
              : "border-fuchsia-400/25 bg-black/42 shadow-[0_0_54px_rgba(217,70,239,0.16)]",
          )}
        >
          <CyberCardContent className="w-full p-5 sm:p-7 lg:px-10">
            <Link
              href={localizePath("/", locale)}
              className={cn(
                "mb-8 inline-flex items-center px-1 py-1 transition-all duration-500 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2",
                mode === "login"
                  ? "focus-visible:ring-red-300/35"
                  : "focus-visible:ring-fuchsia-300/35",
              )}
              aria-label="Frag Store"
            >
              <BrandLogo
                className="w-[9.4rem] sm:w-[11rem]"
                imageClassName={cn(
                  "transition-all duration-500",
                  mode === "login" ? "brightness-[1.06]" : "brightness-[1.08] hue-rotate-[8deg]",
                )}
              />
            </Link>
            <CyberTabs
              value={mode}
              onValueChange={(value) => {
                if (!isAuthLocked) {
                  setMode(value as AuthMode);
                }
              }}
              className="w-full"
            >
              <CyberTabsList
                className={cn(
                  "grid w-full grid-cols-2 rounded-md transition-all duration-700",
                  mode === "login"
                    ? "border-red-300/15 bg-black/45 shadow-[inset_0_0_22px_rgba(248,113,113,0.05)]"
                    : "border-fuchsia-300/20 bg-black/50 shadow-[inset_0_0_26px_rgba(217,70,239,0.09)]",
                )}
              >
                <CyberTabsTrigger
                  value="login"
                  disabled={isAuthLocked}
                  className={cn(
                    "transition-all duration-500",
                    mode === "login"
                      ? "data-[state=active]:border-red-300/35 data-[state=active]:bg-red-400/12 data-[state=active]:text-red-100 data-[state=active]:shadow-[0_0_22px_rgba(248,113,113,0.22)]"
                      : "data-[state=active]:border-cyan-300/30 data-[state=active]:bg-cyan-300/10 data-[state=active]:text-cyan-100 data-[state=active]:shadow-[0_0_22px_rgba(34,211,238,0.2)]",
                  )}
                >
                  {auth.loginTab}
                </CyberTabsTrigger>
                <CyberTabsTrigger
                  value="register"
                  disabled={isAuthLocked}
                  className={cn(
                    "transition-all duration-500",
                    mode === "login"
                      ? "data-[state=active]:border-fuchsia-300/35 data-[state=active]:bg-fuchsia-400/12 data-[state=active]:text-fuchsia-100 data-[state=active]:shadow-[0_0_22px_rgba(217,70,239,0.22)]"
                      : "data-[state=active]:border-fuchsia-300/40 data-[state=active]:bg-fuchsia-400/14 data-[state=active]:text-fuchsia-50 data-[state=active]:shadow-[0_0_24px_rgba(217,70,239,0.26)]",
                  )}
                >
                  {auth.registerTab}
                </CyberTabsTrigger>
              </CyberTabsList>

              <CyberTabsContent
                value="login"
                className={cn(
                  "mt-5 animate-in rounded-md border fade-in-50 slide-in-from-bottom-2 duration-300",
                  mode === "login"
                    ? "border-red-400/15 bg-red-500/[0.035] shadow-[inset_0_0_30px_rgba(255,23,68,0.05)]"
                    : "border-cyan-300/12 bg-cyan-500/[0.03] shadow-[inset_0_0_30px_rgba(34,211,238,0.04)]",
                )}
              >
                <form className="space-y-5" onSubmit={handleLoginSubmit}>
                  <CyberInput
                    label={auth.emailLabel}
                    type="email"
                    placeholder={auth.emailPlaceholder}
                    icon={<FaRegEnvelope aria-hidden="true" />}
                    autoComplete="email"
                    required
                    disabled={isAuthLocked}
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                  <CyberInput
                    label={auth.passwordLabel}
                    type="password"
                    placeholder={auth.passwordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="current-password"
                    required
                    disabled={isAuthLocked}
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({ ...current, password: event.target.value }))
                    }
                    errorText={loginError || undefined}
                  />
                  {loginNotice ? (
                    <p className="font-tech text-sm text-cyan-100">{loginNotice}</p>
                  ) : null}
                  <p className="font-tech text-sm text-zinc-500">{auth.loginHint}</p>
                  <CyberButton
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={isLoginPending}
                  >
                    {auth.loginSubmit}
                  </CyberButton>
                </form>
              </CyberTabsContent>

              <CyberTabsContent
                value="register"
                className={cn(
                  "mt-5 animate-in rounded-md border fade-in-50 slide-in-from-bottom-2 duration-300",
                  mode === "login"
                    ? "border-fuchsia-300/15 bg-fuchsia-500/[0.04] shadow-[inset_0_0_30px_rgba(217,70,239,0.05)]"
                    : "border-fuchsia-300/24 bg-fuchsia-500/[0.055] shadow-[inset_0_0_36px_rgba(217,70,239,0.08)]",
                )}
              >
                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <CyberInput
                      label={auth.firstNameLabel}
                      type="text"
                      placeholder={auth.firstNamePlaceholder}
                      icon={<FaUser aria-hidden="true" />}
                      autoComplete="given-name"
                      required
                      disabled={isAuthLocked}
                      value={registerForm.first_name}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          first_name: event.target.value,
                        }))
                      }
                    />
                    <CyberInput
                      label={auth.lastNameLabel}
                      type="text"
                      placeholder={auth.lastNamePlaceholder}
                      icon={<FaUser aria-hidden="true" />}
                      autoComplete="family-name"
                      disabled={isAuthLocked}
                      value={registerForm.last_name}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          last_name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <CyberInput
                    label={auth.phoneLabel}
                    type="tel"
                    placeholder={auth.phonePlaceholder}
                    icon={<FaPhoneAlt aria-hidden="true" />}
                    autoComplete="tel"
                    disabled={isAuthLocked}
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                  <CyberInput
                    label={auth.emailLabel}
                    type="email"
                    placeholder={auth.emailPlaceholder}
                    icon={<FaRegEnvelope aria-hidden="true" />}
                    autoComplete="email"
                    required
                    disabled={isAuthLocked}
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                  <CyberInput
                    label={auth.passwordLabel}
                    type="password"
                    placeholder={auth.passwordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="new-password"
                    required
                    disabled={isAuthLocked}
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                  <CyberInput
                    label={auth.confirmPasswordLabel}
                    type="password"
                    placeholder={auth.confirmPasswordPlaceholder}
                    icon={<FaLock aria-hidden="true" />}
                    autoComplete="new-password"
                    required
                    disabled={isAuthLocked}
                    value={registerForm.password_confirm}
                    onChange={(event) =>
                      setRegisterForm((current) => ({
                        ...current,
                        password_confirm: event.target.value,
                      }))
                    }
                    errorText={registerError || undefined}
                  />
                  {registerNotice ? (
                    <p className="font-tech text-sm text-cyan-100">{registerNotice}</p>
                  ) : null}
                  <p className="font-tech text-sm text-zinc-500">{auth.registerHint}</p>
                  <CyberButton
                    type="submit"
                    variant="neon"
                    className="w-full"
                    loading={isRegisterPending}
                  >
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
