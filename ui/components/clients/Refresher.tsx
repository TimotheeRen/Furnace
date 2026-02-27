"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Refresher({ interval = 3000 }: { interval?: number }) {
  const router = useRouter()
  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh()
    }, interval)
  }, [router, interval])
  return null
}
