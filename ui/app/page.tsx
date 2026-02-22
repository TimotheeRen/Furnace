"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Login } from "./actions/login"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Home() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleForm = (formData: FormData) => {
    startTransition(async () => {
      toast.promise(Login(formData), {
        loading: "Connection to Furnace..."
      }) 
      const result = await Login(formData)

      if (result === 200) {
        router.push("/dashboard")
      } else if (result === 401){
        toast.error("Invalid username or password", {position: "bottom-right"})
      } else if (result === 400){
        toast.warning("Bad request", {position: "bottom-right"})
      } else if (result === 500){
        toast.warning("Connection error", {position: "bottom-right"})
      } else {
        toast.error("Unexpected error: "+result, {position: "bottom-right"})
      }
    })
  }

  return (
    <>
      <Image 
        src="/background.png" 
        alt="Background" 
        fill 
        className="fixed opacity-70 blur-sm -z-10"
      />
      
      <div className="flex w-full min-h-svh items-center justify-center">
        <Card className="w-full max-w-sm drop-shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Furnace.</CardTitle>
            <CardDescription>Enter your username and password</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form action={handleForm} id="login-form" className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input name="username" id="username" type="text" placeholder="Username..." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" placeholder="Password..." required />
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              type="submit" 
              form="login-form" 
              disabled={isPending}
            >
              {isPending ? "Connecting..." : "Login"}
            </Button>
            <Button variant="link" className="text-xs">Find credentials</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
