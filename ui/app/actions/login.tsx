"use server"

import { cookies } from "next/headers"

export async function Login(form: FormData) {
  const username = form.get("username") as string
  const password = form.get("password") as string

  if (!username || !password) return "missing_fields"


  const host = process.env.API_HOST || "http://localhost:5678"

  try {
    const res = await fetch(`${host}/login?username=${username}&password=${password}`)
    if (res.status === 200) {
      const token = await res.text()
      const cookieStore = await cookies()
      cookieStore.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 4,
        path: "/",
        sameSite: 'lax',
      })
      
      return res.status
    }return res.status
  } catch (error) {
    return error
  }
}
