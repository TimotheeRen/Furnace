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
  const res = await fetch(`${host}/createServer?server-name=${serverName}&server-type=${serverType}&server-ersion=${serverVersion}&min-ram=${minRam}&min-cpu=${minCpu}&max-ram=${maxRam}&max-cpu=${maxCpu}&storage=${storage}`, {
    method: 'POST',
    credentials: 'include'
  }) 

  return res.status
  } catch (error) {
    return error
  }
}

