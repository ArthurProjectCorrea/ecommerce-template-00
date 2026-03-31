import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getProjectVersion } from '@/lib/version';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const version = getProjectVersion();

  return (
    <SidebarProvider>
      <AppSidebar version={version} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
