import { cookies } from "next/headers"

export async function serverInfo(server: string) {
  const host = process.env.API_HOST || "http://localhost:5678"
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  try {
    const res = await fetch(`${host}/serverInfo?server=${server}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (!res.ok) console.log(res.status)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}
