import ServerSidebar from "@/components/clients/ServerSidebar"
import { serverInfo } from "@/components/rsc/serverInfo"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@base-ui/react"
import { Activity, Box, Gauge, HistoryIcon, Power, Users } from "lucide-react"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function ServerDashboard({params}: PageProps) {
  const { server } = await params
  const result = await serverInfo(server)

  const statusColors: { [key: string]: string } = {
      "Running": "bg-lime-600",
      "Starting": "bg-red-800",
      "Shutdown": "bg-orange-600",
  };

  return (
    <>
      <div className="p-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="border border-yellow-500/30 flex items-center justify-center h-9 w-9 rounded-sm">
                <Box color="orange" className="opacity-50"/>
              </div>
              <div>
                <CardTitle className="pb-1">{server}</CardTitle>
                <CardDescription>{ result.serverAddress }</CardDescription>
              </div>
            </div>
            <CardAction>
              <Button className={`${statusColors[result.serverStatus]} cursor-pointer rounded-sm p-1 px-2`}>
                <div className="flex items-center gap-2">
                  <h1 className="text-black">{ result.serverStatus }</h1>
                  <Power size="15" color="black"/>
                </div>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between w-[90%]">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-sm">
                  <HistoryIcon className="opacity-50"/>
                </div>
                <div>
                  <h1 className="text-zinc-500 text-sm">Version</h1>
                  <h2 className="font-2xs">{ result.serverVersion }</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-sm">
                  <Gauge className="opacity-50"/>
                </div>
                <div>
                  <h1 className="text-zinc-500 text-sm">Latency</h1>
                  <h2 className="font-2xs">{ result.serverLatency } ms</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-sm">
                  <Users className="opacity-50"/>
                </div>
                <div>
                  <h1 className="text-zinc-500 text-sm">Players</h1>
                  <h2 className="font-2xs">{ result.serverPlayers}/{ result.serverMaxPlayers }</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-sm">
                  <Activity className="opacity-50"/>
                </div>
                <div>
                  <h1 className="text-zinc-500 text-sm">Status</h1>
                  <h2 className="font-2xs text-lime-500">{ result.serverStatus }</h2>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <SidebarProvider defaultOpen={false}
      style={{
        "--sidebar-width": "200px",
        "--sidebar-width-icon": "64px",
      } as React.CSSProperties}
      >
        <ServerSidebar server={server} />
        <main className="flex-1 overflow-y-auto p-2">
          <SidebarTrigger />
        </main>
      </SidebarProvider>
    </>
  )
}
