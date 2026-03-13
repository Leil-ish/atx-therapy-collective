import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

// Keep the helper tiny for MVP use in server components and actions.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Partial<ResponseCookie>) {
          try {
            cookieStore.set({ ...options, name, value });
          } catch {
            // Server Components may not be able to mutate cookies; route handlers and actions can.
          }
        },
        remove(name: string, options: Partial<ResponseCookie>) {
          try {
            cookieStore.set({ ...options, name, value: "", maxAge: 0 });
          } catch {
            // Safe no-op for read-only contexts.
          }
        }
      }
    }
  );
}
