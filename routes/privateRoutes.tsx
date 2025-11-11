import AdminCalendarView from "@/components/pages/AdminCalendarView";
import AttendanceView from "@/components/pages/AttendanceView";
import InvoicePage from "@/components/pages/InvoicePage";
import Receipts from "@/components/pages/Receipts";
import ScheduleView from "@/components/pages/ScheduleView";
import StudentListView from "@/components/pages/StudentListView";
import TeacherListView from "@/components/pages/TeacherListView";
import ScheduleViewAntd from "@/components/pages/ScheduleViewAntd";
import AdminLayout from "@/layouts/AdminLayout";
import PageHeader from "@/layouts/PageHeader";

const privateRoutes = [
  {
    path: "/workspace",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <ScheduleViewAntd />,
      },
      {
        path: "invoice",
        element: <InvoicePage />,
      },
      {
        path: "students",
        element: <StudentListView />,
      },
      {
        path: "teachers",
        element: <TeacherListView />,
      },
      {
        path: "admin-calendar",
        element: <AdminCalendarView />,
      },
      {
        path: "attendance",
        element: <AttendanceView />,
      },
    ],
  },
];

export default privateRoutes;
