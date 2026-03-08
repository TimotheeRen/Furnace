"use client"

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCronjob } from "@/app/actions/deleteCronjob";

export default function DeleteCronjobButton({ command, server }: { command: string, server:string }) {
  
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await deleteCronjob(server, command)
      if (result === 200) {
        toast.info("Cronjob deleted.")
        setOpen(false)
        router.refresh()
      } else if (result === 400) {
        toast.error("Invalid fields format")
      }
    })
  }

  return (
    <form action={handleForm}>
      <Button variant="link" className="cursor-pointer hover:text-red-500">
        <Trash2 />
      </Button>
    </form>
  )
}
