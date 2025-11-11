import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import AuthDialog from "./AuthDialog";

type SessionUser = {
  id: string;
  email?: string;
  user_metadata?: { avatar_url?: string; name?: string; full_name?: string };
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.6c-.24 1.3-1.68 3.8-5.6 3.8-3.36 0-6.1-2.78-6.1-6.2s2.74-6.2 6.1-6.2c1.92 0 3.22.82 3.96 1.52l2.7-2.6C16.98 2.36 14.7 1.4 12 1.4 6.7 1.4 2.4 5.72 2.4 11s4.3 9.6 9.6 9.6c5.54 0 9.2-3.88 9.2-9.34 0-.62-.06-1.08-.14-1.56H12Z"
      />
      <path fill="#4285F4" d="M3 7.15l3.2 2.34C7.3 7.4 9.46 6 12 6c1.92 0 3.22.82 3.96 1.52l2.7-2.6C16.98 2.36 14.7 1.4 12 1.4 8.26 1.4 5.02 3.52 3 7.15Z" />
      <path fill="#34A853" d="M12 20.6c2.88 0 5.3-.94 7.06-2.56l-3.26-2.52c-.88.62-2.06 1.06-3.8 1.06-2.94 0-5.44-1.98-6.34-4.66L2.36 14c1.98 3.94 6.08 6.6 9.64 6.6Z" />
      <path fill="#FBBC05" d="M20.94 18.04C22.06 16.5 22.6 14.56 22.6 12c0-.62-.06-1.08-.14-1.56H12v3.96h5.6c-.24 1.3-1.68 3.8-5.6 3.8-.04 0-.1 0-.14-.02l3.08 2.36c2.04-.34 3.9-1.3 5-2.5Z" />
    </svg>
  );
}

function Avatar({ email, src }: { email?: string; src?: string }) {
  const letter = (email?.[0] || "U").toUpperCase();
  return (
    <div className="relative h-7 w-7 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-neutral-700">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="avatar" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center text-xs text-neutral-300">{letter}</div>
      )}
    </div>
  );
}

export function NavBar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser((data?.user as any) || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser((session?.user as any) || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const startGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/snippets" },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    classNames(
      "px-3 py-2 rounded-md text-sm",
      isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
    );

  const email = user?.email;
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-neutral-900/60 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* animated cyan dot — same size, just subtle pulse */}
            <div className="relative h-3.5 w-3.5">
              <span className="absolute inset-0 rounded-full bg-cyan-400 shadow-[0_0_24px_2px_rgba(34,211,238,0.45)]" />
              <span className="absolute inset-0 rounded-full bg-cyan-400/35 blur-[2px]" />
              <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
            </div>

            <Link to="/" className="font-semibold tracking-tight text-neutral-100">
              Snippet Companion
            </Link>
            <nav className="ml-2 hidden gap-1 sm:flex">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/snippets" className={linkClass}>
                Snippets
              </NavLink>
            </nav>
          </div>

          <div className="relative flex items-center gap-2">
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={startGoogle}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-1.5 text-sm font-medium text-black shadow-[0_10px_28px_-12px_rgba(34,211,238,.45)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  <span className="h-4 w-4 rounded bg-white p-[2px]">
                    <GoogleIcon className="h-full w-full" />
                  </span>
                  Sign in with Google
                </button>

                <button
                  onClick={() => setEmailOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1.5 text-sm text-neutral-200 shadow-soft hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                >
                  <span className="text-neutral-400">Or</span> use email
                </button>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((s) => !s)}
                  className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-2.5 py-1.5 text-sm text-neutral-200 shadow-soft transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                >
                  <Avatar email={email} src={avatar} />
                  <span className="hidden sm:block max-w-[220px] truncate">{email}</span>
                  <svg
                    className={classNames(
                      "h-4 w-4 transition",
                      menuOpen ? "rotate-180 text-neutral-300" : "text-neutral-500"
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/95 shadow-soft backdrop-blur">
                    <div className="px-3 py-2 text-xs text-neutral-400">Signed in</div>
                    <div className="max-w-full truncate px-3 pb-2 text-sm text-neutral-200">{email}</div>
                    <div className="h-px bg-neutral-800" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        // navigate("/profile") later
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800"
                    >
                      Profile
                    </button>
                    <button
                      onClick={signOut}
                      className="block w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-neutral-800"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={emailOpen} onClose={() => setEmailOpen(false)} />
    </>
  );
}

export default NavBar;
