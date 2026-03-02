import ConsoleContent from "@/components/clients/ConsoleContent";
import ConsoleInput from "@/components/clients/ConsoleInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function ServerDashboard({params}: PageProps) {
  const { server } = await params
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="w-[90%] h-[80%] p-10">
        <CardHeader>
          <div className="left-0 flex items-center gap-2">
            <Terminal color="lime"/>
            <CardTitle>Server Console</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-4 bg-zinc-950 rounded-md border">
          <ConsoleContent server={server}/>
          <ConsoleInput server={server}/>
        </CardContent>
      </Card>
    </div>
  )
}
