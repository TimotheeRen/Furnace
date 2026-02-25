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
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label"; // Un seul import suffit
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Plus, Server, MemoryStick, HardDrive } from "lucide-react";
import { useTransition } from "react";
import { createServer } from "../actions/createServer";
import { toast } from "sonner";

export default function Dashboard() {
  const [isPending, startTransition] = useTransition()

  const handleForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await createServer(formData)
      if (result === 200) {
        toast.info("OK")
      } else if (result === "invalid_fields") {
        toast.error("Invalid fields format")
      }
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Server />
          </EmptyMedia>
          <EmptyTitle>No server created</EmptyTitle>
          <EmptyDescription>
            You haven&#39;t created any server yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create a server
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form action={handleForm}>
                <DialogHeader>
                  <DialogTitle>Add a server</DialogTitle>
                  <DialogDescription>
                    Create a new minecraft server
                  </DialogDescription>
                </DialogHeader>
                  <Field className="mt-5">
                    <Label htmlFor="name">Server name</Label>
                    <InputGroup>
                      <InputGroupInput name="server-name" placeholder="Server name... (lowercase)" required/>
                      <InputGroupAddon>
                        <Server />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                <FieldGroup className="py-4">
                  <div className="flex gap-5">
                    <Field>
                      <Label htmlFor="server">Server Name</Label>
                      <Select name="server-type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Server..."/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vanilla">Vanilla</SelectItem>
                          <SelectItem value="spigot">Spigot</SelectItem>
                          <SelectItem value="forge">Forge</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <Label htmlFor="server">Server Version</Label>
                      <Select name="version" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Version..."/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.21.11">1.21.11</SelectItem>
                          <SelectItem value="1.21.1">1.21.1</SelectItem>
                          <SelectItem value="1.20.1">1.20.1</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="flex gap-5">
                  <Field>
                    <Label htmlFor="min-ram">Required RAM (Gi)</Label>
                    <InputGroup>
                      <InputGroupInput name="min-ram" placeholder="Min RAM..." required/>
                      <InputGroupAddon>
                        <MemoryStick />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <Label htmlFor="min-cpu">Required CPU (m)</Label>
                    <InputGroup>
                      <InputGroupInput name="min-cpu" placeholder="Min CPU..." required/>
                      <InputGroupAddon>
                        <Cpu />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  </div>
                  <div className="flex gap-5">
                  <Field>
                    <Label htmlFor="max-ram">Maximum RAM (Gi)</Label>
                    <InputGroup>
                      <InputGroupInput name="max-ram" placeholder="Max RAM..." required/>
                      <InputGroupAddon>
                        <MemoryStick />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <Label htmlFor="max-cpu">Maximum CPU (m)</Label>
                    <InputGroup>
                      <InputGroupInput name="max-cpu" placeholder="Max CPU..." required/>
                      <InputGroupAddon>
                        <Cpu />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  </div>
                  <Field className="mb-3">
                    <Label htmlFor="storage">Storage (Gi)</Label>
                    <InputGroup>
                      <InputGroupInput name="storage" placeholder="Storage..." required/>
                      <InputGroupAddon>
                        <HardDrive />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
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
        </EmptyContent>
      </Empty>
    </div>
  );
}
