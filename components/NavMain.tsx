import { type Icon } from "@tabler/icons-react";

import { Link, NavLink } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navLinkStatus } from "@/utils/navLinkStatus";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              variant="default"
              tooltip="Quick Create"
              className="text-primary-foreground hover:bg-primary/90 active:bg-primary/90 active:text-primary-foreground min-w-8 h-full duration-200 ease-linear hover:text-white dark:text-white"
            >
              <Link to="/" className="font-medium text-black">
                <img src="/img/logo.png" alt="Logo" className="h-16 w-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <NavLink
              end
              to={item.url}
              key={item.title + item.url}
              className={navLinkStatus}
            >
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </NavLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
