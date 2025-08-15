"use client";
import { useEffect, useState } from "react";
import GoBackButton from "@/app/components/go-back";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  stars?: number;
  visible?: boolean;
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (partial: Partial<Testimonial> & { id: string }) => {
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    load();
  };

  const add = async () => {
    const quote = prompt("Quote?");
    if (!quote) return;
    await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-12">
      <div className="mx-auto max-w-5xl">
        <GoBackButton />
        <header className="mb-10 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-neutral-400 text-sm mt-2 max-w-lg">
              Curate social proof. Add star rating (1-5). Toggle visibility
              instead of deleting to preserve history.
            </p>
          </div>
          <button
            onClick={add}
            className="inline-flex items-center rounded-full bg-white text-neutral-900 text-sm font-medium px-5 py-2 hover:bg-neutral-100 transition"
          >
            Add
          </button>
        </header>
        {loading && (
          <div className="text-neutral-400 text-sm mb-4">Loading…</div>
        )}
        <ul className="flex flex-col gap-4">
          {items.map((t) => (
            <li
              key={t.id}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/25 transition flex flex-col gap-4"
            >
              <textarea
                defaultValue={t.quote}
                className="w-full h-28 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm leading-relaxed focus:outline-none focus:border-white/40"
                onBlur={(e) => save({ id: t.id, quote: e.target.value })}
              />
              <div className="flex items-center gap-4">
                <input
                  defaultValue={t.name}
                  placeholder="Name"
                  className="flex-1 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                  onBlur={(e) => save({ id: t.id, name: e.target.value })}
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={t.stars || 5}
                  className="w-20 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                  onBlur={(e) =>
                    save({ id: t.id, stars: Number(e.target.value) })
                  }
                />
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={t.visible !== false}
                    onChange={(e) =>
                      save({ id: t.id, visible: e.target.checked })
                    }
                  />{" "}
                  Visible
                </label>
              </div>
            </li>
          ))}
        </ul>
        {!loading && !items.length && (
          <div className="text-neutral-500 text-sm">No testimonials yet.</div>
        )}
      </div>
    </main>
  );
}
