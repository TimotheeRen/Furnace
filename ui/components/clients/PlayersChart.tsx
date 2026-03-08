"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function PlayersChart({ data }: { data: any[] }) {

  const resourcesConfig = {
    players: {
      label: "players",
      color: "orange",
    },
  } satisfies ChartConfig

  return (
  <Card>
    <CardHeader>
      <CardTitle>Players online</CardTitle>
      <CardDescription>Showing players online on the server (%)</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={resourcesConfig}>
        <AreaChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false}/>
          <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-players)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-players)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="players"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-players)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}
