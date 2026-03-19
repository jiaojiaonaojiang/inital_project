import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Reach Ads Management
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Create, configure, and manage advertisements for the live
          conversational agent.
        </p>
        <Link
          href="/dashboard/ads"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-800 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
        >
          Go to Dashboard
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
