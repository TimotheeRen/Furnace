import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty";
import { Server } from "lucide-react"
import { CreateServerDialog } from "@/components/clients/CreateServerDialog";
import { getServers } from "@/components/rsc/getServer";

export default async function Dashboard() {
  const empty = true
  const server = await getServers()

  return (
    <div className="flex min-h-svh items-center justify-center">
    {empty && (
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
    {!empty && (
      <h1>SERVERS</h1>
    )}
    </div>
  );
}
