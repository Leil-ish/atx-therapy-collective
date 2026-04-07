"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeEmailInput(value: string) {
  const normalized = value
    .normalize("NFKC")
    .replace(/^mailto:/i, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[“”‘’"'<>]/g, "")
    .replace(/[‐‑‒–—―]/g, "-")
    .trim()
    .toLowerCase();

  const extractedMatch = normalized.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);

  return extractedMatch ? extractedMatch[0] : normalized;
}

function isPlausibleEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordValue(formData: FormData) {
  return String(formData.get("password") ?? "");
}

function resolveAppOrigin(headerStore: Headers) {
  const explicitAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (explicitAppUrl) {
    return explicitAppUrl.replace(/\/$/, "");
  }

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const forwardedHost = headerStore.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = headerStore.get("host");

  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

export async function signInWithMagicLink(formData: FormData) {
  const email = normalizeEmailInput(String(formData.get("email") ?? ""));

  if (!email) {
    redirect("/login?error=missing-email");
  }

  if (!isPlausibleEmail(email)) {
    redirect("/login?error=invalid-email");
  }

  const headerStore = await headers();
  const origin = resolveAppOrigin(headerStore);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    if ("code" in error && error.code === "email_address_invalid") {
      redirect("/login?error=invalid-email");
    }

    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?sent=1");
}

export async function signInWithPassword(formData: FormData) {
  const email = normalizeEmailInput(String(formData.get("email") ?? ""));
  const password = getPasswordValue(formData);

  if (!email) {
    redirect("/login?error=missing-email&mode=password");
  }

  if (!isPlausibleEmail(email)) {
    redirect("/login?error=invalid-email&mode=password");
  }

  if (!password) {
    redirect("/login?error=missing-password&mode=password");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&mode=password`);
  }

  redirect("/member");
}

export async function updatePassword(formData: FormData) {
  const password = getPasswordValue(formData);
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || !confirmPassword) {
    redirect("/member/profile?passwordError=missing-password");
  }

  if (password !== confirmPassword) {
    redirect("/member/profile?passwordError=password-mismatch");
  }

  if (password.length < 10) {
    redirect("/member/profile?passwordError=password-too-short");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirect(`/member/profile?passwordError=${encodeURIComponent(error.message)}`);
  }

  redirect("/member/profile?passwordSaved=1");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
