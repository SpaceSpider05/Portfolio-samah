"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";

export type AdminAiConversationListItem = {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  messageCount: number;
  preview?: string | null;
  followUpSentAt: string | null;
  bookingId: string | null;
  lastMessageAt: string | null;
};

export function AdminAiConversationsManager() {
  const [conversations, setConversations] = useState<AdminAiConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/ai-conversations", {
        cache: "no-store",
      });
      const payload = (await response.json()) as
        | AdminAiConversationListItem[]
        | { message?: string };

      if (!response.ok) {
        setError(
          !Array.isArray(payload) && payload.message
            ? payload.message
            : "Could not load AI conversations.",
        );
        setConversations([]);
        return;
      }

      setConversations(Array.isArray(payload) ? payload : []);
    } catch {
      setError("Could not load AI conversations.");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  return (
    <div>
      <AdminPageHeader
        title="Conversations with AI"
        description="Every chat with Samah AI. Open one to read the transcript, summarize, or email the visitor."
        action={
          <button
            type="button"
            onClick={() => void loadConversations()}
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
          >
            Refresh
          </button>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <AdminLoadingState label="Loading conversations…" />
      ) : conversations.length === 0 ? (
        <AdminCard>
          <p className="font-display text-2xl text-heading">No chats yet</p>
          <p className="mt-2 text-sm text-muted">
            When visitors talk with Samah AI, conversations appear here.
          </p>
        </AdminCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1.2fr_1fr_auto] gap-3 border-b border-border bg-surface-muted/30 px-4 py-3 text-[11px] uppercase tracking-wider text-muted">
            <span>Visitor</span>
            <span className="hidden sm:inline">Latest message</span>
            <span>Updated</span>
          </div>
          <ul className="divide-y divide-border">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={`/admin/ai-conversations/${conversation.id}`}
                  className="grid grid-cols-[1.2fr_1fr_auto] gap-3 px-4 py-4 transition hover:bg-surface-muted/25"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-heading">
                      {conversation.visitorName ?? "Anonymous visitor"}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">
                      {conversation.visitorEmail ?? "No email yet"}
                      {" · "}
                      {conversation.messageCount} msgs
                      {conversation.bookingId ? " · Booked" : ""}
                      {conversation.followUpSentAt ? " · Followed up" : ""}
                    </p>
                  </div>
                  <p className="hidden truncate text-sm text-muted sm:block">
                    {conversation.preview ?? "—"}
                  </p>
                  <p className="whitespace-nowrap text-xs text-muted">
                    {conversation.lastMessageAt
                      ? new Date(conversation.lastMessageAt).toLocaleString()
                      : "—"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
