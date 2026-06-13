"use client";

import Link from "next/link";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { BackgroundOrbs } from "@/features/auth/components/BackgroundOrbs";
import { MarketingPanel } from "@/features/auth/components/MarketingPanel";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, submit } =
    useLogin();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#FFF1E8_0%,transparent_34%),radial-gradient(circle_at_top_right,#F2E8FF_0%,transparent_30%),linear-gradient(135deg,#FFF8F4_0%,#FFE5E8_46%,#F8F1FF_100%)] px-5 py-8 text-[#3F2A35] sm:px-8">
      <BackgroundOrbs />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <MarketingPanel />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={submit}
        />
      </div>
    </main>
  );
}
