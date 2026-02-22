"use server"

export async function Login(form: FormData) {
  const username = form.get("username") as string
  const password = form.get("password") as string

  if (!username || !password) return "missing_fields"

  const host = "http://localhost:5678"

  try {
    const res = await fetch(`${host}/login?username=${username}&password=${password}`)
    
    if (!res.ok) return "auth_failed"
    
    const data = await res.text()
    return data 
  } catch (error) {
    return "network_error"
  }
}
