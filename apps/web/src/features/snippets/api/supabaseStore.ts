import { supabase } from "../../../lib/supabase";
import type { Snippet } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function functionsUrl(name: string) {
  if (!SUPABASE_URL) throw new Error("Missing VITE_SUPABASE_URL");
  return SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co") + "/" + name;
}

/* CRUD */
export async function listSnippets(): Promise<Snippet[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("snippets").select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Snippet[];
}

export async function createSnippet(input: { title: string; content: string; tags?: string[]; is_public?: boolean }): Promise<Snippet> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const { data, error } = await supabase
    .from("snippets")
    .insert({ title: input.title, content: input.content, tags: input.tags ?? [], is_public: !!input.is_public, user_id: user.id })
    .select().single();
  if (error) throw error;
  return data as Snippet;
}

export async function updateSnippet(id: string, patch: { title: string; content: string; tags: string[]; is_public: boolean }): Promise<Snippet> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const { data, error } = await supabase
    .from("snippets")
    .update({ title: patch.title, content: patch.content, tags: patch.tags, is_public: patch.is_public })
    .eq("id", id).eq("user_id", user.id)
    .select().single();
  if (error) throw error;
  return data as Snippet;
}

export async function deleteSnippet(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const { error } = await supabase.from("snippets").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
  return { ok: true };
}

/* Explain non-stream */
export async function explainSnippet(content: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? ANON;
  const { data, error } = await supabase.functions.invoke("explain-snippet", {
    body: { content },
    headers: { Authorization: `Bearer ${token}` }
  });
  if (error) throw error as any;
  return (data as any)?.markdown ?? "No explanation.";
}

/* Explain (streaming) */
export async function explainSnippetStream(content: string, onDelta: (chunk: string) => void): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? ANON;
  const url = functionsUrl("explain-snippet") + "?stream=1";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content })
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content ?? "";
        if (delta) onDelta(delta);
      } catch {}
    }
  }
}
