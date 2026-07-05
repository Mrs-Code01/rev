import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "slack";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red/90",
  dark: "bg-ink text-paper hover:bg-ink/90",
  outline: "bg-transparent text-ink border border-line hover:bg-warm-1",
  slack: "bg-slack text-white hover:bg-slack/90",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = true,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 py-4 font-sans text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        VARIANT_CLASSES[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
