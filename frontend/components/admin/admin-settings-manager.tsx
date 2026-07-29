"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import { ProjectCoverUploader } from "@/components/admin/project-cover-uploader";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import type {
  AboutContent,
  Achievement,
  AdminAccount,
  SiteSettings,
  TimelineItem,
} from "@/types";
import { cn } from "@/lib/utils";

type SettingsTab = "biography" | "email" | "account";

type TimelineDraft = Omit<TimelineItem, "id"> & { id?: string };
type AchievementDraft = Omit<Achievement, "id"> & { id?: string };

type BiographyForm = {
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  mission: string;
  timeline: TimelineDraft[];
  achievements: AchievementDraft[];
};

type EmailForm = {
  contactEmail: string;
  contactPhone: string;
  bookingNotifyEmail: string;
  mailFromName: string;
};

type AccountForm = {
  name: string;
  email: string;
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border bg-tobago-800/60 px-3 py-2.5 text-sm text-fantasy-100 outline-none placeholder:text-muted focus:border-rose-400";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "biography", label: "Biography" },
  { id: "email", label: "Email & Contact" },
  { id: "account", label: "Account" },
];

const emptyBiography = (): BiographyForm => ({
  name: "",
  role: "",
  photoUrl: "",
  bio: "",
  mission: "",
  timeline: [],
  achievements: [],
});

const emptyEmail = (): EmailForm => ({
  contactEmail: "",
  contactPhone: "",
  bookingNotifyEmail: "",
  mailFromName: "",
});

const emptyAccount = (): AccountForm => ({
  name: "",
  email: "",
  currentPassword: "",
  password: "",
  passwordConfirmation: "",
});

