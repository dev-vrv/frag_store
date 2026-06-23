"use client";

import { ShieldCheck } from "lucide-react";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
} from "@/components/cyber";
import {
  type AuthUser,
  updateProfile,
} from "@/lib/auth";
import { type Dictionary } from "@/lib/i18n";

export interface ProfileDetailsFormProps {
  dictionary: Dictionary["profile"];
  user: AuthUser;
}

export function ProfileDetailsForm({ dictionary, user }: ProfileDetailsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    address: user.address,
    two_factor_enabled: user.two_factor_enabled || user.pending_two_factor_enabled,
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(name: keyof typeof formData, value: string | boolean) {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      await updateProfile(formData);
      setNotice(dictionary.saveSuccess);
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : dictionary.errorFallback);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CyberCard variant="glass" className="border border-white/10 bg-zinc-950/80">
      <CyberCardContent className="space-y-6 p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
              {dictionary.editTitle}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
              {dictionary.editSubtitle}
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 xl:grid-cols-2">
            <CyberInput
              label={dictionary.firstNameLabel}
              value={formData.first_name}
              onChange={(event) => updateField("first_name", event.target.value)}
              placeholder={dictionary.firstNamePlaceholder}
            />
            <CyberInput
              label={dictionary.lastNameLabel}
              value={formData.last_name}
              onChange={(event) => updateField("last_name", event.target.value)}
              placeholder={dictionary.lastNamePlaceholder}
            />
            <CyberInput
              label={dictionary.emailLabel}
              value={user.email}
              disabled
              helperText={dictionary.emailReadonlyHint}
            />
            <CyberInput
              label={dictionary.phoneLabel}
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder={dictionary.phonePlaceholder}
            />
            <CyberInput
              label={dictionary.addressLabel}
              value={formData.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder={dictionary.addressPlaceholder}
              className="xl:col-span-2"
            />
          </div>

          <div className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-zinc-100" />
                <p className="font-tech text-sm uppercase tracking-[0.12em] text-zinc-100">
                  {dictionary.twoFactorLabel}
                </p>
              </div>
              <p className="mt-2 break-words text-sm leading-7 text-zinc-400">
                {user.email_verified ? dictionary.emailVerified : dictionary.emailNotVerified}
              </p>
            </div>
            <label
              className="flex cursor-pointer items-center gap-3 text-sm uppercase tracking-[0.12em] text-zinc-100"
            >
              <input
                type="checkbox"
                className="size-4 accent-zinc-100"
                checked={formData.two_factor_enabled}
                onChange={(event) => updateField("two_factor_enabled", event.target.checked)}
              />
              {dictionary.twoFactorToggle}
            </label>
          </div>

          {error ? <p className="font-tech text-sm text-red-300">{error}</p> : null}
          {notice ? <p className="font-tech text-sm text-amber-200">{notice}</p> : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <CyberButton type="submit" loading={isSaving} variant="outline" className="border-white/20 text-white hover:border-white/40 hover:bg-white/10 hover:text-white">
              {dictionary.saveLabel}
            </CyberButton>
          </div>
        </form>
      </CyberCardContent>
    </CyberCard>
  );
}
