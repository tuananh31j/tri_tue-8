import { useState, useEffect } from "react";
import { Card, Button, Space, Tag, Empty, Badge } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
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
  date: string;
}

const TIME_SLOTS = [
  { label: "Sáng", start: "06:00", end: "12:00" },
  { label: "Chiều", start: "12:00", end: "18:00" },
  { label: "Tối", start: "18:00", end: "23:59" },
];

const TeacherSchedule = () => {
  const { userProfile } = useAuth();
  const { classes, loading } = useClasses();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<any>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(
    dayjs().startOf("isoWeek")
  );

  const teacherId =
    teacherData?.id || userProfile?.teacherId || userProfile?.uid || "";

  // Get week days (Monday to Sunday)
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, "day")
  );

  // Load teacher data
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

  // Filter classes for this teacher
  const myClasses = classes.filter((c) => {
    const match = c["Teacher ID"] === teacherId;
    return match && c["Trạng thái"] === "active";
  });

  // Get events for a specific date and time slot
  const getEventsForDateAndSlot = (
    date: Dayjs,
    slotStart: string,
    slotEnd: string
  ): ScheduleEvent[] => {
    const events: ScheduleEvent[] = [];
    const dayOfWeek = date.day() === 0 ? 8 : date.day() + 1;
    const dateStr = date.format("YYYY-MM-DD");

    myClasses.forEach((classData) => {
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

      const schedules =
        classData["Lịch học"]?.filter((s) => {
          if (s["Thứ"] !== dayOfWeek) return false;
          const scheduleStart = s["Giờ bắt đầu"];
          return scheduleStart >= slotStart && scheduleStart < slotEnd;
        }) || [];

      schedules.forEach((schedule) => {
        events.push({ class: classData, schedule, date: dateStr });
      });
    });

    return events.sort((a, b) =>
      a.schedule["Giờ bắt đầu"].localeCompare(b.schedule["Giờ bắt đầu"])
    );
  };

  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => prev.subtract(1, "week"));
  const goToNextWeek = () => setCurrentWeekStart((prev) => prev.add(1, "week"));
  const goToToday = () => setCurrentWeekStart(dayjs().startOf("isoWeek"));

  const isToday = (date: Dayjs) => date.isSame(dayjs(), "day");

  if (myClasses.length === 0)
    return (
      <WrapperContent title="Lịch dạy của tôi" isLoading={loading}>
        <Empty description="Bạn chưa được phân công lớp học nào" />
      </WrapperContent>
    );

  return (
    <WrapperContent title="Lịch dạy của tôi" isLoading={loading}>
      <Card style={{ marginBottom: 16 }}>
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

      {/* Schedule Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #f0f0f0",
                  padding: "12px",
                  backgroundColor: "#fafafa",
                  width: "100px",
                  textAlign: "center",
                }}
              ></th>
              {weekDays.map((day, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid #f0f0f0",
                    padding: "12px",
                    backgroundColor: isToday(day) ? "#e6f7ff" : "#fafafa",
                    textAlign: "center",
                    minWidth: "150px",
                  }}
                >
                  <div className="capitalize" style={{ fontWeight: "bold" }}>
                    {day.format("dddd")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {day.format("DD/MM/YYYY")}
                  </div>
                  {isToday(day) && (
                    <Badge
                      status="processing"
                      text="Hôm nay"
                      style={{ fontSize: "11px" }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, slotIndex) => (
              <tr key={slotIndex}>
                <td
                  style={{
                    border: "1px solid #f0f0f0",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                    fontWeight: "bold",
                    textAlign: "center",
                    verticalAlign: "top",
                  }}
                >
                  {slot.label}
                </td>
                {weekDays.map((day, dayIndex) => {
                  const events = getEventsForDateAndSlot(
                    day,
                    slot.start,
                    slot.end
                  );
                  return (
                    <td
                      key={dayIndex}
                      style={{
                        border: "1px solid #f0f0f0",
                        padding: "8px",
                        backgroundColor: isToday(day) ? "#f6ffed" : "white",
                        verticalAlign: "top",
                        minHeight: "120px",
                      }}
                    >
                      {events.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#ccc",
                            padding: "20px 0",
                          }}
                        >
                          -
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {events.map((event, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                navigate(
                                  `/workspace/attendance/session/${event.class.id}`,
                                  {
                                    state: {
                                      classData: event.class,
                                      date: event.date,
                                    },
                                  }
                                )
                              }
                              style={{
                                padding: "8px",
                                backgroundColor: "#e6f7ff",
                                borderLeft: "3px solid #1890ff",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "all 0.3s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#bae7ff";
                                e.currentTarget.style.transform =
                                  "translateX(2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#e6f7ff";
                                e.currentTarget.style.transform =
                                  "translateX(0)";
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  marginBottom: "4px",
                                }}
                              >
                                <BookOutlined /> {event.class["Tên lớp"]}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#666",
                                  marginBottom: "4px",
                                }}
                              >
                                <ClockCircleOutlined />{" "}
                                {event.schedule["Giờ bắt đầu"]} -{" "}
                                {event.schedule["Giờ kết thúc"]}
                              </div>
                              {event.schedule["Địa điểm"] && (
                                <div
                                  style={{ fontSize: "11px", color: "#999" }}
                                >
                                  <EnvironmentOutlined />{" "}
                                  {event.schedule["Địa điểm"]}
                                </div>
                              )}
                              <div style={{ marginTop: "4px" }}>
                                <Tag
                                  color="blue"
                                  style={{ fontSize: "10px", margin: 0 }}
                                >
                                  {subjectMap[event.class["Môn học"]] ||
                                    event.class["Môn học"]}
                                </Tag>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WrapperContent>
  );
};

export default TeacherSchedule;
