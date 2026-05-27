import { useState } from "react";
import { Link } from "wouter";
import { useListPosts, useGetPostStats, useGetRecentPosts } from "@/lib/api";
import { Layout } from "@/components/layout";
import { PostCard } from "@/components/post-card";
import { useAuth } from "@/context/auth";

const FILTERS = [
  { value: "all",          label: "All Posts" },
  { value: "study_group",  label: "Study Groups" },
  { value: "event",        label: "Events" },
  { value: "lost_found",   label: "Lost & Found" },
  { value: "announcement", label: "Announcements" },
];

const STAT_CONFIG = [
  { key: "total",         label: "Total Posts",   color: "text-green-600",  bg: "bg-green-50"  },
  { key: "studyGroups",   label: "Study Groups",  color: "text-blue-600",   bg: "bg-blue-50"   },
  { key: "events",        label: "Events",        color: "text-orange-500", bg: "bg-orange-50" },
  { key: "lostFound",     label: "Lost & Found",  color: "text-red-500",    bg: "bg-red-50"    },
  { key: "announcements", label: "Announcements", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function Home() {
  const { user } = useAuth();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const params = {};
  if (category !== "all") params.category = category;
  if (search) params.search = search;

  const { data: posts, isLoading } = useListPosts(params);
  const { data: stats } = useGetPostStats();
  const { data: recent } = useGetRecentPosts();

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-white font-bold text-2xl mb-6">
            CB
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Campus Board</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Log in to browse posts, join study groups, report lost items, and connect with your Moringa campus community.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentCategory={category} onCategoryChange={setCategory}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {FILTERS.find(f => f.value === category)?.label ?? "All Posts"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Stay updated with the latest from your campus community.
        </p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {STAT_CONFIG.map(({ key, label, color, bg }) => (
          <div key={key} className={`${bg} rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border border-gray-100`}>
            <p className={`text-2xl font-bold ${color}`}>{stats?.[key] ?? 0}</p>
            <p className="text-xs text-gray-500 text-center leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCategory(f.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    category === f.value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse h-36" />
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
              <p className="font-medium">No posts found</p>
              <p className="text-sm mt-1">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside className="w-full xl:w-64 shrink-0 space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Recent Activity
            </h2>
            <div className="space-y-1">
              {!recent?.length ? (
                <p className="text-sm text-gray-400">No recent posts yet.</p>
              ) : (
                recent.map((post) => (
                  <Link key={post.id} href={`/post/${post.id}`} className="block group">
                    <div className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-green-600 line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">by {post.authorName}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Share something</h3>
            <p className="text-xs text-gray-500 mb-3">
              Post announcements, join study groups, or report lost items.
            </p>
            <Link
              href="/new"
              className="block text-center bg-green-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              Create Post
            </Link>
          </div>
        </aside>
      </div>
    </Layout>
  );
}