"use server"

import { cookies } from "next/headers"

export async function deleteCronjob(server: string, command: string) {
  const host = process.env.API_HOST || "http://localhost:5678"

  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  try {
  const res = await fetch(`${host}/deleteCronjob?server=${server}&command=${command}`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      console.log("Sent.")
    }
    return res.status
  } catch (error) {
    console.log(error)
  }
}
