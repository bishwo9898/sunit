"use client";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Image from "next/image";

const SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_c00qc38";
const TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_9wywbu6";
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "3NscLatFm5Wsdzb6m";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      setStatus("sent");
      formRef.current.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.text || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col">
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.shutterunit.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Contact",
                item: "https://www.shutterunit.com/contact",
              },
            ],
          }),
        }}
      />
      {/* Hero / Intro */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at 30% 35%,#000 0%,transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(45deg,rgba(0,0,0,0.045)_0_14px,transparent_14px_28px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-28 md:py-40 flex flex-col gap-10">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-xs tracking-[0.28em] uppercase text-neutral-400 font-medium">
              Get In Touch
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Let’s build something timeless.
            </h1>
            <p className="mt-6 text-neutral-500 text-base md:text-lg leading-relaxed max-w-xl">
              Share a bit about your day, session vision, or project scope. I
              personally reply to every inquiry—usually within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-3 group">
                <span className="h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
                  TX
                </span>
                <span className="group-hover:text-neutral-800 transition-colors">
                  Based in Midland, TX • Available Worldwide
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
                  24h
                </span>
                <span className="group-hover:text-neutral-800 transition-colors">
                  Average response time
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image + Enhanced Form */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12 lg:px-20 grid lg:grid-cols-12 gap-14 md:gap-16">
          {/* Feature Image / Inspiration */}
          <div
            className="relative lg:col-span-5 rounded-3xl overflow-hidden group order-last lg:order-first min-h-[360px] md:min-h-[420px]"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            <Image
              src="/optimized/portraits/golden-1.jpg"
              alt="Featured work"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-[6000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 p-7 flex flex-col gap-3">
              <h3 className="text-white font-display text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                Your story deserves intentional imagery.
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-md leading-relaxed">
                I approach every commission with editorial restraint, empathy
                and an eye for quiet transition moments.
              </p>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(circle_at_30%_35%,white,transparent_65%)]" />
          </div>
          {/* Form */}
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="50">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Inquiry Form
              </h2>
              <p className="mt-3 text-neutral-500 text-sm md:text-base max-w-lg">
                Provide as much detail as you’d like—date, location, style
                references, timeline, creative goals.
              </p>
            </div>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="space-y-7 relative"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Name
                  </label>
                  <input
                    name="user_name"
                    required
                    placeholder="Your full name"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    placeholder="you@example.com"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(555) 123‑4567"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Date (if set)
                  </label>
                  <input
                    type="text"
                    name="event_date"
                    placeholder="MM / DD / YYYY"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, Venue, or Region"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                    Service Type
                  </label>
                  <select
                    name="service_type"
                    className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Portraits">Portraits</option>
                    <option value="Brand / Editorial">Brand / Editorial</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Concert / Event">Concert / Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about your story, vision, timeline, vibe, priorities..."
                  className="rounded-md bg-neutral-50 border border-neutral-200 focus:border-neutral-400 focus:ring-0 px-4 py-3 text-sm resize-none"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-black/10 ring-1 ring-black/5 transition hover:shadow-lg hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-neutral-300 disabled:opacity-60"
                >
                  <span className="tracking-tight">
                    {status === "sending"
                      ? "Sending..."
                      : status === "sent"
                      ? "Sent ✓"
                      : "Send Inquiry"}
                  </span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]" />
                </button>
                {status === "error" && (
                  <span className="text-xs text-red-500 font-medium">
                    {errorMsg}
                  </span>
                )}
                {status === "sent" && (
                  <span className="text-xs text-emerald-600 font-medium">
                    Thanks! I received your message.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
