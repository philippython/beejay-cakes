"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else window.location.href = "/account";
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cocoa font-display text-[18px] font-semibold text-cream">
        B
      </span>
      <h1 className="mt-5 text-center font-display text-[24px] font-medium text-cocoa">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-[13.5px] text-cocoa-soft">
        Log in to track orders and manage your account.
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
        <label className="flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-white px-4 py-3.5">
          <Lock className="h-4 w-4 text-cocoa-faint" />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
          />
        </label>

        {error && <p className="text-[12.5px] font-medium text-rose-deep">{error}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-cocoa-soft">
        New to Beejay Cakes?{" "}
        <Link href="/register" className="font-semibold text-honey-deep">
          Create an account
        </Link>
      </p>
    </div>
  );
}
