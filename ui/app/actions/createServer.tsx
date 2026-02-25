export async function createServer(form: FormData) {
  const serverName = form.get("server-name") as string
  const serverType = form.get("server-type") as string
  const serverVersion = form.get("version") as string
  const minRam = form.get("min-ram") as string
  const minCpu = form.get("min-cpu") as string
  const maxRam = form.get("max-ram") as string
  const maxCpu = form.get("max-cpu") as string
  const storage = form.get("storage") as string
  
  if (!serverName || !serverType || !serverVersion || !minRam || !minCpu || !maxRam || !maxCpu || !storage) return "missing_fields"

  const host = process.env.API_HOST || "http://localhost:5678"

  try {
    const res = await fetch(`${host}/createServer?serverName=${serverName}&serverType=${serverType}&serverVersion=${serverVersion}&minRam=${minRam}&minCpu=${minCpu}&maxRam=${maxRam}&maxCpu=${maxCpu}&storage=${storage}`)
    return res.status
  } catch (error) {
    return error
  }
}

