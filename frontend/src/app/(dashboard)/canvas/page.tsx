import DiaryCanvas from "@/features/canvas/components/DiaryCanvas";
import DiaryListView from "@/features/canvas/components/DiaryListView";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "Canvas | Constella",
};

export default function CanvasPage() {
  return (
    <main className="w-full h-screen overflow-hidden relative bg-[#F7F1EA]">
      {/* warm paper background: subtle dot grid + soft center glow + noise */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(201, 154, 69, 0.06) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(184, 74, 90, 0.04) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(47, 39, 48, 0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="hidden md:block w-full h-full">
        <ErrorBoundary label="DiaryCanvas">
          <DiaryCanvas />
        </ErrorBoundary>
      </div>
      <div className="block md:hidden w-full h-full overflow-y-auto">
        <ErrorBoundary label="DiaryListView">
          <DiaryListView />
        </ErrorBoundary>
      </div>
    </main>
  );
}
