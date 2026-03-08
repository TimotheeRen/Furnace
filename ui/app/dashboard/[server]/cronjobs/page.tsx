import { CreateCronjobDialog } from "@/components/clients/CreateCronjobDialog"
import DeleteCronjobButton from "@/components/clients/DeleteCronjobButton"
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
          <CreateCronjobDialog server={server}/>
        </EmptyContent>
      </Empty>
    )}
    {!isEmpty && (
      <div>
        <h1>Cronjobs</h1>
        <div className="flex flex-col gap-2 my-3">
          {cronjobs.map((c: Cronjob) => (
            <Item variant="outline" className="sm:w-[500px] lg:w-[800px] w-100" key={c.command}>
              <ItemMedia>
                <CalendarCog />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{c.command}</ItemTitle>
                <ItemDescription>{c.minute+" "+c.hour+" "+c.day+" "+c.month+" "+c.week}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <DeleteCronjobButton server={server} command={c.command}/>
              </ItemActions>
            </Item>
          ))}
        </div>
        <CreateCronjobDialog server={server}/>
      </div>
    )}
    </div>
  );
}
