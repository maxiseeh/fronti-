import { useRoute, useLocation } from "wouter";
import { format } from "date-fns";
import { useGetPost, useDeletePost } from "@/lib/api";
import { useAuth } from "@/context/auth";
import { Layout } from "@/components/layout";
import { CategoryBadge } from "@/components/CategoryBadge";

export default function PostDetail() {
  const [, params] = useRoute("/post/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const id = params?.id ? parseInt(params.id) : 0;
  const { data: post, isLoading, isError } = useGetPost(id);
  const deletePost = useDeletePost();

  function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    deletePost.mutate(id, {
      onSuccess: () => setLocation("/"),
      onError: (err) => alert(err.message || "Failed to delete. Please try again."),
    });
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-12 animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">Post not found</p>
          <button
            onClick={() => setLocation("/")}
            className="mt-4 text-green-600 text-sm hover:underline"
          >
            &larr; Back to board
          </button>
        </div>
      </Layout>
    );
  }

  const isOwner = user && post && Number(user.id) === Number(post.userId);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-12">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-gray-500 hover:text-gray-800 text-sm transition-colors"
        >
          &larr; Back to board
        </button>

        <div className="mb-3">
          <CategoryBadge category={post.category} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-2 mb-7 text-sm text-gray-500">
          <span>
            Posted by{" "}
            <span className="font-medium text-gray-800">{post.authorName}</span>
          </span>
          {isOwner && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
              your post
            </span>
          )}
          <span>·</span>
          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
        </div>

        {post.description && (
          <p className="text-gray-700 whitespace-pre-wrap mb-8 leading-relaxed text-base">
            {post.description}
          </p>
        )}

        {(post.location || post.eventDate || post.contactInfo) && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2.5 text-sm mb-8">
            {post.eventDate && (
              <p>
                <span className="font-medium">Date: </span>
                {format(new Date(post.eventDate), "MMMM d, yyyy")}
              </p>
            )}
            {post.location && (
              <p>
                <span className="font-medium">Location: </span>
                {post.location}
              </p>
            )}
            {post.contactInfo && (
              <p>
                <span className="font-medium">Contact: </span>
                {post.contactInfo}
              </p>
            )}
          </div>
        )}

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="text-red-500 border border-red-300 px-4 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deletePost.isPending ? "Deleting..." : "Delete this post"}
          </button>
        )}
      </div>
    </Layout>
  );
}