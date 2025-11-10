import React, { useState, useRef, useEffect } from "react";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavigationDropdownProps {
  currentView:
    | "schedule"
    | "students"
    | "teachers"
    | "admin-calendar"
    | "attendance";
}

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  currentView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigater = useNavigate();
  const {
    navigateToLanding,
    navigateToSchedule,
    navigateToStudents,
    navigateToTeachers,
    navigateToAdminCalendar,
    navigateToAttendance,
  } = useAppNavigation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getCurrentViewLabel = () => {
    switch (currentView) {
      case "schedule":
        return "Study Schedule";
      case "students":
        return "Students";
      case "teachers":
        return "Teachers";
      case "admin-calendar":
        return "Admin Calendar";
      case "invoice":
        return "Create Invoices";
      default:
        return "Navigation";
    }
  };

  const getCurrentViewColor = () => {
    return "bg-gradient-to-r from-[#86c7cc] to-[#86c7cc]";
  };

  const isAdmin = userProfile.role === "admin";

  return (
    <div className="fixed top-24 right-4 z-[9999]" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${getCurrentViewColor()} text-white px-4 py-3 rounded-lg font-bold shadow-2xl hover:opacity-90 transition-all flex items-center gap-2 min-w-[200px] justify-between`}
        title="Navigation Menu"
      >
        <span className="text-black">{getCurrentViewLabel()}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden animate-fadeIn">
          <button
            onClick={() => {
              navigateToLanding();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-gray-100 font-semibold transition flex items-center gap-2 border-b border-gray-200"
            title="Home"
          >
            Home
          </button>

          {currentView !== "schedule" && (
            <button
              onClick={() => {
                navigateToSchedule();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Study Schedule"
            >
              Study Schedule
            </button>
          )}

          {currentView !== "students" && (
            <button
              onClick={() => {
                navigateToStudents();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Students"
            >
              Students
            </button>
          )}

          {currentView !== "teachers" && isAdmin && (
            <button
              onClick={() => {
                navigateToTeachers();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Teachers"
            >
              Teachers
            </button>
          )}

          {currentView !== "attendance" && (
            <button
              onClick={() => {
                navigateToAttendance();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Attendance"
            >
              📋 Attendance
            </button>
          )}

          {currentView !== "admin-calendar" && isAdmin && (
            <button
              onClick={() => {
                navigateToAdminCalendar();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Admin Calendar - Full Schedule View"
            >
              📅 Admin Calendar
            </button>
          )}
          {currentView !== "invoice" && isAdmin && (
            <button
              onClick={() => {
                navigater("/invoice");
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-white text-gray-800 hover:bg-blue-50 font-semibold transition flex items-center gap-2 border-b border-gray-200"
              title="Admin Calendar - Full Schedule View"
            >
              Create Invoices
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;
