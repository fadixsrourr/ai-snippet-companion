import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const sendMagicLink = async () => {
    setSending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + "/snippets",
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-soft">
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h3 className="text-sm font-medium text-neutral-200">Sign in with email</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-4 py-5">
          {!done ? (
            <>
              <label className="block text-sm text-neutral-300">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none ring-cyan-500/30 focus:ring-2"
                />
              </label>

              {error && (
                <p className="rounded-md border border-red-800/50 bg-red-950/50 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMagicLink}
                  disabled={!email || sending}
                  className="rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-black shadow-[0_10px_28px_-12px_rgba(34,211,238,.45)] disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send magic link"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-neutral-200">
                We’ve sent a sign-in link to <span className="font-medium">{email}</span>.
              </p>
              <p className="text-sm text-neutral-400">
                Open the email on this device and you’ll be redirected back into the app.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
