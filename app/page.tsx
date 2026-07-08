export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkPostTableExists } from "@/lib/db-utils";

export default async function Home() {
  // Check if the post table exists
  const tableExists = await checkPostTableExists();

  // If the post table doesn't exist, redirect to setup page
  if (!tableExists) {
    redirect("/setup");
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
            AI agent coding competition
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900">
            WriteWise Agent
          </h1>
          <p className="mt-5 text-xl leading-8 text-gray-700">
            A writing practice assistant being built incrementally from the
            Prisma Next.js Auth Starter. Phase 1 keeps the starter auth,
            Prisma, database, and sample-writing flow intact while establishing
            the project identity and documentation trail.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View Writing Samples
            </Link>
            <Link
              href="/posts/new"
              className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Add Sample
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Recent Writing Samples
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.length === 0 ? (
              <p className="text-gray-600">No writing samples available yet.</p>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="group">
                  <div className="h-full rounded-lg border bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="mb-2 text-2xl font-semibold text-gray-900 group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">by {post.author ? post.author.name : "Anonymous"}</p>
                    <p className="mb-4 text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="relative">
                      <p className="line-clamp-2 leading-relaxed text-gray-700">
                        {post.content || "No content available."}
                      </p>
                      <div className="absolute bottom-0 left-0 h-12 w-full bg-linear-to-t from-white to-transparent" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
