import React from "react";
import PageHeader from "../../layouts/PageHeader";
import ScheduleView from "./ScheduleView";

const AdminCalendarView: React.FC = () => {
  return (
    <>
      {/* Content */}
      <div className="px-4 py-6 bg-[#36797f]">
        <div className="max-w-[1800px] mx-auto">
          {/* Reuse ScheduleView - No props needed, uses react-router internally */}
          <ScheduleView initialFilter="all" hideNavigation={true} />
        </div>
      </div>
    </>
  );
};

export default AdminCalendarView;
