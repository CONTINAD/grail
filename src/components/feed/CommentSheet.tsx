"use client";

import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: { username: string | null; name: string | null; image: string | null };
}

interface Props {
  postId: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
  canComment: boolean;
}

export function CommentSheet({
  postId,
  open,
  onClose,
  onCommentAdded,
  canComment,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .finally(() => setLoading(false));
  }, [open, postId]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((cur) => [data.comment, ...cur]);
        setText("");
        onCommentAdded();
      }
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[70dvh] rounded-t-3xl bg-zinc-900 text-zinc-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="font-bold">Comments</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {loading && <p className="text-zinc-500 text-sm">Loading…</p>}
          {!loading && comments.length === 0 && (
            <p className="text-zinc-500 text-sm">Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-yellow-400 text-black shrink-0 flex items-center justify-center text-xs font-bold">
                {(c.user.username ?? c.user.name ?? "?")[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">
                    @{c.user.username ?? c.user.name ?? "user"}
                  </span>{" "}
                  <span className="text-zinc-500 text-xs">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </p>
                <p className="text-sm text-zinc-200 mt-0.5 whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {canComment ? (
          <div className="flex items-center gap-2 px-5 py-3 border-t border-zinc-800">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400/50"
            />
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              className="rounded-full bg-yellow-400 text-black p-2 disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <a
            href="/auth/sign-in"
            className="px-5 py-3 border-t border-zinc-800 text-center text-sm text-yellow-400"
          >
            Sign in to comment
          </a>
        )}
      </div>
    </div>
  );
}
