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
      <SidebarProvider defaultOpen={true}>
        <ServerSidebar server={server} />
      </SidebarProvider>
    </>
  )
}
