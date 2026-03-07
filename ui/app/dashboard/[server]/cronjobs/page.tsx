import { getCronjobs } from "@/components/rsc/getCronjobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/ui/code-block"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { CalendarCog, FileKey, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Cronjob {
	minute: string 
	hour: string 
	day: string 
	month: string 
	week: string 
	command: string 
}

interface PageProps
 {
  params: Promise<{ server: string }>
}

export default async function Cronjobs({params}: PageProps) {
  const { server } = await params
  const cronjobs = await getCronjobs(server)
  
  const isEmpty = !cronjobs || cronjobs.length === 0;

  return (
    <div className="flex min-h-svh items-center justify-center">
    {isEmpty && (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarCog />
          </EmptyMedia>
          <EmptyTitle>No cronjob created</EmptyTitle>
          <EmptyDescription>
            You haven&#39;t created any cronjob yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <Plus/>
            Create cronjob
          </Button>
        </EmptyContent>
      </Empty>
    )}
    {!isEmpty && (
      <div>
        <h1>Cronjobs</h1>
        <div className="flex flex-col gap-2 my-3">
          {cronjobs.map((c: Cronjob) => (
            <Link href={`/dashboard/`} key={c.command}>
            <Item variant="outline" className="w-100 hover:bg-zinc-900" >
              <ItemMedia>
                <CalendarCog />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{c.command}</ItemTitle>
                <ItemDescription>{c.minute+" "+c.hour+" "+c.day+" "+c.month+" "+c.week}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Trash2/>
              </ItemActions>
            </Item>
            </Link>
          ))}
        </div>
          <Button variant="outline">
            <Plus/>
            Create cronjob
          </Button>
      </div>
    )}
    </div>
  );
}