export function AdminSettingsManager() {
  const hydrate = useAdminAuthStore((s) => s.hydrate);
  const [tab, setTab] = useState<SettingsTab>("biography");

  const [biography, setBiography] = useState<BiographyForm>(emptyBiography);
  const [emailForm, setEmailForm] = useState<EmailForm>(emptyEmail);
  const [account, setAccount] = useState<AccountForm>(emptyAccount);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [aboutRes, siteRes, accountRes] = await Promise.all([
        fetch("/api/admin/about", { cache: "no-store" }),
        fetch("/api/admin/site-settings", { cache: "no-store" }),
        fetch("/api/admin/account", { cache: "no-store" }),
      ]);

      const aboutPayload = (await aboutRes.json()) as AboutContent & {
        message?: string;
      };
      const sitePayload = (await siteRes.json()) as SiteSettings & {
        message?: string;
      };
      const accountPayload = (await accountRes.json()) as AdminAccount & {
        message?: string;
      };

      if (!aboutRes.ok || !siteRes.ok || !accountRes.ok) {
        setError(
          aboutPayload.message ??
            sitePayload.message ??
            accountPayload.message ??
            "Could not load settings.",
        );
        return;
      }

      setBiography({
        name: aboutPayload.name ?? "",
        role: aboutPayload.role ?? "",
        photoUrl: aboutPayload.photoUrl ?? "",
        bio: aboutPayload.bio ?? "",
        mission: aboutPayload.mission ?? "",
        timeline: (aboutPayload.timeline ?? []).map((item) => ({ ...item })),
        achievements: (aboutPayload.achievements ?? []).map((item) => ({
          ...item,
          suffix: item.suffix ?? "",
        })),
      });

      setEmailForm({
        contactEmail: sitePayload.contactEmail ?? "",
        contactPhone: sitePayload.contactPhone ?? "",
        bookingNotifyEmail: sitePayload.bookingNotifyEmail ?? "",
        mailFromName: sitePayload.mailFromName ?? "",
      });

      setAccount({
        name: accountPayload.name ?? "",
        email: accountPayload.email ?? "",
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
      });
    } catch {
      setError("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const clearFeedback = () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const saveBiography = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    clearFeedback();

    try {
      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: biography.name,
          role: biography.role,
          photoUrl: biography.photoUrl,
          bio: biography.bio,
          mission: biography.mission,
          timeline: biography.timeline.map(({ year, title, description }) => ({
            year,
            title,
            description,
          })),
          achievements: biography.achievements.map(({ label, value, suffix }) => ({
            label,
            value: Number(value),
            suffix: suffix ?? "",
          })),
        }),
      });

      const payload = (await response.json()) as AboutContent & {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        setFieldErrors(payload.errors ?? {});
        setError(payload.message ?? "Could not save biography.");
        return;
      }

      setBiography({
        name: payload.name,
        role: payload.role,
        photoUrl: payload.photoUrl,
        bio: payload.bio,
        mission: payload.mission,
        timeline: payload.timeline,
        achievements: payload.achievements,
      });
      setSuccess("Biography saved.");
    } catch {
      setError("Could not save biography.");
    } finally {
      setSaving(false);
    }
  };

  const saveEmail = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    clearFeedback();

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactEmail: emailForm.contactEmail,
          contactPhone: emailForm.contactPhone || null,
          bookingNotifyEmail: emailForm.bookingNotifyEmail,
          mailFromName: emailForm.mailFromName || null,
        }),
      });

      const payload = (await response.json()) as SiteSettings & {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        setFieldErrors(payload.errors ?? {});
        setError(payload.message ?? "Could not save email settings.");
        return;
      }

      setEmailForm({
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone ?? "",
        bookingNotifyEmail: payload.bookingNotifyEmail,
        mailFromName: payload.mailFromName ?? "",
      });
      setSuccess("Email & contact settings saved.");
    } catch {
      setError("Could not save email settings.");
    } finally {
      setSaving(false);
    }
  };

  const saveAccount = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    clearFeedback();

    try {
      const body: Record<string, string> = {
        name: account.name,
        email: account.email,
      };

      if (account.password) {
        body.currentPassword = account.currentPassword;
        body.password = account.password;
        body.password_confirmation = account.passwordConfirmation;
      }

      const response = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as AdminAccount & {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        setFieldErrors(payload.errors ?? {});
        setError(payload.message ?? "Could not update account.");
        return;
      }

      setAccount({
        name: payload.name,
        email: payload.email,
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
      });
      await hydrate();
      setSuccess(
        account.password
          ? "Account and password updated."
          : "Account details updated.",
      );
    } catch {
      setError("Could not update account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader
          title="Settings"
          description="Manage biography, email contacts, and your admin account."
        />
        <AdminLoadingState label="Loading settings…" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage biography, email contacts, and your admin account."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              clearFeedback();
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              tab === item.id
                ? "bg-rose-400 text-tobago-900"
                : "border border-border text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mb-4 rounded-xl border border-silver-400/30 bg-silver-400/10 px-4 py-3 text-sm text-fantasy-100">
          {success}
        </p>
      ) : null}

      {tab === "biography" ? (
        <form onSubmit={saveBiography} className="space-y-6">
          <AdminCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Biography
              </p>
              <p className="mt-1 text-sm text-muted">
                Name, role, portrait, and story copy for the About section.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Name
                </span>
                <input
                  className={fieldClass}
                  value={biography.name}
                  onChange={(e) =>
                    setBiography((c) => ({ ...c, name: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Role
                </span>
                <input
                  className={fieldClass}
                  value={biography.role}
                  onChange={(e) =>
                    setBiography((c) => ({ ...c, role: e.target.value }))
                  }
                  required
                />
              </label>

              <ProjectCoverUploader
                value={biography.photoUrl}
                onChange={(value) =>
                  setBiography((c) => ({ ...c, photoUrl: value }))
                }
                error={fieldErrors.photoUrl?.[0]}
                label="Portrait photo"
                folder="about"
                helpText="Upload a JPG, PNG, or WebP (max 5MB). Shown in the Biography section."
              />

              <label className="block text-sm md:col-span-2">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Bio
                </span>
                <textarea
                  className={cn(fieldClass, "min-h-28 resize-y")}
                  value={biography.bio}
                  onChange={(e) =>
                    setBiography((c) => ({ ...c, bio: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="block text-sm md:col-span-2">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Mission
                </span>
                <textarea
                  className={cn(fieldClass, "min-h-24 resize-y")}
                  value={biography.mission}
                  onChange={(e) =>
                    setBiography((c) => ({ ...c, mission: e.target.value }))
                  }
                  required
                />
              </label>
            </div>
          </AdminCard>

          <AdminCard className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Timeline
                </p>
                <p className="mt-1 text-sm text-muted">
                  Career milestones shown beside the portrait.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBiography((c) => ({
                    ...c,
                    timeline: [
                      ...c.timeline,
                      { year: "", title: "", description: "" },
                    ],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-fantasy-100 transition hover:border-rose-400/50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {biography.timeline.length === 0 ? (
                <p className="text-sm text-muted">No timeline items yet.</p>
              ) : (
                biography.timeline.map((item, index) => (
                  <div
                    key={item.id ?? `timeline-${index}`}
                    className="grid gap-3 rounded-2xl border border-border/70 bg-tobago-900/20 p-4 md:grid-cols-[100px_1fr_auto]"
                  >
                    <label className="block text-sm">
                      <span className="text-xs uppercase tracking-wider text-muted">
                        Year
                      </span>
                      <input
                        className={fieldClass}
                        value={item.year}
                        onChange={(e) =>
                          setBiography((c) => ({
                            ...c,
                            timeline: c.timeline.map((row, i) =>
                              i === index
                                ? { ...row, year: e.target.value }
                                : row,
                            ),
                          }))
                        }
                        required
                      />
                    </label>
                    <div className="space-y-3">
                      <label className="block text-sm">
                        <span className="text-xs uppercase tracking-wider text-muted">
                          Title
                        </span>
                        <input
                          className={fieldClass}
                          value={item.title}
                          onChange={(e) =>
                            setBiography((c) => ({
                              ...c,
                              timeline: c.timeline.map((row, i) =>
                                i === index
                                  ? { ...row, title: e.target.value }
                                  : row,
                              ),
                            }))
                          }
                          required
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="text-xs uppercase tracking-wider text-muted">
                          Description
                        </span>
                        <textarea
                          className={cn(fieldClass, "min-h-20 resize-y")}
                          value={item.description}
                          onChange={(e) =>
                            setBiography((c) => ({
                              ...c,
                              timeline: c.timeline.map((row, i) =>
                                i === index
                                  ? { ...row, description: e.target.value }
                                  : row,
                              ),
                            }))
                          }
                          required
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove timeline item"
                      onClick={() =>
                        setBiography((c) => ({
                          ...c,
                          timeline: c.timeline.filter((_, i) => i !== index),
                        }))
                      }
                      className="mt-6 inline-flex h-10 w-10 items-center justify-center self-start rounded-xl border border-border text-rose-300 transition hover:bg-rose-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          <AdminCard className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Achievements
                </p>
                <p className="mt-1 text-sm text-muted">
                  Highlight numbers under the biography story.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBiography((c) => ({
                    ...c,
                    achievements: [
                      ...c.achievements,
                      { label: "", value: 0, suffix: "" },
                    ],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-fantasy-100 transition hover:border-rose-400/50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {biography.achievements.length === 0 ? (
                <p className="text-sm text-muted">No achievements yet.</p>
              ) : (
                biography.achievements.map((item, index) => (
                  <div
                    key={item.id ?? `achievement-${index}`}
                    className="grid gap-3 rounded-2xl border border-border/70 bg-tobago-900/20 p-4 md:grid-cols-[1fr_120px_100px_auto]"
                  >
                    <label className="block text-sm">
                      <span className="text-xs uppercase tracking-wider text-muted">
                        Label
                      </span>
                      <input
                        className={fieldClass}
                        value={item.label}
                        onChange={(e) =>
                          setBiography((c) => ({
                            ...c,
                            achievements: c.achievements.map((row, i) =>
                              i === index
                                ? { ...row, label: e.target.value }
                                : row,
                            ),
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-xs uppercase tracking-wider text-muted">
                        Value
                      </span>
                      <input
                        type="number"
                        min={0}
                        className={fieldClass}
                        value={item.value}
                        onChange={(e) =>
                          setBiography((c) => ({
                            ...c,
                            achievements: c.achievements.map((row, i) =>
                              i === index
                                ? {
                                    ...row,
                                    value: Number(e.target.value) || 0,
                                  }
                                : row,
                            ),
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-xs uppercase tracking-wider text-muted">
                        Suffix
                      </span>
                      <input
                        className={fieldClass}
                        value={item.suffix}
                        onChange={(e) =>
                          setBiography((c) => ({
                            ...c,
                            achievements: c.achievements.map((row, i) =>
                              i === index
                                ? { ...row, suffix: e.target.value }
                                : row,
                            ),
                          }))
                        }
                        placeholder="+"
                      />
                    </label>
                    <button
                      type="button"
                      aria-label="Remove achievement"
                      onClick={() =>
                        setBiography((c) => ({
                          ...c,
                          achievements: c.achievements.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                      className="mt-6 inline-flex h-10 w-10 items-center justify-center self-start rounded-xl border border-border text-rose-300 transition hover:bg-rose-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-rose-400 px-6 py-2.5 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save biography"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "email" ? (
        <form onSubmit={saveEmail} className="space-y-6">
          <AdminCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Public contact
              </p>
              <p className="mt-1 text-sm text-muted">
                Shown in the site footer and used as your public contact details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Contact email
                </span>
                <input
                  type="email"
                  className={fieldClass}
                  value={emailForm.contactEmail}
                  onChange={(e) =>
                    setEmailForm((c) => ({
                      ...c,
                      contactEmail: e.target.value,
                    }))
                  }
                  required
                />
                {fieldErrors.contactEmail?.[0] ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    {fieldErrors.contactEmail[0]}
                  </span>
                ) : null}
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Contact phone
                </span>
                <input
                  className={fieldClass}
                  value={emailForm.contactPhone}
                  onChange={(e) =>
                    setEmailForm((c) => ({
                      ...c,
                      contactPhone: e.target.value,
                    }))
                  }
                  placeholder="+1 (555) 010-2040"
                />
              </label>
            </div>
          </AdminCard>

          <AdminCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Booking notifications
              </p>
              <p className="mt-1 text-sm text-muted">
                New booking alerts are sent to this address. Customers still get
                their own confirmation email.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Notify email
                </span>
                <input
                  type="email"
                  className={fieldClass}
                  value={emailForm.bookingNotifyEmail}
                  onChange={(e) =>
                    setEmailForm((c) => ({
                      ...c,
                      bookingNotifyEmail: e.target.value,
                    }))
                  }
                  required
                />
                {fieldErrors.bookingNotifyEmail?.[0] ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    {fieldErrors.bookingNotifyEmail[0]}
                  </span>
                ) : null}
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  From name
                </span>
                <input
                  className={fieldClass}
                  value={emailForm.mailFromName}
                  onChange={(e) =>
                    setEmailForm((c) => ({
                      ...c,
                      mailFromName: e.target.value,
                    }))
                  }
                  placeholder="Samah"
                />
              </label>
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-rose-400 px-6 py-2.5 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save email settings"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "account" ? (
        <form onSubmit={saveAccount} className="space-y-6">
          <AdminCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Admin account
              </p>
              <p className="mt-1 text-sm text-muted">
                Update the name and email you use to sign in to the admin panel.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Name
                </span>
                <input
                  className={fieldClass}
                  value={account.name}
                  onChange={(e) =>
                    setAccount((c) => ({ ...c, name: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Login email
                </span>
                <input
                  type="email"
                  className={fieldClass}
                  value={account.email}
                  onChange={(e) =>
                    setAccount((c) => ({ ...c, email: e.target.value }))
                  }
                  required
                />
                {fieldErrors.email?.[0] ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    {fieldErrors.email[0]}
                  </span>
                ) : null}
              </label>
            </div>
          </AdminCard>

          <AdminCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Change password
              </p>
              <p className="mt-1 text-sm text-muted">
                Leave blank to keep your current password.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm md:col-span-2">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Current password
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className={fieldClass}
                  value={account.currentPassword}
                  onChange={(e) =>
                    setAccount((c) => ({
                      ...c,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                {fieldErrors.currentPassword?.[0] ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    {fieldErrors.currentPassword[0]}
                  </span>
                ) : null}
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  New password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={fieldClass}
                  value={account.password}
                  onChange={(e) =>
                    setAccount((c) => ({ ...c, password: e.target.value }))
                  }
                />
                {fieldErrors.password?.[0] ? (
                  <span className="mt-1 block text-xs text-rose-300">
                    {fieldErrors.password[0]}
                  </span>
                ) : null}
              </label>

              <label className="block text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">
                  Confirm new password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={fieldClass}
                  value={account.passwordConfirmation}
                  onChange={(e) =>
                    setAccount((c) => ({
                      ...c,
                      passwordConfirmation: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-rose-400 px-6 py-2.5 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save account"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
