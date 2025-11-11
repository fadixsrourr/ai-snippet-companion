// deno-lint-ignore-file no-explicit-any
import { env } from '../_shared/env.ts';
import type { GenerateBody } from '../_shared/types.ts';


Deno.serve(async (req) => {
if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
const body = (await req.json()) as GenerateBody;
if (!body?.prompt) return new Response('Missing prompt', { status: 400 });


const system = `You are a pragmatic code assistant. Prefer idiomatic, minimal solutions.`;
const user = `${body.prompt}\nLanguage: ${body.language ?? 'auto'}\nFramework: ${body.framework ?? 'none'}\nContext: ${body.context ?? ''}`;


const resp = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
},
body: JSON.stringify({
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: system },
{ role: 'user', content: user }
],
temperature: 0.2,
}),
});


if (!resp.ok) {
const t = await resp.text();
return new Response(`OpenAI error: ${t}`, { status: 500 });
}


const data = await resp.json();
const content = data.choices?.[0]?.message?.content ?? '';


// naive split: try to extract code fence
const match = content.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
const code = match ? match[1] : content;


return Response.json({ code, model: data.model ?? 'unknown' });
});