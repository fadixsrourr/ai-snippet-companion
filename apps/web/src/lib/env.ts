import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  // In early dev, allow missing vars and fail only when we actually use them
  console.warn('VITE_* env vars not set yet (ok for scaffold)');
}

export const ENV = parsed.success ? parsed.data : ({} as z.infer<typeof schema>);
