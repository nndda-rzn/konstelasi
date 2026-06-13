"use client";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

/**
 * InputField - Branded text input with icon and floating label.
 */
export function InputField({
  id,
  label,
  type,
  icon,
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#5A3E4C]/45"
      >
        {label}
      </label>
      <div className="group flex items-center gap-3 rounded-2xl border border-[#E6B8A2]/35 bg-white/68 px-4 py-3 shadow-inner transition-all hover:bg-white/85 focus-within:border-[#9D0208]/35 focus-within:ring-4 focus-within:ring-[#E6B8A2]/22">
        <span className="text-[#9D0208]/48 transition-colors group-focus-within:text-[#9D0208]">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          required
          className="w-full bg-transparent text-sm text-[#4A2F3C] outline-none placeholder:text-[#5A3E4C]/28"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
