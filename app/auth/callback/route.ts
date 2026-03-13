import { NextResponse } from "next/server";

import { bootstrapProfileForUser } from "@/lib/auth/bootstrap";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Minimal OAuth/email auth callback handler for Supabase App Router flows.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/member";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      await bootstrapProfileForUser(data.user);
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
