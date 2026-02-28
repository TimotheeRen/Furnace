import ServerSidebar from "@/components/clients/ServerSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ server: string }>; 
}

export default async function DashboardLayout({
  children,
  params
}: LayoutProps) {
  
  const { server } = await params;

  return (
    <html lang="en">
      <body className="antialiased">
        <SidebarProvider 
          defaultOpen={true}
          style={{
            "--sidebar-width": "200px",
            "--sidebar-width-icon": "64px",
          } as React.CSSProperties}
        >
          <ServerSidebar server={server} />
          <main className="flex-1 overflow-y-auto p-2">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
