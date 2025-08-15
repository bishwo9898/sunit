"use client";
import { useEffect, useState } from "react";
import GoBackButton from "@/app/components/go-back";

interface Service {
  id: string;
  title: string;
  desc: string;
  price?: string;
  order: number;
  visible?: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (partial: Partial<Service> & { id: string }) => {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    load();
  };

  const add = async () => {
    const title = prompt("Title?");
    if (!title) return;
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    load();
  };

  const reorder = async (from: number, to: number) => {
    const updated = [...services];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setServices(updated);
    await fetch("/api/admin/services/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: updated.map((s) => s.id) }),
    });
  };

  const dragIndex = { current: null as number | null };

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 md:px-10 lg:px-16 py-12">
      <div className="mx-auto max-w-5xl">
        <GoBackButton />
        <header className="mb-10 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-neutral-400 text-sm mt-2 max-w-lg">
              Manage service offerings displayed in the Services section.
              Reorder with drag & drop. Hide to remove from front-end.
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
          {services.map((s, idx) => (
            <li
              key={s.id}
              draggable
              onDragStart={() => (dragIndex.current = idx)}
              onDrop={() => {
                if (dragIndex.current !== null && dragIndex.current !== idx)
                  reorder(dragIndex.current, idx);
                dragIndex.current = null;
              }}
              onDragOver={(e) => e.preventDefault()}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/25 transition flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <input
                  defaultValue={s.title}
                  className="flex-1 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                  onBlur={(e) => save({ id: s.id, title: e.target.value })}
                />
                <input
                  defaultValue={s.price || ""}
                  placeholder="Price range"
                  className="w-40 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                  onBlur={(e) => save({ id: s.id, price: e.target.value })}
                />
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={s.visible !== false}
                    onChange={(e) =>
                      save({ id: s.id, visible: e.target.checked })
                    }
                  />{" "}
                  Visible
                </label>
              </div>
              <textarea
                defaultValue={s.desc}
                className="w-full h-24 bg-neutral-900/70 border border-white/10 rounded-md px-3 py-2 text-sm leading-relaxed focus:outline-none focus:border-white/40"
                onBlur={(e) => save({ id: s.id, desc: e.target.value })}
              />
            </li>
          ))}
        </ul>
        {!loading && !services.length && (
          <div className="text-neutral-500 text-sm">No services yet.</div>
        )}
      </div>
    </main>
  );
}
