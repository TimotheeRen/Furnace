import z from "zod"

const CreateServerSchema = z.object({
  serverName: z.string().min(3).lowercase().trim().regex(/^[a-z0-9-]+$/),
  serverType: z.string(),
  serverVersion: z.string(),
  minRam: z.coerce.number().positive(),
  minCpu: z.coerce.number().positive(),
  maxRam: z.coerce.number().positive(),
  maxCpu: z.coerce.number().positive(),
  storage: z.coerce.number().positive(),
});

export async function createServer(form: FormData) {
const rawFields = {
    serverName: form.get("server-name"),
    serverType: form.get("server-type"),
    serverVersion: form.get("version"),
    minRam: form.get("min-ram"),
    minCpu: form.get("min-cpu"),
    maxRam: form.get("max-ram"),
    maxCpu: form.get("max-cpu"),
    storage: form.get("storage"),
  };

  const result = CreateServerSchema.safeParse(rawFields);

  if (!result.success) return "invalid_fields";

  const data = result.data;
  const host = process.env.API_HOST || "http://localhost:5678"

try {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  const res = await fetch(`${host}/createServer?${params}`, {
    method: 'POST',
    credentials: 'include'
  }) 

  return res.status
  } catch (error) {
    return error
  }
}

