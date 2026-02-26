"use server"

import { cookies } from "next/headers"

export async function getServers() {
  const host = process.env.API_HOST || "http://localhost:5678"
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  try {
    const res = await fetch(`${host}/getServers`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    console.log(res)
  } catch (error) {
    return error
  }
}
