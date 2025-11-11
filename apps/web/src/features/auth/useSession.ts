import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) setEmail(user?.email ?? null);
      setLoading(false);
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); mounted = false; };
  }, []);

  return { loading, email };
}
