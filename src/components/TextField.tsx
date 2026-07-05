import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-sans text-[13px] font-medium text-sub">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-[10px] border border-line bg-white px-4 py-3.5 font-serif text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
