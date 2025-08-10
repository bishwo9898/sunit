import Image from "next/image";
import { loadManifest } from "@/utils/manifest.server";
import { FiHeart, FiUsers, FiMusic, FiAward, FiLayers } from "react-icons/fi";

export default async function Services() {
  const manifest = await loadManifest();
  const heroImgs = manifest.filter((m) => m.category === "hero");
  const portraits = manifest.filter((m) => m.category === "portraits");
  const weddings = manifest.filter((m) => m.category === "weddings");
  const recents = manifest.filter((m) => m.category === "recents");

  const findHero6 = heroImgs.find((m) => /hero6\./.test(m.src));

  const services = [
    {
      title: "Weddings",
      desc: "Full-day coverage focused on authentic emotion, elegant composition, and quiet in-between moments.",
      Icon: FiHeart,
      img: weddings[0] || heroImgs[0] || recents[0],
      duration: "8–12 hrs",
      span: "lg:col-span-2",
    },
    {
      title: "Portraits",
      desc: "Editorial & honest sessions for individuals, couples, creatives, and families—film or digital.",
      Icon: FiUsers,
      img: portraits[0] || recents[1] || heroImgs[1],
      duration: "1–2 hrs",
    },
    {
      title: "Concerts",
      desc: "Atmospheric live music coverage—energy, crowd, and intimate artist frames that feel immersive.",
      Icon: FiMusic,
      img: findHero6 || heroImgs[heroImgs.length - 1] || recents[2],
      duration: "Set-based",
    },
    {
      title: "Graduation",
      desc: "Clean, celebratory portraits with cinematic light—individual or group packages available.",
      Icon: FiAward,
      img: portraits[3] || portraits[2] || recents[3],
      duration: "1–3 hrs",
    },
    {
      title: "Other",
      desc: "Custom commissions—branding, editorial, travel, proposals. Tell me your vision and we’ll shape it.",
      Icon: FiLayers,
      img: recents[4] || portraits[5] || heroImgs[2],
      duration: "Custom",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 px-6 md:px-10 lg:px-16"
    >
      {/* Subtle professional backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 35% 20%,rgba(255,255,255,0.08),transparent 55%),radial-gradient(circle at 85% 70%,rgba(255,255,255,0.05),transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.07]"
          style={{
            background:
              "url(data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0 119.5H120V120H0zM119.5 0v120h.5V0z' fill='white' fill-opacity='.35'/%3E%3C/svg%3E) repeat",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black leading-tight">
              Services
            </h2>
            <p className="mt-5 text-neutral-300 text-base md:text-lg leading-relaxed">
              Thoughtful direction, editorial polish, and a grounding presence.
              Each collection can blend digital & film while staying true to
              real color + mood.
            </p>
          </div>
          <a
            href="#book"
            className="self-start md:self-end inline-flex rounded-full px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition shadow"
          >
            Request pricing
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map(({ title, desc, Icon, img, duration }) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm flex flex-col"
            >
              <div className="relative w-full h-72 md:h-80 lg:h-80">
                {img && (
                  <Image
                    src={img.src}
                    alt={title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    placeholder={img.blurDataURL ? "blur" : "empty"}
                    blurDataURL={img.blurDataURL}
                    className="object-cover object-center absolute inset-0 transition duration-700 group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/10" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 38%,rgba(255,255,255,0.24),transparent 62%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm group-hover:bg-white/20 transition-colors shrink-0">
                      <Icon className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        {title}
                      </h3>
                      <p className="mt-2 text-white/85 text-xs md:text-[13px] leading-relaxed max-w-xs">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href="#book"
                      className="text-xs font-medium inline-flex items-center gap-1 text-white/90 hover:text-white transition"
                    >
                      <span className="underline decoration-white/35 underline-offset-4 group-hover:decoration-white">
                        Book this
                      </span>
                      <span className="text-[10px]">→</span>
                    </a>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm text-white/80">
                      {duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
