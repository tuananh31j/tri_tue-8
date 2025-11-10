import React from "react";
import { Outlet } from "react-router-dom";
import NavigationDropdown from "../components/NavigationDropdown";

/**
 * 🏗️ APP LAYOUT - Main application layout with navigation
 * Wraps all authenticated pages with consistent structure
 */

interface AppLayoutProps {
  /** Background gradient variant */
  variant?: "default" | "purple" | "blue" | "green";
  /** Current view for navigation highlighting */
  currentView?:
    | "landing"
    | "schedule"
    | "students"
    | "teachers"
    | "admin-calendar"
    | "attendance";
  /** Show/hide navigation dropdown */
  showNavigation?: boolean;
}

const BACKGROUND_VARIANTS = {
  default: "bg-linear-to-br from-red-50  to-red-100",
  purple: "bg-linear-to-br from-purple-50  to-indigo-100",
  blue: "bg-linear-to-br from-blue-50  to-cyan-100",
  green: "bg-linear-to-br from-green-50  to-emerald-100",
} as const;

const AppLayout: React.FC<AppLayoutProps> = ({
  variant = "default",
  currentView,
  showNavigation = true,
}) => {
  const backgroundClass = BACKGROUND_VARIANTS[variant];

  return (
    <div
      className={`min-h-screen h-screen overflow-y-auto bg-linear-to-br from-red-50  to-red-100`}
    >
      {/* Navigation Dropdown - Sticky at top */}
      {showNavigation && currentView && (
        <NavigationDropdown currentView={currentView} />
      )}

      {/* Main Content - Rendered by child routes */}
      <Outlet />
    </div>
  );
};

export default AppLayout;
