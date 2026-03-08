"use client"

import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Plus, Server, MemoryStick, HardDrive, CalendarCog, SquareChevronRight } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getServers } from "@/components/rsc/getServer";
import { createServer } from "@/app/actions/createServer";
import { createCronjob } from "@/app/actions/createCronjob";

export function CreateCronjobDialog({ server }: { server: string}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCronjob(server, formData)
      if (result === 200) {
        toast.info("Cronjob created.")
        setOpen(false)
        router.refresh()
      } else if (result === 400) {
        toast.error("Invalid fields format")
      }
    })
  }
  return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Create cronjob
      </Button>
    </DialogTrigger>
    <DialogContent>
      <form action={handleForm}>
        <DialogHeader>
          <DialogTitle>Add a cronjob</DialogTitle>
          <DialogDescription>
            Create a new cronjob
          </DialogDescription>
        </DialogHeader>
          <Field className="mt-5">
            <Label htmlFor="name">Cronjob command</Label>
            <InputGroup>
              <InputGroupInput name="command" placeholder="Cronjob name..." required/>
              <InputGroupAddon>
                <SquareChevronRight />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        <FieldGroup className="py-4">
          <div className="flex gap-5">
          <Field>
            <Label htmlFor="minute">Minute</Label>
            <Input name="minute" placeholder="*" required/>
          </Field>
          <Field>
            <Label htmlFor="hour">Hour</Label>
            <Input name="hour" placeholder="*" required/>
          </Field>
          <Field>
            <Label htmlFor="day">Day</Label>
            <Input name="day" placeholder="*" required/>
          </Field>
          <Field>
            <Label htmlFor="month">Month</Label>
            <Input name="month" placeholder="*" required/>
          </Field>
          <Field>
            <Label htmlFor="week">Week</Label>
            <Input name="week" placeholder="*" required/>
          </Field>
          </div>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit">Confirm</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  )
}
