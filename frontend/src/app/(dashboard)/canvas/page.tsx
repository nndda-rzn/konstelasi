import DiaryCanvas from '@/components/canvas/DiaryCanvas';
import DiaryListView from '@/components/canvas/DiaryListView';

export const metadata = {
  title: 'Canvas | Visual Diary',
};

export default function CanvasPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-50 relative">
      <div className="hidden md:block w-full h-full">
         <DiaryCanvas />
      </div>
      <div className="block md:hidden w-full h-full overflow-y-auto">
         <DiaryListView />
      </div>
    </main>
  );
}
