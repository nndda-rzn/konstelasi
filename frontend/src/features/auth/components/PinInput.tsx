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
    ? "border-[#E63946]/55 ring-4 ring-[#E63946]/15"
    : "border-[#E6B8A2]/35 focus-within:border-[#9D0208]/45 focus-within:ring-4 focus-within:ring-[#E6B8A2]/25";

  return (
    <div>
      <label
        htmlFor={`${id}-0`}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#5A3E4C]/45"
      >
        {label}
      </label>
      <div className="flex gap-2 sm:gap-2.5">
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
              className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border bg-white/75 text-center text-lg sm:text-xl font-bold text-[#4A2F3C] caret-[#9D0208] shadow-inner outline-none transition-all placeholder:text-[#5A3E4C]/30 hover:bg-white/90 sm:rounded-2xl ${borderClass}`}
            />
          );
        })}
      </div>
    </div>
  );
}
