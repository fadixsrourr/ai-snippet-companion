import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/snippets` },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/snippets` },
    });
    setLoading(false);
    if (error) {
      setMessage("Something went wrong. Please try again.");
    } else {
      setMessage("Check your inbox for a magic login link ✉️");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="glass w-full max-w-md p-8 rounded-xl text-center space-y-6 relative overflow-hidden">
        {/* Header */}
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
          Welcome Back 👋
        </h1>
        <p className="text-neutral-400 text-sm">
          Sign in to manage your AI snippets
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 rounded-md bg-gradient-to-r from-cyan-500 to-sky-500 text-black font-medium hover:opacity-90 transition"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-neutral-500 text-xs">
          <div className="h-px bg-neutral-800 flex-1"></div>
          <span>or</span>
          <div className="h-px bg-neutral-800 flex-1"></div>
        </div>

        {/* Email login form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-neutral-800 text-neutral-200 font-medium hover:bg-neutral-700 transition disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send magic link ✉️"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-sm text-cyan-400 bg-neutral-900/40 rounded-md py-2">
            {message}
          </p>
        )}

        {/* Footer */}
        <p className="text-xs text-neutral-600 pt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
