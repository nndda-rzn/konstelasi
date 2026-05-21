"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      gap={8}
      toastOptions={{
        className: "konstelasi-toast",
        style: {
          background: "var(--toast-bg)",
          color: "var(--toast-text)",
          border: "1px solid var(--toast-border)",
          borderRadius: "12px",
          boxShadow: "0 4px 24px var(--toast-shadow)",
          fontSize: "14px",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
        classNames: {
          success: "konstelasi-toast-success",
          error: "konstelasi-toast-error",
          info: "konstelasi-toast-info",
          warning: "konstelasi-toast-warning",
        },
      }}
    />
  );
}
