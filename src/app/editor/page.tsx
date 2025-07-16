
import { EditorLayout } from "@/components/editor/editor-layout";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function EditorPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <EditorLayout />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
