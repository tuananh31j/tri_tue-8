import React from "react";
import { RouteObject, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LandingPage from "../components/LandingPage";
import ScheduleView from "../components/ScheduleView";
import StudentListView from "../components/StudentListView";
import TeacherListView from "../components/TeacherListView";
import AdminCalendarView from "../components/AdminCalendarView";
import AttendanceView from "../components/AttendanceView";
import Receipts from "@/components/Receipts";
import PageHeader from "@/layouts/PageHeader";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/schedule",
    element: <AppLayout variant="default" currentView="schedule" />,
    children: [
      {
        index: true,
        element: <ScheduleView />,
      },
    ],
  },
  {
    path: "/invoice",
    element: <AppLayout variant="default" currentView="invoice" />,
    children: [
      {
        index: true,

        element: (
          <>
            <PageHeader
              title="Invoice"
              subtitle="Trí Tuệ 8+"
              icon="✅"
              sticky
            />
            <section className="container">
              {/* Lazy load the Receipts component visually here */}
              {/* Import is dynamic to avoid affecting initial bundle if not needed */}
              <div id="receipts-root" className="mt-6">
                <Receipts />
              </div>
            </section>
          </>
        ),
      },
    ],
  },
  {
    path: "/students",
    element: <AppLayout variant="default" currentView="students" />,
    children: [
      {
        index: true,
        element: <StudentListView />,
      },
    ],
  },
  {
    path: "/teachers",
    element: <AppLayout variant="default" currentView="teachers" />,
    children: [
      {
        index: true,
        element: <TeacherListView />,
      },
    ],
  },
  {
    path: "/admin-calendar",
    element: <AppLayout variant="purple" currentView="admin-calendar" />,
    children: [
      {
        index: true,
        element: <AdminCalendarView />,
      },
    ],
  },
  {
    path: "/attendance",
    element: <AppLayout variant="default" currentView="attendance" />,
    children: [
      {
        index: true,
        element: <AttendanceView />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
