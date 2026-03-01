"use client"
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function ConsoleContent() {
  const [message, setMessage] = useState<string[]>([])

  const host = process.env.API_HOST || "http://localhost:5678"
  const url = host.split('//')[1]
  const ws = new WebSocket(`ws://${url}/console`)
  ws.onopen = () => console.log("Connected with WS.")
  ws.onmessage = (event) => {
    setMessage(event.data)
  }
  return (
    <ScrollArea className="p-4 h-[90%] absolute w-full">
      <div>
        <p className="text-zinc-400">
          {message}
        </p>
      </div>
    </ScrollArea>

  )
}
