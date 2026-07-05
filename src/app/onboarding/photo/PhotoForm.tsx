"use client";

import { useActionState, useRef, useState } from "react";
import { uploadAvatar, skipAvatar, type AvatarFormState } from "@/app/actions/onboarding";
import { Button } from "@/components/Button";

const initialState: AvatarFormState = {};

export function PhotoForm({
  redirectTo = "/home",
  showSkip = true,
  currentAvatarUrl = null,
}: {
  redirectTo?: string;
  showSkip?: boolean;
  currentAvatarUrl?: string | null;
}) {
  const [state, formAction, pending] = useActionState(uploadAvatar, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [hasFile, setHasFile] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function showPreview(file: File | undefined) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setHasFile(true);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      showPreview(file);
    }
  }

  const dragHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: handleDrop,
  };

  return (
    <div className="flex flex-col items-center gap-5 lg:items-start">
      <form action={formAction} className="flex w-full flex-col items-center gap-5 lg:items-start">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => showPreview(e.target.files?.[0])}
        />

        <div
          {...dragHandlers}
          className={`stripe-placeholder relative mx-auto flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full border-2 border-dashed lg:h-[180px] lg:w-[180px] ${
            dragOver ? "border-red" : "border-line"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your photo" className="h-full w-full object-cover" />
          ) : (
            <span className="mono-label font-mono text-[11px] text-faint">your photo</span>
          )}
          <span className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red shadow-phone">
            +
          </span>
        </div>

        {/* Desktop-only drop zone (D3); the circle above already handles drop on mobile */}
        <div
          {...dragHandlers}
          className="hidden w-full max-w-xs rounded-xl border border-dashed border-line bg-warm-2 px-4 py-6 text-center lg:block"
        >
          <p className="font-sans text-sm text-sub">Drag an image here</p>
          <p className="mono-label mt-1 font-mono text-[11px] text-faint">PNG or JPG · up to 5MB</p>
        </div>

        {state?.error && <p className="font-sans text-sm text-red">{state.error}</p>}

        <div className="flex w-full max-w-xs flex-col gap-3">
          {!hasFile ? (
            <Button type="button" variant="dark" onClick={() => fileInputRef.current?.click()}>
              <span className="lg:hidden">{currentAvatarUrl ? "Choose new photo" : "Upload from device"}</span>
              <span className="hidden lg:inline">Browse files</span>
            </Button>
          ) : (
            <Button type="submit" variant="dark" disabled={pending}>
              {pending ? "Uploading…" : "Save photo"}
            </Button>
          )}
        </div>
      </form>

      {showSkip && (
        <form action={skipAvatar}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="font-sans text-sm font-medium text-sub underline-offset-2 hover:underline">
            Skip for now
          </button>
        </form>
      )}
    </div>
  );
}
