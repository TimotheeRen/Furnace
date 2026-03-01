"use client"
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function ConsoleContent({ server }: { server: string }) {
  const [logs, setLogs] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  useEffect(() => {
    const eventSource = new EventSource("/api/console?server="+server)
    eventSource.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    }

    eventSource.onerror = () => {
      console.log("SSE failed.")
      eventSource.close()
    }
  }, [])

  return (
    <ScrollArea className="p-4 h-[90%] absolute w-full">
      <div>
        <p className="text-zinc-400">
          {logs.map((log, i) => <p key={i}>{log}</p>)}
        </p>
      </div>
      <div ref={scrollRef} />
    </ScrollArea>

  )
}
