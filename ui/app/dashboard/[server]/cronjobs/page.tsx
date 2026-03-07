import { getCronjobs } from "@/components/rsc/getCronjobs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/ui/code-block"
import { Kbd } from "@/components/ui/kbd"
import { FileKey } from "lucide-react"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function Cronjobs({params}: PageProps) {
  const { server } = await params
  const cronjobs = await getCronjobs(server)
  
  return (
    <h1>Cronjobs</h1>
  )
}
