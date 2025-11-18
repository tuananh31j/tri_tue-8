import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Empty,
  Select,
  Checkbox,
  Calendar as AntCalendar,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  BookOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { useAuth } from "../../contexts/AuthContext";
import { Class, ClassSchedule } from "../../types";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";
import WrapperContent from "@/components/WrapperContent";
import { subjectMap } from "@/utils/selectOptions";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.locale("vi");

interface ScheduleEvent {
  class: Class;
  schedule: ClassSchedule;
  date: Dayjs;
  startMinutes: number;
  durationMinutes: number;
}

type ViewMode = "all" | "subject";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

const TeacherSchedule = () => {
  const { userProfile } = useAuth();
  const { classes, loading } = useClasses();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<any>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(
    dayjs().startOf("isoWeek")
  );
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());

  const teacherId =
    teacherData?.id || userProfile?.teacherId || userProfile?.uid || "";

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  useEffect(() => {
    if (!userProfile?.email) return;

    const teachersRef = ref(database, "datasheet/Giáo_viên");
    const unsubscribe = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teacherEntry = Object.entries(data).find(
          ([_, teacher]: [string, any]) =>
            teacher.Email === userProfile.email ||
            teacher["Email công ty"] === userProfile.email
        );
        if (teacherEntry) {
          const [id, teacher] = teacherEntry;
          setTeacherData({ id, ...(teacher as any) });
        }
      }
    });
    return () => unsubscribe();
  }, [userProfile?.email]);

  const myClasses = classes.filter((c) => {
    const match = c["Teacher ID"] === teacherId;
    return match && c["Trạng thái"] === "active";
  });

  const subjects = Array.from(new Set(myClasses.map((c) => c["Môn học"]))).sort();

  const filteredClasses =
    viewMode === "all" || selectedSubjects.size === 0
      ? myClasses
      : myClasses.filter((c) => selectedSubjects.has(c["Môn học"]));

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getWeekEvents = (): (ScheduleEvent & { column: number; totalColumns: number })[] => {
    const events: ScheduleEvent[] = [];

    weekDays.forEach((date) => {
      const dayOfWeek = date.day() === 0 ? 8 : date.day() + 1;

      filteredClasses.forEach((classData) => {
        const startDate = classData["Ngày bắt đầu"]
          ? dayjs(classData["Ngày bắt đầu"])
          : null;
        const endDate = classData["Ngày kết thúc"]
          ? dayjs(classData["Ngày kết thúc"])
          : null;

        const isWithinDateRange =
          (!startDate || date.isSameOrAfter(startDate, "day")) &&
          (!endDate || date.isSameOrBefore(endDate, "day"));

        if (!isWithinDateRange) return;

        const schedules = classData["Lịch học"]?.filter(
          (s) => s["Thứ"] === dayOfWeek
        ) || [];

        schedules.forEach((schedule) => {
          const startMinutes = timeToMinutes(schedule["Giờ bắt đầu"]);
          const endMinutes = timeToMinutes(schedule["Giờ kết thúc"]);
          events.push({
            class: classData,
            schedule,
            date,
            startMinutes,
            durationMinutes: endMinutes - startMinutes,
          });
        });
      });
    });

    // Calculate columns for overlapping events
    const eventsWithColumns = events.map((event) => ({
      ...event,
      column: 0,
      totalColumns: 1,
    }));

    // Group by day and calculate overlaps
    weekDays.forEach((day) => {
      const dayEvents = eventsWithColumns.filter((e) => e.date.isSame(day, "day"));
      
      dayEvents.sort((a, b) => a.startMinutes - b.startMinutes);

      for (let i = 0; i < dayEvents.length; i++) {
        const currentEvent = dayEvents[i];
        const overlapping = [currentEvent];

        for (let j = 0; j < dayEvents.length; j++) {
          if (i === j) continue;
          const otherEvent = dayEvents[j];
          
          const currentEnd = currentEvent.startMinutes + currentEvent.durationMinutes;
          const otherEnd = otherEvent.startMinutes + otherEvent.durationMinutes;
          
          if (
            (otherEvent.startMinutes < currentEnd && otherEvent.startMinutes >= currentEvent.startMinutes) ||
            (currentEvent.startMinutes < otherEnd && currentEvent.startMinutes >= otherEvent.startMinutes)
          ) {
            if (!overlapping.includes(otherEvent)) {
              overlapping.push(otherEvent);
            }
          }
        }

        if (overlapping.length > 1) {
          overlapping.forEach((event, index) => {
            event.column = index;
            event.totalColumns = overlapping.length;
          });
        }
      }
    });

    return eventsWithColumns;
  };

  const weekEvents = getWeekEvents();

  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => prev.subtract(1, "week"));
  const goToNextWeek = () => setCurrentWeekStart((prev) => prev.add(1, "week"));
  const goToToday = () => setCurrentWeekStart(dayjs().startOf("isoWeek"));

  const isToday = (date: Dayjs) => date.isSame(dayjs(), "day");

  const handleSubjectToggle = (subject: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(subject)) {
      newSelected.delete(subject);
    } else {
      newSelected.add(subject);
    }
    setSelectedSubjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubjects.size === subjects.length) {
      setSelectedSubjects(new Set());
    } else {
      setSelectedSubjects(new Set(subjects));
    }
  };

  if (myClasses.length === 0)
    return (
      <WrapperContent title="Lịch dạy của tôi" isLoading={loading}>
        <Empty description="Bạn chưa được phân công lớp học nào" />
      </WrapperContent>
    );

  return (
    <WrapperContent title="Lịch dạy của tôi" isLoading={loading}>
      <div style={{ display: "flex", gap: "16px", height: "calc(100vh - 200px)" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Mini Calendar */}
          <Card size="small" style={{ padding: "8px" }}>
            <AntCalendar
              fullscreen={false}
              value={currentWeekStart}
              onChange={(date) => setCurrentWeekStart(date.startOf("isoWeek"))}
            />
          </Card>

          {/* View Mode Selection */}
          <Card size="small" title="Bộ lọc lịch">
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                Chế độ xem:
              </div>
              <Select
                style={{ width: "100%" }}
                value={viewMode}
                onChange={(value) => {
                  setViewMode(value);
                  setSelectedSubjects(new Set());
                }}
                options={[
                  { value: "all", label: "📅 Lịch tổng hợp" },
                  { value: "subject", label: "📚 Lịch phân môn" },
                ]}
              />
            </div>

            {/* Subject Filter */}
            {viewMode === "subject" && subjects.length > 0 && (
              <>
                <div style={{ marginBottom: "8px", paddingBottom: "8px", borderTop: "1px solid #f0f0f0", paddingTop: "8px" }}>
                  <Checkbox
                    checked={selectedSubjects.size === subjects.length}
                    indeterminate={selectedSubjects.size > 0 && selectedSubjects.size < subjects.length}
                    onChange={handleSelectAll}
                  >
                    <strong>
                      {selectedSubjects.size === 0
                        ? "Chọn tất cả"
                        : `Đã chọn ${selectedSubjects.size}/${subjects.length}`}
                    </strong>
                  </Checkbox>
                </div>

                <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                  <Space direction="vertical" style={{ width: "100%" }} size="small">
                    {subjects.map((subject) => (
                      <Checkbox
                        key={subject}
                        checked={selectedSubjects.has(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        style={{ width: "100%" }}
                      >
                        <span style={{ fontSize: "13px" }}>
                          {subjectMap[subject] || subject}
                        </span>
                      </Checkbox>
                    ))}
                  </Space>
                </div>
              </>
            )}

            {viewMode === "subject" && subjects.length === 0 && (
              <Empty
                description="Không có môn học"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: "20px 0" }}
              />
            )}
          </Card>
        </div>

        {/* Main Calendar View */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Week Navigation */}
          <Card style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button icon={<LeftOutlined />} onClick={goToPreviousWeek}>
                Tuần trước
              </Button>
              <Space>
                <CalendarOutlined />
                <span style={{ fontSize: 16, fontWeight: "bold" }}>
                  Tuần {currentWeekStart.isoWeek()} -{" "}
                  {currentWeekStart.format("MMMM YYYY")}
                </span>
                <span style={{ color: "#999" }}>
                  ({currentWeekStart.format("DD/MM")} -{" "}
                  {currentWeekStart.add(6, "day").format("DD/MM")})
                </span>
              </Space>
              <Space>
                <Button onClick={goToToday}>Hôm nay</Button>
                <Button icon={<RightOutlined />} onClick={goToNextWeek}>
                  Tuần sau
                </Button>
              </Space>
            </div>
          </Card>

          {/* Calendar Grid */}
          <div style={{ flex: 1, overflowY: "auto", backgroundColor: "white", borderRadius: "8px" }}>
            <div style={{ display: "flex", minHeight: "100%" }}>
              {/* Time Column */}
              <div
                style={{
                  width: "60px",
                  flexShrink: 0,
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                <div style={{ height: "60px", borderBottom: "1px solid #f0f0f0" }} />
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{
                      height: "60px",
                      borderBottom: "1px solid #f0f0f0",
                      padding: "4px",
                      fontSize: "12px",
                      color: "#666",
                      textAlign: "right",
                    }}
                  >
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = weekEvents.filter((e) =>
                  e.date.isSame(day, "day")
                );

                return (
                  <div
                    key={dayIndex}
                    style={{
                      flex: 1,
                      borderRight: dayIndex < 6 ? "1px solid #f0f0f0" : "none",
                      position: "relative",
                      backgroundColor: isToday(day) ? "#f6ffed" : "white",
                    }}
                  >
                    {/* Day Header */}
                    <div
                      style={{
                        height: "60px",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isToday(day) ? "#e6f7ff" : "#fafafa",
                      }}
                    >
                      <div
                        className="capitalize"
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {day.format("ddd")}
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: isToday(day) ? "#1890ff" : "#000",
                        }}
                      >
                        {day.format("DD")}
                      </div>
                    </div>

                    {/* Hour Grid Lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        style={{
                          height: "60px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      />
                    ))}

                    {/* Events */}
                    {dayEvents.map((event, idx) => {
                      const topOffset = ((event.startMinutes - 6 * 60) / 60) * 60;
                      const height = (event.durationMinutes / 60) * 60;
                      
                      const widthPercent = 100 / event.totalColumns;
                      const leftPercent = (event.column * widthPercent);

                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            navigate(
                              `/workspace/attendance/session/${event.class.id}`,
                              {
                                state: {
                                  classData: event.class,
                                  date: event.date.format("YYYY-MM-DD"),
                                },
                              }
                            )
                          }
                          style={{
                            position: "absolute",
                            top: `${60 + topOffset}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
                            height: `${height - 4}px`,
                            backgroundColor: "#e6f7ff",
                            border: "1px solid #69c0ff",
                            borderLeft: "3px solid #1890ff",
                            borderRadius: "4px",
                            padding: "4px 6px",
                            cursor: "pointer",
                            overflow: "hidden",
                            transition: "all 0.2s",
                            zIndex: 1,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#bae7ff";
                            e.currentTarget.style.zIndex = "10";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#e6f7ff";
                            e.currentTarget.style.zIndex = "1";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "11px",
                              marginBottom: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.class["Tên lớp"]}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#666",
                              marginBottom: "2px",
                            }}
                          >
                            {event.schedule["Giờ bắt đầu"]} - {event.schedule["Giờ kết thúc"]}
                          </div>
                          {event.schedule["Địa điểm"] && (
                            <div
                              style={{
                                fontSize: "9px",
                                color: "#999",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <EnvironmentOutlined /> {event.schedule["Địa điểm"]}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "9px",
                              color: "#999",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <BookOutlined /> {subjectMap[event.class["Môn học"]] || event.class["Môn học"]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </WrapperContent>
  );
};

export default TeacherSchedule;
