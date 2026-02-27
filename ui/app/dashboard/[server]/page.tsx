import ServerSidebar from "@/components/clients/ServerSidebar"
import { serverInfo } from "@/components/rsc/serverInfo"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function ServerDashboard({params}: PageProps) {
  const { server } = await params
  const result = await serverInfo(server)
  return (
    <>
      <SidebarProvider defaultOpen={false}
      style={{
        "--sidebar-width": "200px",         // Largeur quand elle est ouverte
        "--sidebar-width-icon": "64px",      // Largeur quand elle est réduite (collapsed)
      } as React.CSSProperties}
      >
        <ServerSidebar server={server} />
        <main className="flex-1 overflow-y-auto p-2">
          <SidebarTrigger />
        </main>
      </SidebarProvider>
      <h1>t</h1>
    </>
  )
}
