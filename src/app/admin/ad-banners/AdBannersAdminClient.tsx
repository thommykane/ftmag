"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
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
import { useCallback, useEffect, useState } from "react";
import type { AdBannerDTO } from "@/lib/banners/queries";

function SortableBannerRow({
  banner,
  onDelete,
}: {
  banner: AdBannerDTO;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: banner.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
      }}
      className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/40 p-3 sm:flex-row sm:items-center"
    >
      <button
        type="button"
        className="cursor-grab touch-none self-start text-[#c9a227] active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.imageSrc}
          alt={banner.label || "Banner preview"}
          className="max-h-16 w-auto max-w-[240px] rounded border border-white/10 bg-white/5 object-contain"
        />
        <div className="min-w-0 text-xs text-white/70">
          {banner.label ? <p className="font-medium text-white">{banner.label}</p> : null}
          <a
            href={banner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sky-400/90 underline"
          >
            {banner.href}
          </a>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 text-xs uppercase tracking-wider text-red-300 underline"
      >
        Remove
      </button>
    </div>
  );
}

export function AdBannersAdminClient() {
  const [banners, setBanners] = useState<AdBannerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [href, setHref] = useState("");
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ad-banners", { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch {
      setError("Could not load banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveReorder(next: AdBannerDTO[]) {
    setBanners(next);
    const ids = next.map((b) => b.id);
    const res = await fetch("/api/admin/ad-banners/reorder", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      setError("Reorder failed — refresh and try again.");
      await load();
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void saveReorder(arrayMove(banners, oldIndex, newIndex));
  }

  async function addBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a JPG, PNG, or GIF banner image.");
      return;
    }
    setSaving(true);
    setError(null);
    const fd = new FormData();
    fd.set("href", href);
    fd.set("label", label);
    fd.set("image", file);
    try {
      const res = await fetch("/api/admin/ad-banners", {
        method: "POST",
        credentials: "same-origin",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not add banner.");
        return;
      }
      setHref("");
      setLabel("");
      setFile(null);
      await load();
    } catch {
      setError("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBanner(id: string) {
    if (!window.confirm("Remove this banner from the rotator?")) return;
    const res = await fetch(`/api/admin/ad-banners/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) setError("Could not remove banner.");
    else await load();
  }

  if (loading) {
    return <p className="text-sm text-white/60">Loading…</p>;
  }

  return (
    <div className="space-y-10 text-sm text-white/90">
      {error ? <p className="text-red-300">{error}</p> : null}

      <section className="rounded-xl border border-[#c9a227]/25 bg-black/20 p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">Add banner</h2>
        <form onSubmit={(e) => void addBanner(e)} className="grid gap-3 text-xs">
          <label className="block text-white/70">
            Banner image (JPG, PNG, or GIF)
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,.jpg,.jpeg,.png,.gif"
              className="mt-1 block w-full text-white/80"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="block text-white/70">
            Destination URL
            <input
              required
              type="url"
              placeholder="https://example.com/"
              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
          </label>
          <label className="block text-white/70">
            Label (optional — used for alt text)
            <input
              type="text"
              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-white"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <p className="text-[11px] text-white/45">
            Uploads save to <code className="text-white/60">public/banners/</code> locally (commit to git for
            production). On Vercel, files use Blob storage when configured.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded border border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50"
          >
            {saving ? "Uploading…" : "Add to rotator"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
          Rotator order ({banners.length})
        </h2>
        <p className="mb-3 text-xs text-white/50">Drag to change fade sequence on the public site.</p>
        {banners.length === 0 ? (
          <p className="text-white/50">No banners yet.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {banners.map((banner) => (
                  <SortableBannerRow key={banner.id} banner={banner} onDelete={() => void removeBanner(banner.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
}
