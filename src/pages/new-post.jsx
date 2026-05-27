import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useCreatePost } from "@/lib/api";
import { useAuth } from "@/context/auth";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const CATEGORIES = [
  { value: "announcement", label: "Announcement" },
  { value: "study_group",  label: "Study Group" },
  { value: "event",        label: "Event" },
  { value: "lost_found",   label: "Lost & Found" },
];

export default function NewPost() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const createPost = useCreatePost();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "announcement",
    contactInfo: "",
    location: "",
    eventDate: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a title");

    const data = { ...form };
    if (form.category !== "event") delete data.eventDate;

    createPost.mutate(data, {
      onSuccess: (post) => setLocation(`/post/${post.id}`),
      onError: (err) => setError(err.message || "Failed to create post"),
    });
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-sm mx-auto mt-20 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Login required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You need to be logged in to create a post.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Log in
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto pb-12">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          &larr; Back to board
        </button>

        <h1 className="font-display text-3xl font-bold mb-1">New Post</h1>
        <p className="text-muted-foreground text-sm mb-7">Share something with your campus</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                    form.category === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What is this about?"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Give more details..."
              rows={4}
              className="border border-input bg-background rounded-xl p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Posting as</Label>
            <Input
              value={user.username}
              disabled
              className="rounded-xl bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input
              id="contactInfo"
              type="text"
              name="contactInfo"
              value={form.contactInfo}
              onChange={handleChange}
              placeholder="Email or phone number"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Library, Room 204"
              className="rounded-xl"
            />
          </div>

          {form.category === "event" && (
            <div className="space-y-1.5">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={createPost.isPending}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {createPost.isPending ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </Layout>
  );
}