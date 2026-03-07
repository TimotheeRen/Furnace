"use server"

import { cookies } from "next/headers"

export async function getSftpPort(server: string) {
  const host = process.env.API_HOST || "http://localhost:5678"
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  try {
    const res = await fetch(`${host}/getSftpPort?server=${server}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (!res.ok) console.log(res.status)
    const data = await res.text()
    return data
  } catch (error) {
    console.log(error)
  }
}
