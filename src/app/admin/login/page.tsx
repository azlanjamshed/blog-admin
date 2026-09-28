"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PenTool, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({ email: email.trim(), password });
      showToast("Welcome back to your studio!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("blogadmin@example.com");
    setPassword("blog@admin");
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Left editorial brand panel (visible on md+) */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-zinc-900 bg-linear-to-b from-zinc-950 via-zinc-900 to-emerald-950 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/50">
            <PenTool className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-serif">
            Paper<span className="text-emerald-400">.</span>
            <small className="ml-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
              Studio
            </small>
          </span>
        </div>

        <div className="max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="h-4 w-4" />
            <span>Author Workspace & Publishing Suite</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-white leading-tight">
            Where your best thoughts take written form.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Manage your articles, categories, cover art, and audience metrics in one unified author
            sanctum designed for unhurried craftsmanship.
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Paper Journal Publishing. Protected editorial gateway.
        </div>
      </div>

      {/* Right login form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="font-bold text-white font-serif">Paper Studio</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
              Author Sign In
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your author credentials to access the editorial studio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="author@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              required
            />

            {error && (
              <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-3 text-xs font-medium text-rose-300">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Enter Studio
            </Button>
          </form>

          {/* Seed demo quick-fill helper */}
          <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-4 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300">Default Admin Credentials:</span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold"
              >
                Auto-fill
              </button>
            </div>
            <p className="font-mono text-[11px] text-zinc-400">
              Email: <code className="text-emerald-400">blogadmin@example.com</code>
            </p>
            <p className="font-mono text-[11px] text-zinc-400">
              Password: <code className="text-emerald-400">blog@admin</code>
            </p>
          </div>

          <div className="text-center">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              ← Back to public reader journal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
