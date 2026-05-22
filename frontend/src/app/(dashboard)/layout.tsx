import GlobalSidebar from '@/components/layout/GlobalSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <GlobalSidebar />
      <div className="md:pl-[236px] pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
