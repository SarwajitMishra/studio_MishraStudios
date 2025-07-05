import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MoreVertical, Plus, Zap } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const projects = [
    {
      title: "Summer Vacation Vlog",
      date: "Last edited 2 days ago",
      thumbnail: "https://placehold.co/600x400.png",
      aiHint: "travel vlog"
    },
    {
      title: "Birthday Party Recap",
      date: "Last edited 1 week ago",
      thumbnail: "https://placehold.co/600x400.png",
      aiHint: "birthday party"
    },
    {
      title: "Product Hunt Launch",
      date: "Last edited 3 weeks ago",
      thumbnail: "https://placehold.co/600x400.png",
      aiHint: "product launch"
    },
    {
      title: "Untitled Project",
      date: "Last edited 1 month ago",
      thumbnail: "https://placehold.co/600x400.png",
      aiHint: "abstract art"
    },
  ];

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden shadow-md">
                  <CardHeader className="p-0">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      data-ai-hint={project.aiHint}
                      width={600}
                      height={400}
                      className="aspect-video object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {project.date}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button>Open</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuContent>Delete</DropdownMenuContent>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
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
