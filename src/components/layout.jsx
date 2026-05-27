import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth";

const NAV_LINKS = [
  { label: "All Posts",     cat: "all" },
  { label: "Events",        cat: "event" },
  { label: "Lost & Found",  cat: "lost_found" },
  { label: "Study Groups",  cat: "study_group" },
  { label: "Announcements", cat: "announcement" },
];

export function Layout({ children, currentCategory = "all", onCategoryChange }) {
  const { user, setUser } = useAuth();
  const [, setLocation] = useLocation();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setLocation("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-14">
        <div className="h-full px-4 flex items-center justify-between">
          <button
            onClick={() => onCategoryChange ? onCategoryChange("all") : setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              CB
            </div>
            <span className="font-bold text-lg text-gray-900">Campus Board</span>
          </button>

          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hi, <span className="font-medium text-gray-800">{user.username || user.name}</span>
                </span>
                <Link
                  href="/new"
                  className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  + New Post
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 3.5rem - 57px)" }}>
        <aside style={{ width: "220px", flexShrink: 0 }} className="border-r border-gray-200 bg-white px-3 py-6 flex flex-col">
          <div className="mb-5 px-2">
            <p className="font-semibold text-sm text-gray-800">Campus Board</p>
            <p className="text-xs text-gray-500">Moringa Student Community</p>
          </div>

          {user ? (
            <>
              <Link
                href="/new"
                className="mb-5 flex items-center justify-center gap-1 bg-green-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                + Create Post
              </Link>

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, cat }) => {
                  const isActive = currentCategory === cat;
                  return (
                    <button
                      key={label}
                      onClick={() => onCategoryChange && onCategoryChange(cat)}
                      className={`flex items-center px-3 py-2 rounded-xl text-sm transition-colors text-left w-full ${
                        isActive
                          ? "bg-green-600 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
            </>
          ) : (
            <div className="px-2 space-y-3">
              <p className="text-xs text-gray-500">Log in to browse and post on Campus Board.</p>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-1">
            <span className="px-3 py-2 text-sm text-gray-400">Guidelines</span>
            <span className="px-3 py-2 text-sm text-gray-400">Support</span>
          </div>
        </aside>

        <main className="flex-1 px-6 py-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <footer className="border-t border-gray-200 py-4 bg-white">
        <div className="px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Campus Board — Moringa School
        </div>
      </footer>
    </div>
  );
}