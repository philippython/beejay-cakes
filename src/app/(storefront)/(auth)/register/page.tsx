"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
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
        Create your account
      </h1>
      <p className="mt-1 text-center text-[13.5px] text-cocoa-soft">
        Save addresses, track orders and get order updates.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
        <label className="flex items-center gap-2.5 rounded-xl border border-cocoa/12 bg-white px-4 py-3.5">
          <User className="h-4 w-4 text-cocoa-faint" />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
          />
        </label>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 8 characters)"
            className="w-full bg-transparent text-[14px] text-cocoa placeholder:text-cocoa-faint focus:outline-none"
          />
        </label>

        {error && <p className="text-[12.5px] font-medium text-rose-deep">{error}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-cocoa-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-honey-deep">
          Log in
        </Link>
      </p>
    </div>
  );
}
