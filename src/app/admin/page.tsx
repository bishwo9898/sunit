import Link from "next/link";

export default function AdminHome() {
  const tiles = [
    {
      href: "/admin/media",
      title: "Media Library",
      desc: "Upload, optimize, categorize & reorder images.",
    },
    {
      href: "/admin/services",
      title: "Services",
      desc: "Manage service offerings displayed on the site.",
    },
    {
      href: "/admin/testimonials",
      title: "Testimonials",
      desc: "Add, edit or hide client testimonials.",
    },
    {
      href: "/admin/heroes",
      title: "Hero Banners",
      desc: "Control hero / banner image rotation.",
    },
  ];
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl">
            Manage visual content & narrative elements. Changes are reflected
            almost instantly.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
