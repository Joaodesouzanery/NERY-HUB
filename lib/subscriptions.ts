import { createBrowserAwareServerClient, createServiceClient, hasSupabaseServiceEnv } from "./supabase/server";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function getCurrentUser() {
  const supabase = await createBrowserAwareServerClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function hasActiveSubscription(userId?: string | null) {
  if (!userId || !hasSupabaseServiceEnv) return false;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  if (!ACTIVE_STATUSES.has(data.status)) return false;

  return !data.current_period_end || new Date(data.current_period_end) > new Date();
}
