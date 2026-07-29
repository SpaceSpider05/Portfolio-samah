"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import { cn } from "@/lib/utils";

type AiMessage = {
  role: string;
  content: string;
};

type AdminAiConversation = {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  messageCount: number;
  visitorProfile: Record<string, unknown>;
  summary: string | null;
  followUpSentAt: string | null;
  bookingId: string | null;
  lastMessageAt: string | null;
  messages?: AiMessage[];
};

type Props = {
  conversationId: string;
};

export function AdminAiConversationDetail({ conversationId }: Props) {
  const [conversation, setConversation] = useState<AdminAiConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [followSubject, setFollowSubject] = useState(
    "Following up on your chat with Samah AI",
  );
  const [followMessage, setFollowMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/ai-conversations/${conversationId}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as
        | AdminAiConversation
        | { message?: string };

      if (!response.ok || !("id" in payload)) {
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not load conversation.",
        );
        setConversation(null);
        return;
      }

      setConversation(payload);
    } catch {
      setError("Could not load conversation.");
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const profileEntries = useMemo(() => {
    if (!conversation?.visitorProfile) {
      return [];
    }
    return Object.entries(conversation.visitorProfile).filter(
      ([, value]) => value !== null && value !== undefined && String(value) !== "",
    );
  }, [conversation]);

  const summarize = async () => {
    setBusy("summarize");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/admin/ai-conversations/${conversationId}/summarize`,
        { method: "POST" },
      );
      const payload = (await response.json()) as
        | AdminAiConversation
        | { message?: string };
      if (!response.ok || !("id" in payload)) {
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not summarize.",
        );
        return;
      }
      setConversation(payload);
      setNotice("Summary ready.");
    } catch {
      setError("Could not summarize.");
    } finally {
      setBusy(null);
    }
  };

  const draftFollowUp = async () => {
    setBusy("draft");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/admin/ai-conversations/${conversationId}/draft-follow-up`,
        { method: "POST" },
      );
      const payload = (await response.json()) as {
        subject?: string;
        message?: string;
      };
      if (!response.ok) {
        setError(payload.message ?? "Could not draft follow-up.");
        return;
      }
      if (payload.subject) {
        setFollowSubject(payload.subject);
      }
      if (typeof payload.message === "string") {
        setFollowMessage(payload.message);
      }
      setNotice("Draft ready — review and send. Uses your SMTP settings.");
    } catch {
      setError("Could not draft follow-up.");
    } finally {
      setBusy(null);
    }
  };

  const sendFollowUp = async () => {
    setBusy("send");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/admin/ai-conversations/${conversationId}/follow-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: followSubject,
            message: followMessage || undefined,
          }),
        },
      );
      const payload = (await response.json()) as
        | (AdminAiConversation & { message?: string })
        | { message?: string };

      if (!response.ok) {
        setError(
          "message" in payload && payload.message
            ? payload.message
            : "Could not send email.",
        );
        return;
      }

      if ("id" in payload) {
        setConversation(payload);
      }
      setNotice("Follow-up email sent via SMTP.");
    } catch {
      setError("Could not send email.");
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading conversation…" />;
  }

  if (!conversation) {
    return (
      <div>
        <AdminPageHeader title="Conversation" description="Not found." />
        {error ? (
          <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
        <Link href="/admin/ai-conversations" className="text-sm text-rose-300 hover:underline">
          ← Back to conversations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={conversation.visitorName ?? "Anonymous visitor"}
        description={conversation.visitorEmail ?? "Email not collected yet"}
        action={
          <Link
            href="/admin/ai-conversations"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
          >
            ← All conversations
          </Link>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-2xl border border-border bg-surface-muted/30 px-4 py-3 text-sm text-foreground">
          {notice}
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-border px-2.5 py-1">
          {conversation.messageCount} messages
        </span>
        {conversation.bookingId ? (
          <Link
            href="/admin/bookings"
            className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-rose-200"
          >
            Linked booking #{conversation.bookingId}
          </Link>
        ) : null}
        {conversation.followUpSentAt ? (
          <span className="rounded-full border border-border px-2.5 py-1">
            Follow-up sent {new Date(conversation.followUpSentAt).toLocaleString()}
          </span>
        ) : null}
      </div>

      <div className="space-y-5">
        <AdminCard className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void summarize()}
              className="rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-50"
            >
              {busy === "summarize" ? "Summarizing…" : "Summarize"}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void draftFollowUp()}
              className="rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-50"
            >
              {busy === "draft" ? "Drafting…" : "Draft follow-up email"}
            </button>
          </div>

          {profileEntries.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {profileEntries.map(([key, value]) => (
                <p key={key} className="text-sm">
                  <span className="text-muted">{key}</span>
                  <span className="mt-0.5 block text-heading">{String(value)}</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No profile details saved yet.</p>
          )}

          {conversation.summary ? (
            <div className="rounded-2xl border border-border bg-surface-muted/20 px-4 py-3 text-sm whitespace-pre-wrap text-foreground">
              {conversation.summary}
            </div>
          ) : null}
        </AdminCard>

        <AdminCard className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">Transcript</p>
          <div className="space-y-3">
            {(conversation.messages ?? []).map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "rounded-2xl px-3 py-2.5 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "bg-rose-400/10 text-heading"
                    : "border border-border text-foreground",
                )}
              >
                <p className="mb-1 text-[10px] uppercase tracking-wider text-muted">
                  {message.role === "user" ? "Visitor" : "Samah AI"}
                </p>
                {message.content}
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted">
            Human follow-up email (SMTP)
          </p>
          <input
            value={followSubject}
            onChange={(event) => setFollowSubject(event.target.value)}
            className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-rose-400"
            placeholder="Subject"
          />
          <textarea
            value={followMessage}
            onChange={(event) => setFollowMessage(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-rose-400"
            placeholder="Write or draft a warm follow-up inviting a real conversation…"
          />
          <button
            type="button"
            disabled={busy !== null || !conversation.visitorEmail}
            onClick={() => void sendFollowUp()}
            className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "send" ? "Sending…" : "Send follow-up email"}
          </button>
          {!conversation.visitorEmail ? (
            <p className="text-xs text-muted">
              Needs a visitor email from the chat before sending.
            </p>
          ) : (
            <p className="text-xs text-muted">
              Sends immediately through your configured Laravel SMTP mailer.
            </p>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
