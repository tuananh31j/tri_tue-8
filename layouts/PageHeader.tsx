import React from "react";
import { GRADIENTS } from "../constants/colors";

/**
 * 🎨 PAGE HEADER - Reusable page header with logo and title
 */

interface PageHeaderProps {
  /** Main title text */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Icon/emoji to display */
  icon?: string;
  /** Make header sticky */
  sticky?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  sticky = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#86c7cc] shadow-lg ${
        sticky ? "sticky top-0 z-50" : ""
      } ${className}`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo */}
          <img
            src="/logo.jpg"
            alt="Trí Tuệ 8+ Logo"
            className="mb-4 w-24 h-24"
          />

          {/* Title Section */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white flex items-center gap-2">
              {icon && (
                <span className="text-2xl sm:text-3xl lg:text-4xl">{icon}</span>
              )}
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-xl text-red-100 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
