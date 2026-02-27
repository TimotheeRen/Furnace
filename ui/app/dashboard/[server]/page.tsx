import ServerSidebar from "@/components/clients/ServerSidebar"
import { serverInfo } from "@/components/rsc/serverInfo"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@base-ui/react"
import { Activity, Box, Cpu, Gauge, HistoryIcon, MemoryStick, Power, Users, Zap } from "lucide-react"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function ServerDashboard({params}: PageProps) {
  const { server } = await params
  const result = await serverInfo(server)

  const bgStatusColors: { [key: string]: string } = {
      "Running": "bg-lime-600",
      "Starting": "bg-red-800",
      "Shutdown": "bg-orange-600",
  };

  const textStatusColors: { [key: string]: string } = {
      "Running": "text-lime-600",
      "Starting": "text-red-800",
      "Shutdown": "text-orange-600",
  };

  return (
    <>
      <div className="p-3">
        <Card className="mb-3">
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
              <Button className={`${bgStatusColors[result.serverStatus]} cursor-pointer rounded-sm p-1 px-2`}>
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
                  <h2 className={`font-2xs ${textStatusColors[result.serverStatus]}`}>{ result.serverStatus }</h2>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between gap-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-zinc-600">Latency</CardTitle>
              <CardAction>
                <Zap />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl mb-1">{ result.serverLatency } ms</h1>
              <p className="text-zinc-500 text-sm">Average request latency</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-zinc-600">Players</CardTitle>
              <CardAction>
                <Users />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl mb-1">{ result.serverPlayers}/{ result.serverMaxPlayers }</h1>
              <p className="text-zinc-500 text-sm">Average request latency</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-zinc-600">CPU</CardTitle>
              <CardAction>
                <Cpu />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl mb-1">{ result.serverCPUUsage }%</h1>
              <p className="text-zinc-500 text-sm">Average request latency</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-zinc-600">Latency</CardTitle>
              <CardAction>
                <MemoryStick />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-4xl mb-1">{ result.serverRAMUsage }%</h1>
              <p className="text-zinc-500 text-sm">Average request latency</p>
            </CardContent>
          </Card>
        </div>
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
