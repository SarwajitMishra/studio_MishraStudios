import { EditorLayout } from "@/components/editor/editor-layout";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Timeline } from "@/components/editor/timeline";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 grid grid-rows-[1fr_auto] gap-4 p-4 lg:p-6 overflow-hidden">
            <EditorLayout />
            <div className="h-[200px] md:h-[280px] lg:h-[320px]">
              <Timeline />
            </div>
          </main>
        </div>
        <Button
          size="icon"
          className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-accent z-20"
        >
          <Zap className="h-8 w-8 text-primary-foreground fill-current" />
          <span className="sr-only">Generate Clip</span>
        </Button>
      </SidebarInset>
    </SidebarProvider>
  );
}
