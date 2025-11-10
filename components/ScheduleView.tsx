import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import type { ScheduleEvent, FilterType } from "../types";
import TimePickerModal from "./TimePickerModal";
import { KanbanModal } from "./KanbanModal";
import FloatingActionButton from "./FloatingActionButton";
import NavigationDropdown from "./NavigationDropdown";
import { app, DATABASE_URL_BASE } from "../firebase";
import { SUBJECT_COLORS, GRADIENTS } from "../constants/colors";

const URL_BASE = `${DATABASE_URL_BASE}/datasheet`;
const SCHEDULE_URL = `${URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`;
const KANBAN_URL = `${URL_BASE}/Kanban.json`;
const STUDENT_LIST_URL = `${URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`;
const TEACHER_LIST_URL = `${URL_BASE}/Gi%C3%A1o_vi%C3%AAn.json`;

const getMonday = (d: Date): Date => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const formatDate = (d: Date): string => {
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatInputDate = (d: Date): string => {
  return d.toISOString().slice(0, 10);
};

// Subject color mapping
const getSubjectColor = (
  taskName: string
): { bg: string; border: string; text: string } => {
  // Extract subject from task name format: "Student - Teacher - Subject"
  const parts = taskName.split(" - ");
  const subject = parts.length >= 3 ? parts[2] : "";

  // Use constants from colors.ts
  return (
    SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] ||
    SUBJECT_COLORS.default
  );
};

