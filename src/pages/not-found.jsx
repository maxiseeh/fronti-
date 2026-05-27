import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center max-w-sm mx-4">
        <h1 className="font-display text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          This page doesn't exist — maybe it was moved or never created.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
        >
          Back to Campus Board
        </Link>
      </div>
    </div>
  );
}