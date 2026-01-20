"use client";

import { type LucideIcon, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

export function NavMain({
  items,
  label = "Menu",
}: {
  label?: string;
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible key={item.title} defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(item.isActive && "bg-primary/5")}
                  >
                    {item.icon && <item.icon />}
                    <span className="grow text-left">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenu className="ml-4">
                    {item.items.map((child) => (
                      <SidebarMenuItem key={child.title}>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            child.isActive && "bg-primary/10"
                          )}
                        >
                          <Link to={child.url}>
                            {child.icon && <child.icon />}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={cn(item.isActive && "bg-primary/5")}>
                <Link to={item.url!}>
                  {item.icon && <item.icon />}
                  <span className="grow text-left">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
