import HomePage from "@/components/pages/HomePage";
import Login from "@/components/pages/Login";
import TeacherOnboarding from "@/components/TeacherOnboarding";
import MainLayout from "@/layouts/MainLayout";

const publicRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/onboarding",
    element: <TeacherOnboarding />,
  },
];

export default publicRoutes;
