import ConsoleContent from "@/components/clients/ConsoleContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Send, Terminal } from "lucide-react";

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
          <div className="flex items-center gap-2">
            <ChevronRight color="lime"/>
            <Input placeholder="Enter a command..." className="border-none bg-transparent! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"/>
            <Send color="grey"/>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
