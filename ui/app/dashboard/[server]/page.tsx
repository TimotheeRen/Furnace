import ServerSidebar from "@/components/clients/ServerSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function ServerDashboard({params}: PageProps) {
  const { server } = await params
  return (
    <>
      <h1>{ server }</h1>
      <SidebarProvider defaultOpen={true}>
        <ServerSidebar server={server} />
      </SidebarProvider>
    </>
  )
}
