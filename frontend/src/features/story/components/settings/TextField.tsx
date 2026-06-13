"use client";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email";
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

/**
 * TextField - Standard text/textarea input with label.
 */
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 3,
  placeholder,
}: TextFieldProps) {
  const className =
    "w-full px-3 py-2 rounded-lg border border-[#FFB8C0]/20 bg-white/50 dark:bg-[#1a1625]/50 text-sm text-[#4A2F3C] dark:text-[#e2d9f3] focus:outline-none focus:border-[#E63946]/50";

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-[#5A3E4C]/40 font-semibold mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${className} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
