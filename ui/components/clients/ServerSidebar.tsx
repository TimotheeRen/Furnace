"use client"

import { BookOpen, Box, CalendarCog, DatabaseBackup, FileSliders, Folder, Gauge, Github, House, LayoutDashboard, Logs, MoveUpRight, SquareTerminal } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SelectItem, SelectTrigger, SelectValue, Select, SelectContent, SelectGroup } from "../ui/select";
import Link from "next/link";

interface ServerSidebarProps {
  server: string
}

export default function ServerSidebar({ server }: ServerSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Select defaultValue={server}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={server}><Box />{server}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${server}/`}>
                    <House/>
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${server}/console`}>
                    <SquareTerminal/>
                    <span>Console</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${server}/files`}>
                    <Folder />
                    <span>Files</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${server}/cronjobs`}>
                    <CalendarCog />
                    <span>Cronjobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`https://furnace-host.vercel.app/docs`}>
                    <BookOpen />
                    <span>Documentation</span>
                    <MoveUpRight/>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/dashboard">
          <LayoutDashboard/>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
