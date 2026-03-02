import { ChevronRight, Send } from "lucide-react";
import { Input } from "../ui/input";
import { sendCommand } from "@/app/actions/sendCommand"

export default function ConsoleInput({ server }: { server: string }) {
  const sendCommandWithServer = sendCommand.bind(null, server)
  return (
    <form action={sendCommandWithServer}>
      <div className="flex items-center gap-2">
        <ChevronRight color="lime"/>
        <Input name="command" placeholder="Enter a command..." className="border-none bg-transparent! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"/>
        <button type="submit">
          <Send color="grey"/>
        </button>
      </div>
    </form>
  )
}
