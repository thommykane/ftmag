"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";
import type { RestaurantDTO } from "@/lib/restaurantPublic";

type HighlightRow = {
  id: string;
  stateSlug: string;
  position: number;
  restaurantId: string;
  restaurant: RestaurantDTO;
};

function SortableRankRow({
  r,
  onEdit,
}: {
  r: RestaurantDTO;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: r.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-[#c9a227] active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <span className="w-8 text-center font-semibold text-[#c9a227]">{r.nationalRank ?? "—"}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-white">{r.name}</span>
      <span className="hidden text-xs text-white/50 sm:inline">{r.stateSlug}</span>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-xs uppercase tracking-wider text-[#e8d48b] underline"
      >
        Edit
      </button>
    </div>
  );
}

const emptyForm = {
  name: "",
  address: "",
  email: "",
  phone: "",
  website: "",
  openTableUrl: "",
  cuisine: "",
  ownerChef: "",
  awards: "—",
  thumbnailUrl: "",
  stateSlug: "",
  country: "United States",
  nationalRank: "" as string | number,
};

export function RestaurantsAdminClient() {
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [highlights, setHighlights] = useState<HighlightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [highlightState, setHighlightState] = useState("california");
  const [slots, setSlots] = useState<(string | "")[]>(() => Array(8).fill(""));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ranked = useMemo(
    () => restaurants.filter((r) => r.nationalRank != null).sort((a, b) => (a.nationalRank ?? 0) - (b.nationalRank ?? 0)),
    [restaurants],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/restaurants", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRestaurants(data.restaurants ?? []);
      setHighlights(data.highlights ?? []);
    } catch {
      setError("Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const next = Array(8).fill("") as (string | "")[];
    highlights
      .filter((h) => h.stateSlug === highlightState)
      .forEach((h) => {
        if (h.position >= 1 && h.position <= 8) next[h.position - 1] = h.restaurantId;
      });
    setSlots(next);
  }, [highlights, highlightState]);

  async function saveReorder(newOrder: RestaurantDTO[]) {
    const ids = newOrder.map((r) => r.id);
    const res = await fetch("/api/admin/restaurants/reorder", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      setError("Reorder failed");
      return;
    }
    await load();
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ranked.findIndex((r) => r.id === active.id);
    const newIndex = ranked.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(ranked, oldIndex, newIndex);
    void saveReorder(next);
  }

  function openNew() {
    setEditingId("new");
    setForm({ ...emptyForm });
  }

  function openEdit(r: RestaurantDTO) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      address: r.address,
      email: r.email,
      phone: r.phone,
      website: r.website,
      openTableUrl: r.openTableUrl,
      cuisine: r.cuisine,
      ownerChef: r.ownerChef,
      awards: r.awards,
      thumbnailUrl: r.thumbnailUrl,
      stateSlug: r.stateSlug,
      country: r.country || "United States",
      nationalRank: r.nationalRank ?? "",
    });
  }

  async function saveRestaurant() {
    const payload = {
      name: form.name.trim(),
      address: form.address,
      email: form.email,
      phone: form.phone,
      website: form.website,
      openTableUrl: form.openTableUrl,
      cuisine: form.cuisine,
      ownerChef: form.ownerChef,
      awards: form.awards,
      thumbnailUrl: form.thumbnailUrl,
      stateSlug: form.stateSlug,
      country: form.country,
      nationalRank:
        form.nationalRank === "" ? null : Math.max(1, Math.min(1000, Number(form.nationalRank))),
    };

    if (editingId === "new") {
      const res = await fetch("/api/admin/restaurants", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) setError("Create failed");
      else {
        setEditingId(null);
        await load();
      }
      return;
    }

    if (!editingId) return;
    const res = await fetch(`/api/admin/restaurants/${editingId}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) setError("Save failed");
    else {
      setEditingId(null);
      await load();
    }
  }

  async function saveHighlights() {
    const body = {
      stateSlug: highlightState,
      slots: slots.map((restaurantId, i) => ({
        position: i + 1,
        restaurantId: restaurantId || null,
      })),
    };
    const res = await fetch("/api/admin/restaurants/highlights", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) setError("Could not save state picks");
    else await load();
  }

  if (loading) {
    return <p className="text-sm text-white/60">Loading…</p>;
  }

  return (
    <div className="space-y-10 text-sm text-white/90">
      {error ? <p className="text-red-300">{error}</p> : null}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
            National ranking ({ranked.length})
          </h2>
          <button
            type="button"
            onClick={openNew}
            className="rounded border border-[#c9a227]/50 px-3 py-1.5 text-xs uppercase tracking-wider text-[#e8d48b]"
          >
            Add restaurant
          </button>
        </div>
        <p className="mb-3 text-xs text-white/50">Drag rows to change national order (1 = highest).</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ranked.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {ranked.map((r) => (
                <SortableRankRow key={r.id} r={r} onEdit={() => openEdit(r)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
          State pages — Eat (8 picks)
        </h2>
        <label className="mb-3 block text-xs text-white/60">
          State
          <select
            value={highlightState}
            onChange={(e) => setHighlightState(e.target.value)}
            className="mt-1 block w-full max-w-md rounded border border-white/15 bg-black/50 px-3 py-2 text-white"
          >
            {US_STATES_ALPHABETICAL.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((val, i) => (
            <label key={i} className="block text-xs text-white/60">
              Slot {i + 1}
              <select
                value={val}
                onChange={(e) => {
                  const next = [...slots];
                  next[i] = e.target.value;
                  setSlots(next);
                }}
                className="mt-1 block w-full rounded border border-white/15 bg-black/50 px-2 py-1.5 text-white"
              >
                <option value="">—</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void saveHighlights()}
          className="mt-4 rounded border border-[#c9a227]/50 px-4 py-2 text-xs uppercase tracking-wider text-[#e8d48b]"
        >
          Save state picks
        </button>
      </section>

      {editingId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#c9a227]/30 bg-[#1a1014] p-6 shadow-xl">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              {editingId === "new" ? "New restaurant" : "Edit restaurant"}
            </h3>
            <div className="grid gap-3 text-xs">
              {(
                [
                  ["name", "Name"],
                  ["address", "Address"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["website", "Website"],
                  ["openTableUrl", "OpenTable URL"],
                  ["cuisine", "Cuisine"],
                  ["ownerChef", "Owner / chef"],
                  ["awards", "Awards"],
                  ["thumbnailUrl", "Thumbnail URL"],
                  ["stateSlug", "State slug (kebab-case)"],
                  ["country", "Country"],
                  ["nationalRank", "National rank (1–1000, blank = unranked)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-white/70">
                  {label}
                  <input
                    className="mt-1 w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
                    value={String(form[key as keyof typeof form] ?? "")}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => void saveRestaurant()}
                className="rounded border border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="text-xs text-white/60 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
