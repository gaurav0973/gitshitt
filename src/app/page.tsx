import Link from "next/link";

const FEATURES = [
  {
    title: "Type real git commands",
    description:
      "add, commit, branch, checkout, merge, rebase, tag, reset — practice the commands you actually use.",
  },
  {
    title: "Watch the graph update live",
    description:
      "Every command redraws the commit graph instantly, so you can see exactly what just happened to your history.",
  },
  {
    title: "Nothing to lose",
    description:
      "It's a sandbox, not your real repo. Merge wrong, rebase wrong, reset --hard whatever you want — no shit given.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight">gitshitt</span>
        <a
          href="https://github.com/gaurav0973/gitshitt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          GitHub
        </a>
      </header>

      <main className="mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Learn and Practice Git
          <br />
          <span className="text-indigo-400">without losing your shit.</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
          A visual, interactive Git playground. Type commands into a real
          terminal, watch a live commit graph react, and finally understand what
          branching, merging, and rebasing actually do — no repo will be harmed
          in the process.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/git-visualizer"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-base font-semibold transition-colors"
          >
            Start practicing →
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <img
            src="Example.PNG"
            alt="gitshitt terminal and commit graph in action"
            className="w-full"
          />
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3 text-left">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
        Built for people who are tired of googling "how to undo a git merge".
      </footer>
    </div>
  );
}
