"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // /auth/callback already exchanged the code for a session before
    // sending the browser here — confirm one actually exists before
    // letting anyone touch the form. Landing here with no session usually
    // means the reset link was old/already used.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("This reset link is invalid or has expired — request a new one.");
      }
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      // eslint-disable-next-line no-console
      console.log("[reset-password] updateUser result:", { error });
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[reset-password] Supabase returned an error:", error);
        setError(error.message || "Something went wrong — please try again.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/account"), 1800);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[reset-password] threw (network/config problem):", err);
      setError("We couldn't reach the server — please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-tint">
          <CheckCircle2 className="h-6 w-6 text-success" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-medium text-cocoa">Password updated</h1>
        <p className="mt-1.5 text-[13.5px] text-cocoa-soft">Taking you to your account…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <Logo size="lg" showWordmark={false} className="mx-auto" />
      <h1 className="mt-5 text-center font-display text-[24px] font-medium text-cocoa">
        Set a new password
      </h1>

      <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
        <label className="flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-white px-4 py-3.5">
          <Lock className="h-4 w-4 text-cocoa-faint" />
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min. 8 characters)"
            disabled={!ready}
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none disabled:opacity-50"
          />
        </label>
        <label className="flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-white px-4 py-3.5">
          <Lock className="h-4 w-4 text-cocoa-faint" />
          <input
            required
            type="password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            disabled={!ready}
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none disabled:opacity-50"
          />
        </label>

        {error && <p className="text-[12.5px] font-medium text-rose-deep">{error}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={loading || !ready} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </Button>
      </form>
    </div>
  );
}
