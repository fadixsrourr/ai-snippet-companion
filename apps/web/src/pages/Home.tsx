import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative">
      {/* Subtle dotted backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />

      <section className="relative mx-auto max-w-5xl px-4 py-14 sm:py-18">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/70 px-3 py-1 text-xs text-neutral-300 backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Snippet Companion
        </div>

        {/* Hero */}
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            AI Snippet Companion
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-300">
          Write, organize, and <span className="text-neutral-100">explain</span> your code snippets with AI.
          Built with Supabase, React Query, and an edge function for blazing-fast explanations.
        </p>

        {/* CTA / command card */}
        <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-neutral-300">
              Head to <code className="rounded bg-neutral-900 px-1.5 py-0.5 text-neutral-200">/snippets</code>{" "}
              to get started.
            </p>
            <Link
              to="/snippets"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 text-sm font-medium text-black hover:from-sky-400 hover:to-teal-400"
            >
              Open snippets →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Organize fast"
            body="Create, edit, tag, and share snippets. Everything stays tidy and searchable."
          />
          <Feature
            title="Explain with AI"
            body="Use the Explain button to get clear, streaming explanations of tricky code."
          />
          <Feature
            title="Private by default"
            body="Row-level security on Supabase keeps your data scoped to your account."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 hover:border-neutral-700 transition-colors">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-neutral-800">
        <span className="text-neutral-400">★</span>
      </div>
      <h3 className="text-neutral-100">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{body}</p>
    </div>
  );
}
