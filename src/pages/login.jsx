import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    setLoading(false);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Login failed. Please try again.");
      return;
    }

    setUser(data);
    setLocation("/");
  }

  return (
    <Layout>
      <div className="max-w-sm mx-auto mt-14">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Log in to post on Campus Board</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Layout>
  );
}