import AttendanceView from "@/components/pages/AttendanceView";
import InvoicePage from "@/components/pages/InvoicePage";
import FinancialSummaryPage from "@/components/pages/FinancialSummaryPage";
import StudentListView from "@/components/pages/StudentListView";
import TeacherListView from "@/components/pages/TeacherListView";
import ClassManagement from "@/components/pages/ClassManagement";
import CourseManagement from "@/components/pages/CourseManagement";
import TeacherClassView from "@/components/pages/TeacherClassView";
import TeacherAttendance from "@/components/pages/TeacherAttendance";
import AttendanceSession from "@/components/pages/AttendanceSession";
import ClassSessionHistory from "@/components/pages/ClassSessionHistory";
import TeacherSchedule from "@/components/pages/TeacherSchedule";
import AdminSchedule from "@/components/pages/AdminSchedule";
import StudentReportPage from "@/components/pages/StudentReportPage";
import AdminLayout from "@/layouts/AdminLayout";
import Authoriation from "@/routes/Authoriation";
import { Empty } from "antd/lib";

const privateRoutes = [
  {
    path: "/workspace",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Empty />,
      },
      {
        path: "invoice",
        element: (
          <Authoriation>
            <InvoicePage />
          </Authoriation>
        ),
      },
      {
        path: "financial-summary",
        element: (
          <Authoriation>
            <FinancialSummaryPage />
          </Authoriation>
        ),
      },
      {
        path: "students",
        element: <StudentListView />,
      },
      {
        path: "teachers",
        element: (
          <Authoriation>
            <TeacherListView />
          </Authoriation>
        ),
      },
      {
        path: "attendance",
        element: <TeacherAttendance />,
      },
      {
        path: "attendance/session/:classId",
        element: <AttendanceSession />,
      },
      {
        path: "attendance/old",
        element: <AttendanceView />,
      },
      {
        path: "classes",
        element: (
          <Authoriation>
            <ClassManagement />
          </Authoriation>
        ),
      },
      {
        path: "courses",
        element: (
          <Authoriation>
            <CourseManagement />
          </Authoriation>
        ),
      },
      {
        path: "my-classes",
        element: <TeacherClassView />,
      },
      {
        path: "classes/:classId/history",
        element: <ClassSessionHistory />,
      },
      {
        path: "my-schedule",
        element: <TeacherSchedule />,
      },
      {
        path: "admin-schedule",
        element: (
          <Authoriation>
            <AdminSchedule />
          </Authoriation>
        ),
      },
      {
        path: "students/:studentId/report",
        element: <StudentReportPage />,
      },
    ],
  },
];

export default privateRoutes;
