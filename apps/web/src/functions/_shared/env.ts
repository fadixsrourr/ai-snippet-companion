export const env = {
OPENAI_API_KEY: Deno.env.get('OPENAI_API_KEY') ?? '',
RATE_LIMIT_WINDOW: Number(Deno.env.get('RATE_LIMIT_WINDOW') ?? '60'),
RATE_LIMIT_MAX: Number(Deno.env.get('RATE_LIMIT_MAX') ?? '20'),
};