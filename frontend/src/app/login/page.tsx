"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { BackgroundOrbs } from "@/features/auth/components/BackgroundOrbs";
import { MarketingPanel } from "@/features/auth/components/MarketingPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthBackground } from "@/features/auth/components/scene/AuthBackground";

export default function LoginPage() {
  const { email, setEmail, pin, setPin, error, loading, submit } = useLogin();

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 text-white sm:px-8">
      <AuthBackground />
      <BackgroundOrbs />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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
