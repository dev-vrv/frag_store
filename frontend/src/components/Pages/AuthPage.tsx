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
    <main className="auth-page relative isolate min-h-screen overflow-x-hidden transition-colors duration-500">
      <GeometricBackdrop
        className="auth-page__geometry absolute inset-0 z-0"
        variant="home"
        gridOpacityClassName="opacity-[0.16]"
        scanlineOpacityClassName="opacity-[0.06]"
      />
      <div className="auth-page__rail auth-page__rail--top" aria-hidden="true" />
      <div className="auth-page__rail auth-page__rail--bottom" aria-hidden="true" />

      <section className="auth-page__layout mx-auto grid min-h-screen w-full max-w-[90rem] items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(32rem,0.82fr)] lg:px-10 xl:gap-14">
        <div className="auth-page__intro relative min-h-[18rem] overflow-hidden px-2 py-4 sm:min-h-[22rem] lg:min-h-[34rem] lg:px-6 lg:py-10">
          <div
            className={cn(
              "absolute inset-0 p-4 transition-all duration-500",
              mode === "login" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="red" className="auth-page__badge">
              {auth.loginTab}
            </CyberBadge>
            <div className="mt-7">
              <BrandLogo className="w-[13rem] sm:w-[18rem]" imageClassName="brightness-[1.12]" priority />
            </div>
            <h2 className="auth-page__heading font-display mt-8 text-2xl font-normal uppercase tracking-[0.08em]">
              {auth.loginWelcomeTitle}
            </h2>
            <p className="auth-page__copy mt-5 max-w-xl text-lg leading-8">
              {auth.loginWelcomeText}
            </p>
          </div>

          <div
            className={cn(
              "absolute inset-0 p-4 transition-all duration-500",
              mode === "register" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <CyberBadge variant="violet" className="auth-page__badge">
              {auth.registerTab}
            </CyberBadge>
            <div className="mt-7">
              <BrandLogo className="w-[13rem] sm:w-[18rem]" imageClassName="brightness-[1.12]" priority />
            </div>
            <h2 className="auth-page__heading font-display mt-8 text-2xl font-normal uppercase tracking-[0.08em]">
              {auth.registerWelcomeTitle}
            </h2>
            <p className="auth-page__copy mt-5 max-w-xl text-lg leading-8">
              {auth.registerWelcomeText}
            </p>
          </div>
        </div>

        <CyberCard
          variant="glass"
          className="auth-page__card rounded-none p-1 transition-colors duration-500 lg:flex lg:items-center"
        >
          <CyberCardContent className="w-full p-5 sm:p-7 lg:px-10">
            <Link
              href={localizePath("/", locale)}
              className="auth-page__home-link mb-8 inline-flex items-center px-1 py-1 transition-opacity duration-300 hover:opacity-75 focus-visible:outline-none"
              aria-label="Frag Store"
            >
              <BrandLogo
                className="w-[9.4rem] sm:w-[11rem]"
                imageClassName="transition-opacity duration-300"
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
              <CyberTabsList className="auth-page__tabs-list grid w-full grid-cols-2 rounded-none transition-colors duration-300">
                <CyberTabsTrigger
                  value="login"
                  disabled={isAuthLocked}
                  className="auth-page__tab auth-page__tab--login transition-colors duration-300"
                >
                  {auth.loginTab}
                </CyberTabsTrigger>
                <CyberTabsTrigger
                  value="register"
                  disabled={isAuthLocked}
                  className="auth-page__tab auth-page__tab--register transition-colors duration-300"
                >
                  {auth.registerTab}
                </CyberTabsTrigger>
              </CyberTabsList>

              <CyberTabsContent
                value="login"
                className="auth-page__panel mt-5 animate-in rounded-none border fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <form className="space-y-5" onSubmit={handleLoginSubmit}>
                  <CyberInput
                    label={auth.emailLabel}
                    type="email"
                    placeholder={auth.emailPlaceholder}
                    icon={<FaRegEnvelope aria-hidden="true" />}
                    tone="neutral"
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
                    tone="neutral"
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
                    <p className="auth-page__notice font-tech text-sm">{loginNotice}</p>
                  ) : null}
                  <p className="auth-page__hint font-tech text-sm">{auth.loginHint}</p>
                  <CyberButton
                    type="submit"
                    variant="ghost"
                    className="auth-page__submit auth-page__submit--login w-full"
                    loading={isLoginPending}
                  >
                    {auth.loginSubmit}
                  </CyberButton>
                </form>
              </CyberTabsContent>

              <CyberTabsContent
                value="register"
                className="auth-page__panel mt-5 animate-in rounded-none border fade-in-50 slide-in-from-bottom-2 duration-300"
              >
                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <CyberInput
                      label={auth.firstNameLabel}
                      type="text"
                      placeholder={auth.firstNamePlaceholder}
                      icon={<FaUser aria-hidden="true" />}
                      tone="neutral"
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
                      tone="neutral"
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
                    tone="neutral"
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
                    tone="neutral"
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
                    tone="neutral"
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
                    tone="neutral"
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
                    <p className="auth-page__notice font-tech text-sm">{registerNotice}</p>
                  ) : null}
                  <p className="auth-page__hint font-tech text-sm">{auth.registerHint}</p>
                  <CyberButton
                    type="submit"
                    variant="ghost"
                    className="auth-page__submit auth-page__submit--register w-full"
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
