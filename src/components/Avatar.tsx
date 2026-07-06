import Image from "next/image";
import { unitInitials } from "@/lib/units";

interface AvatarProps {
  avatarUrl?: string | null;
  name: string;
  size?: number;
  editBadge?: "edit" | "add" | null;
}

export function Avatar({ avatarUrl, name, size = 96, editBadge = null }: AvatarProps) {
  const initials = unitInitials(name);
  const badgeSize = Math.max(22, Math.round(size * 0.26));

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className="avatar-grad flex items-center justify-center overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={size}
            height={size}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="font-display font-semibold text-paper"
            style={{ fontSize: size * 0.34 }}
          >
            {initials}
          </span>
        )}
      </div>
      {editBadge && (
        <span
          className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border-2 border-paper bg-ink text-paper"
          style={{ width: badgeSize, height: badgeSize, fontSize: badgeSize * 0.55 }}
        >
          {editBadge === "add" ? (
            <span className="text-red">＋</span>
          ) : (
            "✎"
          )}
        </span>
      )}
    </div>
  );
}
