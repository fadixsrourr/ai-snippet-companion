import { supabase } from '@/lib/supabase';

export async function generateSnippet(input: {
  prompt: string;
  language?: string;
  framework?: string;
  context?: string;
}) {
  const { data, error } = await supabase.functions.invoke('ai-generate', {
    body: input,
  });
  if (error) throw error;
  return data as { code: string; notes?: string; model: string; usage?: unknown };
}
