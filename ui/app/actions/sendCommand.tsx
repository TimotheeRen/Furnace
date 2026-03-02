"use server"

import { cookies } from "next/headers"

export async function sendCommand(server: string, form: FormData) {
  const command = form.get("command") as string


  const host = process.env.API_HOST || "http://localhost:5678"

  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  try {
    const res = await fetch(`${host}/command?server=${server}&command=${command}`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      console.log("Sent.")
    }
  } catch (error) {
    console.log(error)
  }
}
