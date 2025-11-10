import React from "react";
import PageHeader from "../layouts/PageHeader";
import ScheduleView from "./ScheduleView";

const AdminCalendarView: React.FC = () => {
  return (
    <>
      {/* Content */}
      <div className="px-4 py-6 bg-[#86c7cc]">
        <div className="max-w-[1800px] mx-auto">
          <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">
                📅 Admin Full Calendar View
              </h2>
              <p className="text-purple-100">
                Complete overview of all schedules, students, and teachers. Use
                this view to manage and monitor all activities.
              </p>
            </div>
          </div>

          {/* Reuse ScheduleView - No props needed, uses react-router internally */}
          <ScheduleView initialFilter="all" hideNavigation={true} />
        </div>
      </div>
    </>
  );
};

export default AdminCalendarView;
