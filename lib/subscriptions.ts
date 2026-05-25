import { createBrowserAwareServerClient, createServiceClient, hasSupabaseServiceEnv } from "./supabase/server";
import type { ProductCode } from "./catalog";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function getCurrentUser() {
  const supabase = await createBrowserAwareServerClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function hasActiveSubscription(userId: string | null | undefined, product: ProductCode) {
  if (!userId || !hasSupabaseServiceEnv) return false;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .eq("product_code", product)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  if (!ACTIVE_STATUSES.has(data.status)) return false;

  return !data.current_period_end || new Date(data.current_period_end) > new Date();
}

export async function getActiveProducts(userId?: string | null) {
  if (!userId || !hasSupabaseServiceEnv) return [] as ProductCode[];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("product_code,status,current_period_end")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_STATUSES]);

  if (error || !data) return [] as ProductCode[];
  return data
    .filter((subscription) => !subscription.current_period_end || new Date(subscription.current_period_end) > new Date())
    .map((subscription) => subscription.product_code as ProductCode);
}
