import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function Home() {
  return <>
    <Image src="/background.png" alt="Background image" fill className="fixed opacity-70 blur-sm"/>
    <div className="flex w-full min-h-svh items-center justify-center fixed">
      <Card className="w-full max-w-sm drop-shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Furnace.</CardTitle>
          <CardDescription>
            Enter your username and password
          </CardDescription>
          <CardAction>
            <Button variant="link">Find credentials</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Username..."required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password..."required/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
        </CardFooter>
      </Card>
    </div>
  </>
}
