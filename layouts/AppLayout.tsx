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
      {/* Navigation Dropdown - Always on top, interactive */}
      {showNavigation && currentView && (
        <NavigationDropdown currentView={currentView} />
      )}

      {/* Main Content Area with Background Logo */}
      <div className="relative">
        {/* Background Logo - Fixed position, overlays content but non-interactive */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <img
            src="/logo.jpg"
            alt="Background Logo"
            className="w-auto h-[60vh] max-w-[60vw] object-contain opacity-[0.08] select-none"
            style={{
              filter: "grayscale(20%) brightness(1.1)",
            }}
          />
        </div>

        {/* Main Content - Rendered by child routes */}
        <div className="relative z-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
