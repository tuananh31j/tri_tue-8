import React from "react";
import { useRoutes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import TeacherOnboarding from "./components/TeacherOnboarding";
import { routes } from "./routes";

const App: React.FC = () => {
  const { currentUser, needsOnboarding, completeOnboarding, loading } =
    useAuth();
  const routing = useRoutes(routes);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-red-100">
        <div className="text-center">
         {/* Logo */}
          <span className="text-2xl text-white font-extrabold">Trí Tuệ 8+</span>
          <h2 className="text-2xl font-bold text-[#86c7cc]">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  // Show onboarding for new teachers
  if (needsOnboarding) {
    return (
      <TeacherOnboarding
        onSubmit={completeOnboarding}
        userEmail={currentUser.email || ""}
      />
    );
  }

  // Show app content for authenticated users
  return <>{routing}</>;
};

export default App;
