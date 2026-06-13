"use client";

import { useRef, useState, useEffect, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from "react";

interface PinInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

const PIN_LENGTH = 6;

/**
 * PinInput - 6-digit numeric PIN input.
 * - Auto-advance to next box on digit entry
 * - Backspace moves to previous box
 * - Paste 6 digits fills all boxes at once
 * - Numeric only
 */
export function PinInput({
  id,
  label,
  value,
  onChange,
  error = false,
  autoFocus = false,
  disabled = false,
}: PinInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (autoFocus && refs.current[0]) {
      refs.current[0].focus();
    }
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const next = value.padEnd(PIN_LENGTH, " ").split("");
    next[index] = digit || " ";
    onChange(next.join("").replace(/\s/g, "").slice(0, PIN_LENGTH));
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    const digit = raw.slice(-1);
    setDigit(index, digit);
    if (index < PIN_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      e.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, PIN_LENGTH - 1);
    refs.current[focusIndex]?.focus();
  };

  const borderClass = error
    ? "border-[#E63946]/55 ring-2 ring-[#E63946]/20"
    : "border-white/12 focus-within:border-[#F2B84B]/75 focus-within:ring-2 focus-within:ring-[#F2B84B]/20";

  return (
    <div>
      <label
        htmlFor={`${id}-0`}
        className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8C8088]"
      >
        {label}
      </label>
      <div className="flex gap-[9px]">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const digit = value[i] || "";
          const isFocused = focusedIndex === i;
          return (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${id}-${i}`}
              name={`${id}-${i}`}
              type={digit && !isFocused ? "password" : "text"}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete="one-time-code"
              disabled={disabled}
              value={digit}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              aria-label={`Digit ${i + 1} dari ${PIN_LENGTH}`}
              className={`h-[52px] w-full rounded-[14px] border bg-white/[0.055] text-center text-lg font-medium text-[#F8F4EF] caret-[#F2B84B] outline-none transition-all placeholder:text-[#F8F4EF]/25 ${borderClass}`}
            />
          );
        })}
      </div>
    </div>
  );
}
