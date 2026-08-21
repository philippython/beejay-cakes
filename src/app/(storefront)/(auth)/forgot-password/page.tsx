"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      // eslint-disable-next-line no-console
      console.log("[forgot-password] resetPasswordForEmail result:", { error });
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[forgot-password] Supabase returned an error:", error);
        setError(error.message || "Something went wrong — please try again.");
      } else {
        // Supabase doesn't reveal whether the email exists (anti-enumeration),
        // so this same success state shows either way — that's intentional,
        // not a bug.
        setSent(true);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[forgot-password] threw (network/config problem):", err);
      setError("We couldn't reach the server — please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-tint">
          <MailCheck className="h-6 w-6 text-honey-deep" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">Check your email</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa-soft">
          If an account exists for <span className="font-semibold text-cocoa">{email}</span>, we&apos;ve
          sent a link to reset your password.
        </p>
        <Link href="/login" className="mt-6 text-[13.5px] font-semibold text-honey-deep">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <Logo size="lg" showWordmark={false} className="mx-auto" />
      <h1 className="mt-5 text-center font-display text-[24px] font-medium text-cocoa">
        Reset your password
      </h1>
      <p className="mt-1 text-center text-[13.5px] text-cocoa-soft">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
        <label className="flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-white px-4 py-3.5">
          <Mail className="h-4 w-4 text-cocoa-faint" />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
          />
        </label>

        {error && <p className="text-[12.5px] font-medium text-rose-deep">{error}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-cocoa-soft">
        Remembered it after all?{" "}
        <Link href="/login" className="font-semibold text-honey-deep">
          Log in
        </Link>
      </p>
    </div>
  );
}
