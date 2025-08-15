import Link from "next/link";
import GoBackButton from "@/app/components/go-back";

export default function MediaHub() {
  const tiles = [
    {
      href: "/admin/media/home",
      title: "Homepage",
      desc: "Home collection as rendered on the site.",
    },
    {
      href: "/admin/media/weddings",
      title: "Weddings",
      desc: "All wedding images exactly like the frontend.",
    },
    {
      href: "/admin/media/portraits",
      title: "Portraits",
      desc: "All portrait images exactly like the frontend.",
    },
    {
      href: "/admin/media/all",
      title: "All Images",
      desc: "Combined view of portraits and weddings.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center gap-4">
          <GoBackButton />
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Media Library
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-xl">
              Pick a section to review the exact gallery the site renders.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition p-6 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold tracking-tight group-hover:text-white text-white/90">
                  {t.title}
                </h2>
                <p className="text-sm mt-2 text-neutral-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <span className="text-xs font-medium inline-flex items-center gap-1 text-white/70 group-hover:gap-2 transition-all">
                Open <span className="text-[10px]">→</span>
              </span>
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/0 via-white/5 to-white/0" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
