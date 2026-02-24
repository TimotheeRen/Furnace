import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Plus, Server } from "lucide-react";

export default function dashbord() {
  return <>
    <div className="flex min-h-svh">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Server />
          </EmptyMedia>
          <EmptyTitle>
            No server created
          </EmptyTitle>
          <EmptyDescription>
            You haven&#39;t created any server yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <Plus />
            Create a server
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  </>
}
