import { getSftpPort } from "@/components/rsc/getSftpPort"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/ui/code-block"
import { Kbd } from "@/components/ui/kbd"
import { FileKey } from "lucide-react"

interface PageProps {
  params: Promise<{ server: string }>
}

export default async function Files({params}: PageProps) {
  const { server } = await params
  const sftpAddress = await getSftpPort(server)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileKey size={20}/>
          <CardTitle>Server&#39;s files access</CardTitle>
        </div>
        <CardDescription>Server&#39;s files access procedure with SFTP</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>First, make sure had installed an sftp client. Then you can access the server on <Kbd>{sftpAddress}</Kbd>.</p>
        <CodeBlock language="bash" filename="" code={`sftp [username]@${sftpAddress}`}></CodeBlock>
        <p>You can get your username with the following command:</p>
        <CodeBlock language="bash" filename="" code="kubectl get secret furnace-credentials -o jsonpath='{.data.username}' | base64 --decode "></CodeBlock>
        <p>You can get your password with the following command:</p>
        <CodeBlock language="bash" filename="" code="kubectl get secret furnace-credentials -o jsonpath='{.data.username}' | base64 --decode "></CodeBlock>
      </CardContent>
    </Card>
  )
}
