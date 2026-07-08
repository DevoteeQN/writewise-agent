import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Writing practice for focused improvement
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900">
            WriteWise Agent
          </h1>
          <p className="mt-5 text-xl leading-8 text-gray-700">
            Choose a writing prompt, draft an essay, and build a history of
            practice submissions. Phase 2 adds the first original writing
            domain: prompt bank, essay editor, and authenticated essay history.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/prompts"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse Prompts
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Prompt Bank
            </h2>
            <p className="mt-3 text-gray-600">
              Practice with targeted English writing prompts across argument,
              opinion, academic paragraph, problem-solution, and comparison
              tasks.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Essay Editor
            </h2>
            <p className="mt-3 text-gray-600">
              Write against a selected prompt with basic validation and an
              approximate word count before submission.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Private History
            </h2>
            <p className="mt-3 text-gray-600">
              Your submissions are linked to your account, and essay detail
              pages only load for the owner.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
