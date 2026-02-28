"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function ResourcesChart({ data }: { data: any[] }) {

  const resourcesConfig = {
    ram: {
      label: "RAM",
      color: "var(--chart-1)",
    },
    cpu: {
      label: "CPU",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
  <Card>
    <CardHeader>
      <CardTitle>Resources Usage</CardTitle>
      <CardDescription>Showing RAM and CPU usage of the server</CardDescription>
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
                stopColor="var(--color-ram)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-ram)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-cpu)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-cpu)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="cpu"
            type="natural"
            fill="url(#fillMobile)"
            fillOpacity={0.4}
            stroke="var(--color-cpu)"
            stackId="a"
          />
          <Area
            dataKey="ram"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-ram)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}
