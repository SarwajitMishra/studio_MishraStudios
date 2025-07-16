import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Film, Plus, Zap } from "lucide-react";

export default function Dashboard() {
  const projects: any[] = []; // No projects by default

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                My Projects
              </h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50">
                <div className="text-center">
                  <Film className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Projects Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click "New Project" to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Project cards would be mapped here */}
              </div>
            )}
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