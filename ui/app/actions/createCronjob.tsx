"use server"

import { cookies } from "next/headers"

export async function createCronjob(server: string, form: FormData) {
  const params = new URLSearchParams({
    server: server,
    command: form.get("command") as string,
    minute: form.get("minute") as string,
    hour: form.get("hour") as string,
    day: form.get("day") as string,
    month: form.get("month") as string,
    week: form.get("week") as string,
  });

  const host = process.env.API_HOST || "http://localhost:5678"

  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  try {
  const res = await fetch(`${host}/createCronjob?${params.toString()}`, {
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
