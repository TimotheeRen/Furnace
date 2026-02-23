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
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Kbd } from "@/components/ui/kbd"
import { CodeBlock } from "@/components/ui/code-block"

export default function Home() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleForm = (formData: FormData) => {
    startTransition(async () => {
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" className="text-xs">Find credentials</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>How to find credentials</AlertDialogTitle>
                  <AlertDialogDescription>
                    Furnace credentials are store in the <Kbd>furnace-credentials</Kbd> secret in default namespace, as <Kbd>username</Kbd> amd <Kbd>password</Kbd>. <br/> You can get the username by typing the following command:
                    <div className="max-w-md my-5">
                    <CodeBlock language="bash" filename="" code="kubectl get secret furnace-credentials -o jsonpath='{.data.username}' | base64 --decode
"></CodeBlock>
                    </div>
                    You can get the password by typing the following command:
                    <div className="max-w-md mt-5">
                    <CodeBlock language="bash" filename="" code="kubectl get secret furnace-credentials -o jsonpath='{.data.password}' | base64 --decode
"></CodeBlock><br/>You can change them by editing the <Kbd>credentials.username</Kbd> and <Kbd>credentials.password</Kbd> Helm chart values.
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