const EventCard: React.FC<{
  event: ScheduleEvent;
  isToday: boolean;
  onCardClick: (event: ScheduleEvent) => void;
  onDelete: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
}> = ({ event, isToday, onCardClick, onDelete, onEdit }) => {
  const colors = getSubjectColor(event["Tên công việc"]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when deleting
    if (
      window.confirm(
        `Are you sure you want to delete "${event["Tên công việc"]}"?`
      )
    ) {
      onDelete(event);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when editing
    onEdit(event);
  };

  return (
    <div
      onClick={() => onCardClick(event)}
      className={`group relative w-full p-2 rounded-lg shadow-soft cursor-pointer overflow-hidden transition-all duration-300 ease-in-out animate-fadeIn border ${
        isToday ? "border-brand shadow-medium" : "border-transparent"
      } ${colors.bg} border-l-4 ${
        colors.border
      } hover:-translate-y-0.5 hover:shadow-large hover:p-3 hover:z-20`}
    >
      <div
        className={`font-semibold text-xs line-clamp-1 group-hover:line-clamp-none group-hover:font-bold ${colors.text}`}
      >
        {event["Tên công việc"]}
      </div>
      <div className="max-h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-40 group-hover:opacity-100 text-xs">
        <div className="mt-1">
          {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
        </div>
        <div className="mt-0.5">📍 {event["Địa điểm"]}</div>
        <div className="mt-1">🧑‍🏫 {event["Giáo viên phụ trách"]}</div>
        {event["Học sinh"] && event["Học sinh"].length > 0 && (
          <div className="mt-1 text-muted">
            🧑‍🎓 {event["Học sinh"].join(", ")}
          </div>
        )}
      </div>

      {/* Action buttons - show on hover */}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-1 text-xs font-semibold shadow-md hover:shadow-lg flex items-center gap-0.5"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 text-xs font-semibold shadow-md hover:shadow-lg flex items-center gap-0.5"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

interface ScheduleViewProps {
  initialFilter?: FilterType;
  hideNavigation?: boolean;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  initialFilter = "all",
  hideNavigation = false,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isKanbanModalOpen, setKanbanModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDayListModalOpen, setDayListModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const initialLoadRef = useRef(true);
  console.log("Current user:", currentUser, userProfile);
  const handleFilterByEmail = (data: any) => {
    if (userProfile.role === "admin") return data;
    console.log(data, "sdfsdfsdf");
    return data.filter(
      (event: any) => event["Email giáo viên"] === currentUser?.email
    );
  };

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(SCHEDULE_URL);
      const data = await response.json();

      console.log("Fetched schedule data:", data);

      if (data) {
        // const dataSRC = handleFilterByEmail(data);
        let eventsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        console.log(eventsArray, "sdfsdfsdf");

        // 🔒 PERMISSION FILTER: Teachers only see their own schedules
        // ⚠️ TEMPORARILY DISABLED - Everyone can see all data
        // if (userProfile?.role === 'teacher' && currentUser?.email) {
        //     console.log('🔒 Filtering schedule for teacher:', currentUser.email);
        //     eventsArray = eventsArray.filter(event => {
        //         const eventEmail = event["Email giáo viên"]?.toLowerCase();
        //         const userEmail = currentUser.email?.toLowerCase();
        //         return eventEmail === userEmail;
        //     });
        //     console.log('✅ Filtered events:', eventsArray.length);
        // }

        console.log("📅 Total events loaded:", eventsArray.length);
        console.log("📊 Sample events:", eventsArray.slice(0, 3));
        setAllEvents(eventsArray);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (allEvents.length > 0 && initialLoadRef.current) {
      initialLoadRef.current = false;

      const today = new Date();
      const mondayOfThisWeek = getMonday(new Date());
      const mondayOfCurrentView = getMonday(currentDate);

      if (mondayOfThisWeek.getTime() !== mondayOfCurrentView.getTime()) {
        return;
      }

      const currentDayIndex = (today.getDay() + 6) % 7;
      const currentHour = today.getHours();

      let sessionIndex = 0;
      if (currentHour >= 12 && currentHour < 18) sessionIndex = 1;
      else if (currentHour >= 18) sessionIndex = 2;

      setTimeout(() => {
        const targetSlot = document.getElementById(
          `slot-${currentDayIndex}-${sessionIndex}`
        );
        targetSlot?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 200);
    }
  }, [allEvents, currentDate]);

  const weekDates = useMemo(() => {
    const monday = getMonday(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const eventsForWeek = useMemo(() => {
    const weekStart = weekDates[0];
    const weekEnd = new Date(weekDates[6]);
    weekEnd.setHours(23, 59, 59, 999);

    return allEvents
      .filter((event) => {
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return eventDate >= weekStart && eventDate <= weekEnd;
      })
      .filter((event) => {
        // ❌ HIDE EXAM EVENTS - No longer needed
        if (event["Loại"] === "LichThi") return false;

        if (activeFilter === "all") return true;
        const type = event["Loại"] === "LichLamViec" ? "work" : "study";
        return type === activeFilter;
      })
      .filter((event) => {
        // 🔒 PERMISSION FILTER: Admin sees all, Teacher sees only their events
        console.log(event, "sdfsfsfvvvv");
        if (userProfile?.isAdmin) {
          // Admin sees all events
          return true;
        } else {
          // Teacher only sees their own events - compare by teacher name
          if (!userProfile.email) return false;
          return event["Giáo viên phụ trách"] === userProfile.displayName;
        }
      });
  }, [allEvents, weekDates, activeFilter, currentUser, userProfile]);

  const handleSaveTask = async (
    taskData: Omit<ScheduleEvent, "id">,
    id?: string
  ) => {
    try {
      const url = id
        ? `${URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u/${id}.json`
        : SCHEDULE_URL;

      const method = id ? "PUT" : "POST";

      // Add teacher email to track who created/edited the task
      const taskWithEmail = {
        ...taskData,
        "Email giáo viên": currentUser?.email || taskData["Email giáo viên"],
      };
      console.log(taskData, "sdfsdsfsddfsdf", taskWithEmail);
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskWithEmail),
      });

      if (!response.ok)
        throw new Error(`Failed to ${id ? "update" : "add"} event`);

      await fetchEvents();
      setAddModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error(`Error saving event:`, error);
    }
  };

  const handleDeleteEvent = async (event: ScheduleEvent) => {
    try {
      console.log("Deleting event:", event);
      const url = `${URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u/${event.id}.json`;
      console.log("Delete URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      console.log("Delete response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(
          `Failed to delete event: ${response.status} - ${errorText}`
        );
      }

      console.log("Event deleted successfully, refreshing...");
      await fetchEvents();

      // Close modals if the deleted event was being viewed
      if (selectedEvent?.id === event.id) {
        setDetailModalOpen(false);
        setSelectedEvent(null);
      }

      // Close day list modal to refresh the view
      if (isDayListModalOpen) {
        setDayListModalOpen(false);
        setTimeout(() => setDayListModalOpen(true), 100); // Reopen to show updated list
      }

      console.log("Delete completed successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(`Không thể xóa lịch học. Lỗi: ${error}`);
    }
  };

  const handleCardClick = (event: ScheduleEvent) => {
    // Prevent scroll loss by maintaining the current scroll position
    const scrollContainer = document.querySelector(".overflow-x-auto");
    const scrollPosition = scrollContainer?.scrollLeft || 0;

    setSelectedEvent(event);
    setDetailModalOpen(true);

    // Restore scroll position after modal opens
    setTimeout(() => {
      scrollContainer?.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }, 100);
  };

  const handleViewKanban = () => {
    setDetailModalOpen(false);
    setKanbanModalOpen(true);
  };

  const handleOpenEditModal = (event: ScheduleEvent) => {
    console.log("Opening edit modal for event:", event);
    setEditingEvent(event);
    setDetailModalOpen(false);
    setTimeout(() => {
      setAddModalOpen(true);
    }, 100);
  };

  const handleSlotDrop = async (
    e: React.DragEvent,
    targetDate: Date,
    targetSession: string
  ) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (!eventId) return;

    const eventToMove = allEvents.find((e) => e.id === eventId);
    if (!eventToMove) return;

    // Calculate new date
    const newDate = new Date(targetDate);

    // Calculate new time based on session
    let newStartHour = 0;
    if (targetSession === "Chiều") newStartHour = 13;
    else if (targetSession === "Tối") newStartHour = 18;

    const [oldHour, oldMin] = (eventToMove["Giờ bắt đầu"] || "0:0").split(":");
    const [oldEndHour, oldEndMin] = (
      eventToMove["Giờ kết thúc"] || "23:0"
    ).split(":");

    const durationHours = parseInt(oldEndHour) - parseInt(oldHour);
    const durationMins = parseInt(oldEndMin) - parseInt(oldMin);

    const newEndHour = Math.min(23, newStartHour + durationHours);
    const newEndMin = Math.min(59, durationMins);

    try {
      await handleSaveTask(
        {
          ...eventToMove,
          Ngày: newDate.toISOString().split("T")[0],
          "Giờ bắt đầu": `${newStartHour}:${String(oldMin).padStart(2, "0")}`,
          "Giờ kết thúc": `${newEndHour}:${String(newEndMin).padStart(2, "0")}`,
        },
        eventId
      );
    } catch (error) {
      console.error("Error moving event:", error);
    }
  };

  const handleSlotClick = (date: Date, session: string) => {
    // Show list of all tasks for this date
    setSelectedDate(date);
    setDayListModalOpen(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-0">
      <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />

      {/* Navigation Dropdown chỉ hiển thị nếu hideNavigation=false (dùng standalone) */}
      {!hideNavigation && <NavigationDropdown currentView="schedule" />}

      <div className="bg-paper border border-line rounded-none md:rounded-2xl shadow-medium overflow-hidden mt-2">
        <div className="relative overflow-x-auto">
          <div className="absolute inset-0 bg-contain md:bg-cover bg-no-repeat bg-center opacity-5 pointer-events-none"></div>
          <div className="grid grid-cols-[100px_repeat(7,minmax(160px,1fr))] md:grid-cols-[120px_repeat(7,minmax(180px,1fr))] relative z-10">
            <div className="sticky left-0 z-20 bg-gray-50/80"></div>
            {[
              "Thứ 2",
              "Thứ 3",
              "Thứ 4",
              "Thứ 5",
              "Thứ 6",
              "Thứ 7",
              "Chủ nhật",
            ].map((day, i) => {
              const isToday = weekDates[i].getTime() === today.getTime();
              return (
                <div
                  key={day}
                  className={`p-2 text-center font-bold text-sm border-l border-line bg-gray-50/80 sticky top-0 z-10 ${
                    isToday
                      ? "bg-brand-light text-brand-dark border-b-2 border-brand"
                      : "border-b"
                  }`}
                >
                  {day}
                  <small
                    className={`block font-medium mt-0.5 text-xs ${
                      isToday ? "text-brand" : "text-muted"
                    }`}
                  >
                    {formatDate(weekDates[i])}
                  </small>
                </div>
              );
            })}
            {["Sáng", "Chiều", "Tối"].map((session, sessionIndex) => (
              <React.Fragment key={session}>
                <div className="p-2 text-right font-semibold text-sm text-muted sticky left-0 z-20 bg-gray-50/80 border-b border-line">
                  {session}
                </div>
                {weekDates.map((date, dayIndex) => {
                  const eventsInSlot = eventsForWeek
                    .filter((event) => {
                      const eventDate = new Date(event["Ngày"]);
                      // Compare date parts only, ignoring time
                      if (
                        eventDate.getFullYear() !== date.getFullYear() ||
                        eventDate.getMonth() !== date.getMonth() ||
                        eventDate.getDate() !== date.getDate()
                      ) {
                        return false;
                      }

                      const startHour = parseInt(
                        (event["Giờ bắt đầu"] || "0:0").split(":")[0]
                      );
                      if (session === "Sáng") return startHour < 12;
                      if (session === "Chiều")
                        return startHour >= 12 && startHour < 18;
                      if (session === "Tối") return startHour >= 18;
                      return false;
                    })
                    .sort((a, b) =>
                      (a["Giờ bắt đầu"] || "00:00").localeCompare(
                        b["Giờ bắt đầu"] || "00:00"
                      )
                    );

                  return (
                    <div
                      key={`${session}-${dayIndex}`}
                      id={`slot-${dayIndex}-${sessionIndex}`}
                      onClick={() => handleSlotClick(date, session)}
                      className="relative p-2 border-b border-l border-line min-h-40 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {eventsInSlot.length > 0 && (
                        <span className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand font-bold text-white text-xs">
                          {eventsInSlot.length}
                        </span>
                      )}
                      <div
                        className="grow"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1.5 pr-1">
                          {eventsInSlot.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              isToday={date.getTime() === today.getTime()}
                              onCardClick={handleCardClick}
                              onDelete={handleDeleteEvent}
                              onEdit={handleOpenEditModal}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <FloatingActionButton onClick={() => setAddModalOpen(true)} />

      <DayTaskListModal
        isOpen={isDayListModalOpen}
        onClose={() => setDayListModalOpen(false)}
        date={selectedDate}
        allEvents={allEvents}
        onEventClick={(event) => {
          setSelectedEvent(event);
          setDayListModalOpen(false);
          setDetailModalOpen(true);
        }}
        onAddTask={() => {
          setDayListModalOpen(false);
          setAddModalOpen(true);
        }}
        onDelete={handleDeleteEvent}
        onEdit={(event) => {
          setEditingEvent(event);
          setDayListModalOpen(false);
          setAddModalOpen(true);
        }}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
        onViewKanban={handleViewKanban}
        onEdit={handleOpenEditModal}
      />

      <KanbanModal
        isOpen={isKanbanModalOpen}
        onClose={() => setKanbanModalOpen(false)}
        event={selectedEvent}
        onUpdate={fetchEvents}
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSaveTask={handleSaveTask}
        eventToEdit={editingEvent}
      />
    </div>
  );
};

// 🎨 MODAL WRAPPER - Unified modal styling component
const ModalWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  fullHeight?: boolean;
}> = ({ isOpen, onClose, children, size = "lg", fullHeight = false }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  const containerClass = fullHeight
    ? "w-full h-full"
    : `${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`;

  return (
    <div
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-1000 p-4 animate-modalFadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-2xl relative animate-modalContentSlideIn ${containerClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-transparent border-none w-10 h-10 sm:w-12 sm:h-12 rounded-full text-2xl sm:text-3xl leading-none cursor-pointer text-muted transition-all hover:bg-gray-100 hover:text-ink hover:rotate-90 z-10"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Header: React.FC<{
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}> = ({ currentDate, setCurrentDate }) => {
  const changeWeek = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className={`bg-[#86c7cc] shadow-lg sticky top-0 z-50`}>
      {/* Logo và Title */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img
            src="/logo.jpg"
            alt="Trí Tuệ 8+ Logo"
            className="mx-auto mb-4 w-24 h-24"
          />
          {/* Title Section */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white flex items-center gap-2">
              Schedule Planner
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2 ml-auto flex-wrap justify-center sm:justify-end">
        <input
          type="date"
          value={formatInputDate(currentDate)}
          onChange={(e) => setCurrentDate(new Date(e.target.value))}
          className="h-10 px-3 rounded-lg border border-white/30 bg-white font-semibold text-sm focus:ring-2 focus:ring-white/50 focus:outline-none transition"
        />
        <button
          onClick={() => setCurrentDate(new Date())}
          className="h-10 px-4 rounded-lg bg-white text-[#86c7cc] font-semibold transition hover:-translate-y-0.5 hover:shadow-lg text-sm"
        >
          Today
        </button>
        <button
          onClick={() => changeWeek(-7)}
          className="h-10 px-4 rounded-lg border border-white/30 bg-white/10 text-white font-semibold transition hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg text-sm"
        >
          ‹ Back
        </button>
        <button
          onClick={() => changeWeek(7)}
          className="h-10 px-4 rounded-lg border border-white/30 bg-white/10 text-white font-semibold transition hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg text-sm"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

const DayTaskListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  allEvents: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  onAddTask: () => void;
  onDelete: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
}> = ({
  isOpen,
  onClose,
  date,
  allEvents,
  onEventClick,
  onAddTask,
  onDelete,
  onEdit,
}) => {
  if (!date) return null;

  // Get all events for the selected date
  const dayEvents = allEvents.filter((event) => {
    if (!event["Ngày"]) return false;
    const eventDate = new Date(event["Ngày"]);
    return eventDate.toDateString() === date.toDateString();
  });

  // Group events by teacher
  const eventsByTeacher = dayEvents.reduce((acc, event) => {
    const teacher = event["Giáo viên phụ trách"] || "Chưa phân công";
    if (!acc[teacher]) {
      acc[teacher] = [];
    }
    acc[teacher].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  // Sort events within each teacher group by start time
  Object.keys(eventsByTeacher).forEach((teacher) => {
    eventsByTeacher[teacher].sort((a, b) => {
      const timeA = a["Giờ bắt đầu"] || "00:00";
      const timeB = b["Giờ bắt đầu"] || "00:00";
      return timeA.localeCompare(timeB);
    });
  });

  const teachers = Object.keys(eventsByTeacher).sort();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-brand mb-4 mt-8 sm:mt-0">
        📅 Lịch học ngày{" "}
        {date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </h2>
      <p className="text-gray-600 mb-6 text-base sm:text-lg">
        Tổng cộng:{" "}
        <span className="font-bold text-brand">{dayEvents.length}</span> buổi
        học
      </p>

      {dayEvents.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-5xl sm:text-6xl mb-4">📭</div>
          <p className="text-lg sm:text-xl text-gray-500 mb-6">
            Chưa có lịch học nào trong ngày này
          </p>
          <button
            onClick={onAddTask}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-brand text-white rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-base sm:text-xl"
          >
            ➕ Thêm lịch học mới
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {teachers.map((teacher) => {
            const teacherEvents = eventsByTeacher[teacher];
            const totalEvents = teacherEvents.length;

            return (
              <div key={teacher} className="space-y-3 sm:space-y-4">
                {/* Teacher Header */}
                <div className="flex items-center gap-3 pb-3 border-b-2 border-brand/30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand flex items-center justify-center text-white text-lg sm:text-xl font-bold shrink-0">
                    🧑‍🏫
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-brand">
                      {teacher}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {totalEvents} buổi học
                    </p>
                  </div>
                </div>

                {/* Teacher's Events */}
                <div className="space-y-3 ml-0 sm:ml-4">
                  {teacherEvents.map((event) => {
                    const colors = getSubjectColor(event["Tên công việc"]);

                    const handleDelete = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Bạn có chắc muốn xóa lịch học "${event["Tên công việc"]}"?`
                        )
                      ) {
                        onDelete(event);
                      }
                    };

                    const handleEdit = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      onEdit(event);
                    };

                    return (
                      <div
                        key={event.id}
                        className={`group relative ${colors.bg} ${colors.border} border-l-4 sm:border-l-8 rounded-xl sm:rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1`}
                      >
                        <div
                          onClick={() => onEventClick(event)}
                          className="flex items-start justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-base sm:text-xl font-bold ${colors.text} mb-2 wrap-break-word`}
                            >
                              {event["Tên công việc"]}
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg shrink-0">
                                  🕒
                                </span>
                                <span className="font-semibold">
                                  {event["Giờ bắt đầu"]} -{" "}
                                  {event["Giờ kết thúc"]}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg shrink-0">
                                  📍
                                </span>
                                <span className="wrap-break-word">
                                  {event["Địa điểm"]}
                                </span>
                              </div>
                              {event["Học sinh"] &&
                                event["Học sinh"].length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-base sm:text-lg shrink-0">
                                      🧑‍🎓
                                    </span>
                                    <span className="wrap-break-word">
                                      {event["Học sinh"].join(", ")}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div
                            className={`text-2xl sm:text-3xl font-bold ${colors.text} shrink-0`}
                          >
                            →
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
                          <button
                            onClick={handleEdit}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1"
                            title="Sửa lịch học"
                          >
                            ✏️ <span className="hidden sm:inline">Sửa</span>
                          </button>
                          <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1"
                            title="Xóa lịch học"
                          >
                            🗑️ <span className="hidden sm:inline">Xóa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            onClick={onAddTask}
            className="w-full mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-brand rounded-2xl font-bold transition hover:bg-brand hover:text-white hover:shadow-xl text-base sm:text-xl border-2 border-dashed border-brand"
          >
            ➕ Thêm lịch học mới
          </button>
        </div>
      )}
    </ModalWrapper>
  );
};

const TaskDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  onViewKanban: () => void;
  onEdit: (event: ScheduleEvent) => void;
}> = ({ isOpen, onClose, event, onViewKanban, onEdit }) => {
  if (!event) return null;

  const isExam = event["Loại"] === "LichThi";
  const isWork = event["Loại"] === "LichLamViec";
  const borderColor = isWork
    ? "border-green-600"
    : isExam
    ? "border-brand"
    : "border-study";
  const textColor = isWork
    ? "text-green-600"
    : isExam
    ? "text-brand"
    : "text-study";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="xl" fullHeight>
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 sm:border-l-8 pl-4 sm:pl-6 mb-6 sm:mb-8 mt-8 sm:mt-0 ${borderColor} ${textColor}`}
        >
          {event["Tên công việc"]}
        </h2>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg lg:text-xl">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <span className="text-3xl sm:text-4xl">🕒</span>
            <div>
              <p className="font-semibold text-gray-600 text-sm sm:text-base mb-1">
                Thời gian
              </p>
              <p className="text-gray-900 font-bold">
                {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <span className="text-3xl sm:text-4xl">📍</span>
            <div>
              <p className="font-semibold text-gray-600 text-sm sm:text-base mb-1">
                Địa điểm
              </p>
              <p className="text-gray-900 font-bold">{event["Địa điểm"]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <span className="text-3xl sm:text-4xl">🧑‍🏫</span>
            <div>
              <p className="font-semibold text-gray-600 text-sm sm:text-base mb-1">
                Giáo viên phụ trách
              </p>
              <p className="text-gray-900 font-bold">
                {event["Giáo viên phụ trách"]}
              </p>
            </div>
          </div>

          {event["Học sinh"] && event["Học sinh"].length > 0 && (
            <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <span className="text-3xl sm:text-4xl">🧑‍🎓</span>
                <p className="font-semibold text-gray-600 text-sm sm:text-base">
                  Học sinh tham gia
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 ml-0 sm:ml-16">
                {event["Học sinh"].map((name) => (
                  <span
                    key={name}
                    className="bg-white border-2 border-brand text-brand px-3 sm:px-5 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 flex gap-3 sm:gap-4 flex-wrap justify-center">
          <button
            onClick={() => onEdit(event)}
            className="px-4 sm:px-8 py-3 sm:py-4 bg-brand text-white rounded-xl sm:rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-base sm:text-xl"
          >
            ✏️ Sửa thông tin
          </button>
          <button
            onClick={onViewKanban}
            className="px-4 sm:px-8 py-3 sm:py-4 bg-study text-white rounded-xl sm:rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-base sm:text-xl"
          >
            📋 Xem Kanban
          </button>
          <button
            onClick={onClose}
            className="px-4 sm:px-8 py-3 sm:py-4 bg-gray-300 text-gray-800 rounded-xl sm:rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-base sm:text-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (event: Omit<ScheduleEvent, "id">, id?: string) => void;
  eventToEdit: ScheduleEvent | null;
}> = ({ isOpen, onClose, onSaveTask, eventToEdit }) => {
  const isEditMode = Boolean(eventToEdit);

  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("study");
  const [subjectName, setSubjectName] = useState("");
  const [taskDate, setTaskDate] = useState(formatInputDate(new Date()));
  const [taskLocation, setTaskLocation] = useState("");
  const [travelAllowance, setTravelAllowance] = useState("");
  const [comment, setComment] = useState("");

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [durationHours, setDurationHours] = useState("1");

  const [durationText, setDurationText] = useState("");

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<
    { id: string; name: string }[]
  >([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Clear students when switching to non-study type
  useEffect(() => {
    if (taskType !== "study") {
      setSelectedStudents([]);
    }
  }, [taskType]);

  // Auto-generate task name when any field changes
  // Format: Học sinh - Giáo viên - Môn học
  useEffect(() => {
    // selectedStudents is array of student objects {id, name}
    // selectedTeacher is teacher object {id, name}

    const studentNamesList = selectedStudents.map((s) => s.name).join(", ");
    const teacherNameText = selectedTeacher?.name || "";

    // Build task name: Student - Teacher - Subject
    const nameParts = [];
    if (studentNamesList) nameParts.push(studentNamesList);
    if (teacherNameText) nameParts.push(teacherNameText);
    if (subjectName) nameParts.push(subjectName);

    const finalName = nameParts.join(" - ");
    setTaskName(finalName);

    console.log("✅ Auto-generated Task Name:", finalName);
  }, [selectedStudents, selectedTeacher, subjectName]);

  // Auto-calculate end time when start time or duration changes
  useEffect(() => {
    const durationInHours = parseFloat(durationHours) || 0;
    const [startH, startM] = startTime.split(":").map((v) => parseInt(v) || 0);

    // Convert duration to minutes (e.g., 2.5 hours = 150 minutes)
    const durationInMinutes = durationInHours * 60;
    const totalMinutes = startH * 60 + startM + durationInMinutes;

    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = Math.round(totalMinutes % 60);

    setEndTime(
      `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`
    );
  }, [startTime, durationHours]);

  const resetForm = useCallback(() => {
    const now = new Date();
    setTaskName("");
    setTaskType("study");
    setSubjectName("");
    setTaskDate(formatInputDate(now));
    setTaskLocation("");
    setTravelAllowance("");
    setComment("");
    setStartTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`
    );
    setDurationHours("1");
    setEndTime(
      `${String(now.getHours() + 1 > 23 ? 23 : now.getHours() + 1).padStart(
        2,
        "0"
      )}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    setSelectedStudents([]);
    setSelectedTeacher(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        console.log("Loading event to edit:", eventToEdit);
        // Don't set taskName directly, it will be auto-generated
        const eventType = eventToEdit["Loại"];
        const taskType =
          eventType === "LichHoc"
            ? "study"
            : eventType === "LichLamViec"
            ? "work"
            : eventType === "CV"
            ? "study"
            : "exam";
        setTaskType(taskType);

        // Extract subject name from task name if exists
        // Format: "Student - Teacher - Subject"
        const taskNameParts = (eventToEdit["Tên công việc"] || "").split(" - ");
        if (taskNameParts.length >= 3) {
          let extractedSubject = taskNameParts[2]; // Get the subject (last part)

          // Remove old "Lịch học" or "Lịch thi" if exists (from old data)
          if (
            extractedSubject === "Lịch học" ||
            extractedSubject === "Lịch thi"
          ) {
            // If last part is "Lịch học/Lịch thi", try to use the teacher name as subject
            // or leave it empty to force user to select
            extractedSubject = "";
          }

          setSubjectName(extractedSubject);
        }

        // Handle date format
        let dateValue = eventToEdit["Ngày"] || formatInputDate(new Date());
        // Convert ISO date to YYYY-MM-DD if needed
        if (dateValue.includes("T")) {
          dateValue = dateValue.split("T")[0];
        }
        setTaskDate(dateValue);
        setTaskLocation(eventToEdit["Địa điểm"] || "");
        setTravelAllowance(eventToEdit["Phụ cấp di chuyển"] || "");
        setComment(eventToEdit["Nhận xét"] || "");

        // Handle time safely
        if (eventToEdit["Giờ bắt đầu"]) {
          setStartTime(eventToEdit["Giờ bắt đầu"]);
        } else {
          setStartTime("00:00");
        }

        if (eventToEdit["Giờ kết thúc"]) {
          setEndTime(eventToEdit["Giờ kết thúc"]);
        } else {
          setEndTime("23:00");
        }

        // Convert teacher name to {id, name} object
        const teacherName = eventToEdit["Giáo viên phụ trách"] || "";
        if (teacherName) {
          const foundTeacher = teachers.find((t) => t.name === teacherName);
          setSelectedTeacher(foundTeacher || null);
        } else {
          setSelectedTeacher(null);
        }

        // Convert student names to {id, name} objects
        const studentNames = eventToEdit["Học sinh"] || [];
        const studentObjects = studentNames
          .map((name: string) => {
            const foundStudent = students.find((s) => s.name === name);
            return foundStudent || { id: "", name }; // If not found, use empty id (backward compatibility)
          })
          .filter((s: any) => s.id); // Only include students that exist in the list
        setSelectedStudents(studentObjects);
      } else {
        resetForm();
      }
    }
  }, [eventToEdit, isOpen, resetForm, students, teachers]);

  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async (
        url: string,
        setData: React.Dispatch<
          React.SetStateAction<{ id: string; name: string }[]>
        >,
        nameField: string
      ) => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data) {
            // Use Firebase key as ID
            const array = Object.keys(data)
              .map((key) => ({
                id: key, // Firebase auto-generated key
                name: data[key][nameField],
              }))
              .filter((item) => item.name);
            console.log(
              `📊 Loaded ${array.length} items from ${url}:`,
              array.slice(0, 3)
            );
            setData(array);
          }
        } catch (error) {
          console.error(`Error fetching from ${url}:`, error);
        }
      };
      fetchOptions(STUDENT_LIST_URL, setStudents, "Họ và tên");
      fetchOptions(TEACHER_LIST_URL, setTeachers, "Họ và tên");
    }
  }, [isOpen]);

  // hours and minutes removed - now using ClockPicker

  useEffect(() => {
    const [startH, startM] = startTime.split(":").map((v) => parseInt(v) || 0);
    const [endH, endM] = endTime.split(":").map((v) => parseInt(v) || 0);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    if (endTotalMinutes <= startTotalMinutes) {
      setDurationText("Giờ kết thúc không hợp lệ");
      return;
    }

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;

    let text = "Tổng: ";
    if (h > 0) text += `${h} giờ `;
    if (m > 0) text += `${m} phút`;
    setDurationText(text.trim());
  }, [startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData: Omit<ScheduleEvent, "id"> = {
      "Tên công việc": taskName,
      Loại:
        taskType === "study"
          ? "LichHoc"
          : taskType === "work"
          ? "LichLamViec"
          : "LichThi",
      Ngày: taskDate,
      "Địa điểm": taskLocation,
      "Giáo viên phụ trách": selectedTeacher?.name || "", // Save name for backward compatibility
      "Teacher ID": selectedTeacher?.id || "", // Save ID to prevent duplicate teachers
      "Giờ bắt đầu": startTime,
      "Giờ kết thúc": endTime,
      // 🎓 Only save students for study type (LichHoc)
      "Học sinh":
        taskType === "study" ? selectedStudents.map((s) => s.name) : [], // Save names for backward compatibility
      "Student IDs":
        taskType === "study" ? selectedStudents.map((s) => s.id) : [], // Save IDs to prevent duplicate students
      "Phụ cấp di chuyển": travelAllowance,
      "Nhận xét": comment,
    };
    onSaveTask(eventData, eventToEdit?.id);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 mt-8 sm:mt-0">
        {isEditMode ? "Cập nhật công việc" : "Thêm công việc mới"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormGroup label="Loại công việc">
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              required
            >
              <option value="study">Lịch học</option>
              <option value="work">Lịch làm việc</option>
            </select>
          </FormGroup>

          <FormGroup label="Môn học">
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            >
              <option value="">-- Chọn môn học --</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Biology">Biology</option>
              <option value="Economics">Economics</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="Literature">Literature</option>
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
            </select>
          </FormGroup>

          <FormGroup label="Giáo viên phụ trách">
            <TeacherSingleSelect
              teachers={teachers}
              selectedTeacher={selectedTeacher}
              setSelectedTeacher={setSelectedTeacher}
            />
          </FormGroup>

          {/* 🎓 CHỈ HIỆN HỌC SINH KHI LÀ LỊCH HỌC */}
          {taskType === "study" && (
            <FormGroup label="Học sinh">
              <StudentMultiSelect
                students={students}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
              />
            </FormGroup>
          )}

          <FormGroup label="Tên công việc (Tự động)">
            <div className="relative">
              <input
                value={
                  taskName ||
                  "Chưa có - Vui lòng chọn đủ: Môn học, Giáo viên, Học sinh"
                }
                readOnly
                type="text"
                className="bg-gray-100 cursor-not-allowed font-semibold"
                placeholder="Học sinh - Giáo viên - Môn học"
                title={`subjectName: ${subjectName}, teacher: ${selectedTeacher}, students: ${selectedStudents.length}`}
              />
            </div>
          </FormGroup>

          <FormGroup label="Ngày">
            <input
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              type="date"
              required
            />
          </FormGroup>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormGroup label="Giờ bắt đầu">
              <div
                onClick={() => setStartTimePickerVisible(true)}
                className="w-full p-3 pl-10 rounded-xl border border-line text-lg font-semibold bg-white cursor-pointer select-none text-center relative hover:border-brand transition"
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">
                  🕒
                </span>
                {startTime}
              </div>
            </FormGroup>
            {/* Hide duration input for Work events - not needed */}
            {taskType !== "work" && (
              <FormGroup label="Số giờ">
                <input
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="1"
                  className="w-full p-3 rounded-xl border border-line text-lg font-semibold text-center"
                />
              </FormGroup>
            )}
            <FormGroup label="Giờ kết thúc">
              <div
                onClick={() => setEndTimePickerVisible(true)}
                className="w-full p-3 pl-10 rounded-xl border border-line text-lg font-semibold bg-white cursor-pointer select-none text-center relative hover:border-brand transition"
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">
                  🕒
                </span>
                {endTime}
              </div>
            </FormGroup>
          </div>

          <FormGroup label="Phụ cấp di chuyển">
            <input
              value={travelAllowance}
              onChange={(e) => setTravelAllowance(e.target.value)}
              type="text"
              placeholder="Nhập phụ cấp di chuyển"
            />
          </FormGroup>

          <FormGroup label="Nhận xét">
            <select
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            >
              <option value="">-- Chọn nhận xét --</option>
              <option value="Student needs to improve completing assignments and mastering basic knowledge. Keep trying and ask for help when needed.">
                Student needs to improve completing assignments and mastering
                basic knowledge. Keep trying and ask for help when needed.
              </option>
              <option value="Student hasn't applied the theory well in practice, but can do better with more focus and review.">
                Student hasn't applied the theory well in practice, but can do
                better with more focus and review.
              </option>
              <option value="Student needs to improve focus and attention to detail to achieve better results. Keep practicing.">
                Student needs to improve focus and attention to detail to
                achieve better results. Keep practicing.
              </option>
              <option value="Student has improved well, but needs to pay more attention to details and accuracy in their work.">
                Student has improved well, but needs to pay more attention to
                details and accuracy in their work.
              </option>
              <option value="Student has the ability to understand the material, but needs to study more deeply to achieve better results.">
                Student has the ability to understand the material, but needs to
                study more deeply to achieve better results.
              </option>
              <option value="Student completed the assignments fairly well, but needs to work harder and improve independent learning skills.">
                Student completed the assignments fairly well, but needs to work
                harder and improve independent learning skills.
              </option>
              <option value="Student has made progress, but needs to be more proactive in mastering difficult knowledge.">
                Student has made progress, but needs to be more proactive in
                mastering difficult knowledge.
              </option>
              <option value="Student excels in applying knowledge. Try taking on more challenging tasks to develop further.">
                Student excels in applying knowledge. Try taking on more
                challenging tasks to develop further.
              </option>
              <option value="Student has great analytical and sharing skills. Keep building on this and challenge yourself.">
                Student has great analytical and sharing skills. Keep building
                on this and challenge yourself.
              </option>
              <option value="Student completes assignments with high quality. Challenge yourself with advanced research projects.">
                Student completes assignments with high quality. Challenge
                yourself with advanced research projects.
              </option>
            </select>
          </FormGroup>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="h-11 px-6 rounded-xl border border-brand bg-brand text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base"
          >
            {isEditMode ? "Cập nhật" : "Thêm công việc"}
          </button>
        </div>
      </form>

      {/* Time Picker Modals */}
      {isStartTimePickerVisible && (
        <TimePickerModal
          value={startTime}
          onChange={setStartTime}
          onClose={() => setStartTimePickerVisible(false)}
        />
      )}
      {isEndTimePickerVisible && (
        <TimePickerModal
          value={endTime}
          onChange={setEndTime}
          onClose={() => setEndTimePickerVisible(false)}
        />
      )}
    </ModalWrapper>
  );
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="block mb-2 font-bold text-lg text-brand">{label}</label>
    <div className="[&_input]:w-full [&_input]:p-3 [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:text-base [&_input]:font-semibold [&_input]:transition [&_input]:focus:outline-none [&_input]:focus:border-brand [&_input]:focus:ring-2 [&_input]:focus:ring-brand/30 [&_select]:w-full [&_select]:p-3 [&_select]:rounded-xl [&_select]:border [&_select]:border-line [&_select]:text-base [&_select]:font-semibold [&_select]:transition [&_select]:focus:outline-none [&_select]:focus:border-brand [&_select]:focus:ring-2 [&_select]:focus:ring-brand/30">
      {children}
    </div>
  </div>
);

// TimePicker removed - now using ClockPicker

const TeacherSingleSelect: React.FC<{
  teachers: { id: string; name: string }[];
  selectedTeacher: { id: string; name: string } | null;
  setSelectedTeacher: (t: { id: string; name: string } | null) => void;
}> = ({ teachers, selectedTeacher, setSelectedTeacher }) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(selectedTeacher?.name || "");
  }, [selectedTeacher]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setInputValue(selectedTeacher?.name || "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTeacher]);

  const filteredTeachers = useMemo(
    () =>
      teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [teachers, inputValue]
  );

  const handleSelectTeacher = (teacher: { id: string; name: string }) => {
    setSelectedTeacher(teacher);
    setInputValue(teacher.name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Tìm và chọn giáo viên..."
      />
      {isOpen && (
        <div className="absolute top-full mt-1.5 w-full z-30 bg-white rounded-xl shadow-lg border border-line max-h-60 overflow-y-auto">
          <ul>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <li
                  key={teacher.id}
                  onClick={() => handleSelectTeacher(teacher)}
                  className="p-3 cursor-pointer hover:bg-gray-100 text-base"
                >
                  {teacher.name}
                </li>
              ))
            ) : (
              <li className="p-3 text-muted text-center text-base">
                Không tìm thấy giáo viên.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const StudentMultiSelect: React.FC<{
  students: { id: string; name: string }[];
  selectedStudents: { id: string; name: string }[];
  setSelectedStudents: (s: { id: string; name: string }[]) => void;
}> = ({ students, selectedStudents, setSelectedStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use both mousedown and click for better coverage
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("click", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isOpen]);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          !selectedStudents.some((s) => s.id === student.id) &&
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [students, selectedStudents, searchTerm]
  );

  const removeStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const addStudent = (student: { id: string; name: string }) => {
    setSelectedStudents([...selectedStudents, student]);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="w-full flex flex-wrap gap-2 items-center p-2 rounded-xl border border-line bg-white min-h-[52px]">
        {selectedStudents.map((student) => (
          <span
            key={student.id}
            className="flex items-center gap-1.5 bg-brand-light text-brand-dark px-2.5 py-1 rounded-full text-base font-medium"
          >
            {student.name}
            <button
              type="button"
              onClick={() => removeStudent(student.id)}
              className="text-brand-dark hover:text-red-500 font-bold"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm và chọn học sinh..."
          className="grow p-1 border-none outline-none focus:ring-0 text-base"
        />
      </div>
      {isOpen && (
        <div className="absolute top-full mt-1.5 w-full z-20 bg-white rounded-xl shadow-lg border border-line max-h-60 overflow-y-auto">
          <ul>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <li
                  key={student.id}
                  onClick={() => addStudent(student)}
                  className="p-3 cursor-pointer hover:bg-gray-100 text-base"
                >
                  {student.name}
                </li>
              ))
            ) : (
              <li className="p-3 text-muted text-center text-base">
                Không tìm thấy học sinh.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
