"use server"

export async function Login(form: FormData) {
  const username = form.get("username") as string
  const password = form.get("password") as string

  if (!username || !password) return "missing_fields"


  const host = process.env.API_HOST || "http://localhost:5678"

  try {
    const res = await fetch(`${host}/login?username=${username}&password=${password}`)
    return res.status
  } catch (error) {
    return error
  }
}
