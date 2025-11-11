import type { Snippet } from "../types";

const KEY = "snippets_v1";

function load(): Snippet[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Snippet[]) : [];
  } catch {
    return [];
  }
}

function save(data: Snippet[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export async function listSnippets(): Promise<Snippet[]> {
  return load().sort((a, b) => b.createdAt - a.createdAt);
}

export async function createSnippet(input: Omit<Snippet, "id" | "createdAt">) {
  const cur = load();
  const next: Snippet = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...input,
  };
  cur.unshift(next);
  save(cur);
  return next;
}

export async function deleteSnippet(id: string) {
  const cur = load().filter(s => s.id !== id);
  save(cur);
  return { ok: true };
}
