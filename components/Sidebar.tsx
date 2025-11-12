import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconListDetails,
  IconReport,
  IconTags,
  IconUsers,
  IconCalendar,
  IconReceipt,
} from "@tabler/icons-react";
import * as React from "react";
import { NavDocuments } from "@/components/NavDocument";
import { NavMain } from "@/components/NavMain";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserCheck } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Lịch",
      url: "/workspace",
      icon: IconCalendar,
    },
    {
      title: "Hóa đơn",
      url: "/workspace/invoice",
      icon: IconReceipt,
      adminOnly: true,
    },
    {
      title: "Học sinh",
      url: "/workspace/students",
      icon: IconUsers,
    },
    {
      title: "Giáo viên",
      url: "/workspace/teachers",
      icon: UserCheck,
      adminOnly: true,
    },
    {
      title: "Điểm danh",
      url: "/workspace/attendance",
      icon: IconListDetails,
    },
  ],

  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userProfile } = useAuth();
  const isAdmin = React.useMemo(
    () => userProfile?.role === "admin",
    [userProfile]
  );
  const user = {
    name: userProfile.displayName,
    email: userProfile.email,
    avatar: "",
  };
  const menu = data.navMain.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={menu} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
