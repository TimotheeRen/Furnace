import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty";
import { Box, Dot, Power, Server } from "lucide-react"
import { CreateServerDialog } from "@/components/clients/CreateServerDialog";
import { getServers } from "@/components/rsc/getServer";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

interface ServerStat {
  serverName: string
  serverType: string
  serverStatus: string
}

const statusColors: { [key: string]: string } = {
    "Running": "#22c55e",
    "Starting": "#eab308",
    "Shutdown": "#ef4444",
};

export default async function Dashboard() {
  const servers = await getServers()
  const isEmpty = !servers || servers.length === 0;

  return (
    <div className="flex min-h-svh items-center justify-center">
    {isEmpty && (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Server />
          </EmptyMedia>
          <EmptyTitle>No server created</EmptyTitle>
          <EmptyDescription>
            You haven&#39;t created any server yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateServerDialog/>
        </EmptyContent>
      </Empty>
    )}
    {!isEmpty && (
      <div>
        <h1>SERVERS</h1>
        <div className="flex flex-col gap-2 my-3">
          {servers.map((s: ServerStat) => (
            <Item variant="outline" className="w-100" key={s.serverName}>
              <ItemMedia>
                <Box/>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{s.serverName}</ItemTitle>
                <ItemDescription>{s.serverType}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Dot size="20" color={statusColors[s.serverStatus]} />
              </ItemActions>
            </Item>
          ))}
        </div>
        <CreateServerDialog/>
      </div>
    )}
    </div>
  );
}
