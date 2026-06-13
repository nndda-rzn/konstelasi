"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { MarketingPanel } from "@/features/auth/components/MarketingPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthBackground } from "@/features/auth/components/scene/AuthBackground";

export default function LoginPage() {
  const { email, setEmail, pin, setPin, error, loading, submit } = useLogin();

  return (
    <main className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-[#070812] px-5 py-6 text-white sm:px-8">
      {/* z-0: 3D night sky */}
      <AuthBackground />

      {/* z-10: soft radial glow + vignette overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(242,184,75,0.06) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 60%)",
        }}
      />

      {/* z-20: content */}
      <div className="relative z-20 mx-auto grid w-full max-w-[1200px] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-24">
        <MarketingPanel />
        <LoginForm
          email={email}
          setEmail={setEmail}
          pin={pin}
          setPin={setPin}
          error={error}
          loading={loading}
          onSubmit={submit}
        />
      </div>
    </main>
  );
}
