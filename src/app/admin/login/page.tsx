"use client";
import { useState, Suspense } from "react";
import GoBackButton from "@/app/components/go-back";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/admin";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password, remember }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <div className="absolute left-0 top-0 p-4">
        <GoBackButton />
      </div>
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-6 shadow-xl"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Sign in to manage site content. Default credentials are admin /
          logmein (change via env vars).
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-neutral-400">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md bg-neutral-900 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/20 px-3 py-2 text-sm outline-none"
            placeholder="admin"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-neutral-400">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-neutral-900 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/20 px-3 py-2 text-sm outline-none"
            placeholder="••••••••"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-white"
          />
          Remember device (30 days)
        </label>
        {error && (
          <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <button
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-white text-neutral-900 font-medium text-sm px-6 py-2.5 hover:bg-neutral-100 disabled:opacity-50 transition"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
          Loading…
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
