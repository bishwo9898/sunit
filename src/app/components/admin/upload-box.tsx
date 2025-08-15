"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";

type UploadBoxProps = {
  target: "home" | "portraits" | "weddings";
  collections?: string[]; // e.g., ["home"] for home page
  onDone?: (count: number) => void;
  className?: string;
  title?: string;
  allowTargetSwitch?: boolean;
};

export default function UploadBox({
  target: initialTarget,
  collections = [],
  onDone,
  className = "",
  title = "Upload images",
  allowTargetSwitch = false,
}: UploadBoxProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState<"home" | "portraits" | "weddings">(
    initialTarget
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onPick = useCallback(() => inputRef.current?.click(), []);

  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...arr]);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.files;
      if (items && items.length) addFiles(items);
    },
    [addFiles]
  );

  const reset = useCallback(() => {
    setFiles([]);
    setError(null);
    setMessage(null);
  }, []);

  const doUpload = useCallback(
    async (forceDuplicate = false) => {
      if (!files.length || uploading) return;
      setUploading(true);
      setError(null);
      setMessage(null);
      try {
        const fd = new FormData();
        for (const f of files) fd.append("files", f);
        fd.set("target", target);
        if (collections.length) fd.set("collections", collections.join(","));
        if (forceDuplicate) fd.set("allowDuplicate", "1");
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        if (res.status === 409) {
          const data = await res.json();
          const msg =
            data?.message ||
            "Some images already exist in the library. Upload anyway?";
          // Ask for confirmation then retry with allowDuplicate
          const yes = window.confirm(msg);
          if (yes) {
            const res2 = await fetch("/api/admin/upload", {
              method: "POST",
              body: (() => {
                const fd2 = new FormData();
                for (const f of files) fd2.append("files", f);
                fd2.set("target", target);
                if (collections.length)
                  fd2.set("collections", collections.join(","));
                fd2.set("allowDuplicate", "1");
                return fd2;
              })(),
            });
            if (!res2.ok) throw new Error("Upload failed");
            const ok2 = await res2.json();
            setMessage(`Uploaded ${ok2?.count || files.length} file(s).`);
            onDone?.(ok2?.count || files.length);
            setFiles([]);
          } else {
            setError("Upload canceled to avoid duplicates.");
          }
        } else if (!res.ok) {
          throw new Error("Upload failed");
        } else {
          const ok = await res.json();
          setMessage(`Uploaded ${ok?.count || files.length} file(s).`);
          onDone?.(ok?.count || files.length);
          setFiles([]);
        }
      } catch (e: any) {
        setError(e?.message || "Upload error");
      } finally {
        setUploading(false);
      }
    },
    [files, uploading, target, collections, onDone]
  );

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-sm font-medium text-neutral-200">{title}</h3>
        {allowTargetSwitch && (
          <div className="ml-auto inline-flex items-center gap-2 text-xs">
            <label className="text-neutral-400">Target:</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
              className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-2 py-1"
            >
              <option value="portraits">Portraits</option>
              <option value="weddings">Weddings</option>
              <option value="home">Home (collection)</option>
            </select>
          </div>
        )}
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        onClick={onPick}
        className={`rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          dragOver
            ? "border-white bg-white/5"
            : "border-white/20 hover:border-white/40"
        } p-4 md:p-6 text-neutral-300`}
        title="Click, paste, or drop images to upload"
      >
        <p className="text-sm">
          Click to browse, or drag & drop, or paste images here. Multiple files
          are supported.
        </p>
        {files.length > 0 && (
          <p className="mt-2 text-xs text-neutral-400">
            Selected: {files.length} file(s)
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => doUpload(false)}
          disabled={!files.length || uploading}
          className="inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 text-sm font-medium px-3 py-1.5 disabled:opacity-40"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {files.length > 0 && (
          <button
            onClick={reset}
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Clear
          </button>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
        {message && <span className="text-xs text-emerald-400">{message}</span>}
      </div>
    </div>
  );
}
