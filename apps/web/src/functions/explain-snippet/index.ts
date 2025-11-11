// supabase/functions/explain-snippet/index.ts
// Streaming (SSE) with Groq + fallbacks, CORS-safe

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS_JSON: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const CORS_SSE: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
};

type Payload = { content?: string };

const PROVIDER = (Deno.env.get("PROVIDER") ?? "groq").toLowerCase();
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const USE_MOCK_EXPLAIN = Deno.env.get("USE_MOCK_EXPLAIN") === "1";

function mock(content: string) {
  return `**Mock explanation:**\n\n\`\`\`\n${content.slice(0, 400)}\n\`\`\`\nThis code likely prints, computes, or transforms data.`;
}

async function groqNonStream(content: string) {
  if (!GROQ_API_KEY) return mock(content);
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a concise, helpful code explainer." },
        { role: "user", content: `Explain clearly and briefly:\n\n${content}` },
      ],
    }),
  });
  if (!resp.ok) return mock(content);
  const data = await resp.json().catch(() => ({}));
  return data?.choices?.[0]?.message?.content ?? mock(content);
}

async function groqStream(content: string): Promise<Response> {
  if (!GROQ_API_KEY) {
    // stream a mock result
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ choices:[{ delta:{ content: mock(content) } }] })}\n\n`));
        c.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
        c.close();
      },
    });
    return new Response(stream, { headers: CORS_SSE, status: 200 });
  }

  // Upstream SSE
  const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      stream: true,
      messages: [
        { role: "system", content: "You are a concise, helpful code explainer." },
        { role: "user", content: `Explain clearly and briefly:\n\n${content}` },
      ],
    }),
  });

  if (!upstream.body || !upstream.ok) {
    // fallback to non-stream
    const text = await groqNonStream(content);
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ choices:[{ delta:{ content: text } }] })}\n\n`));
        c.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
        c.close();
      },
    });
    return new Response(stream, { headers: CORS_SSE, status: 200 });
  }

  // Proxy upstream SSE as-is
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const encoder = new TextEncoder();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch (_) {
        // swallow
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: CORS_SSE, status: 200 });
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_JSON });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS_JSON });
    }

    const url = new URL(req.url);
    const doStream = url.searchParams.get("stream") === "1";

    const body = (await req.json()) as Payload;
    const content = (body?.content ?? "").toString();
    if (!content.trim()) {
      return new Response(JSON.stringify({ error: "Missing content" }), { status: 400, headers: CORS_JSON });
    }

    if (USE_MOCK_EXPLAIN) {
      if (doStream) return groqStream(content); // streams mock
      return new Response(JSON.stringify({ markdown: mock(content) }), { status: 200, headers: CORS_JSON });
    }

    if (doStream) return groqStream(content);

    // non-stream response
    const markdown = await groqNonStream(content);
    return new Response(JSON.stringify({ markdown }), { status: 200, headers: CORS_JSON });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: CORS_JSON });
  }
});
