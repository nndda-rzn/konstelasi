import DiaryCanvas from "@/features/canvas/components/DiaryCanvas";
import DiaryListView from "@/features/canvas/components/DiaryListView";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "Canvas | Visual Diary",
};

export default function CanvasPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-50 relative">
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
