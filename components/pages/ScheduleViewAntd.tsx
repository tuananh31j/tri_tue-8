import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ScheduleEvent, FilterType } from "../../types";
import { KanbanModal } from "../KanbanModal";
import { DATABASE_URL_BASE } from "../../firebase";
import { SUBJECT_COLORS } from "../../constants/colors";

import {
  Calendar,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Tag,
  Descriptions,
  List,
  Avatar,
  Tooltip,
  Popconfirm,
  FloatButton,
  Divider,
  InputNumber,
  Row,
  Col,
  Typography,
  ConfigProvider,
  Table,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import Card from "antd/es/card/Card";
import WrapperContent from "@/components/WrapperContent";
import { LibraryBig } from "lucide-react";
import { Empty } from "antd/lib";
dayjs.locale("vi");

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const URL_BASE = `${DATABASE_URL_BASE}/datasheet`;
const SCHEDULE_URL = `${URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`;
const KANBAN_URL = `${URL_BASE}/Kanban.json`;
const STUDENT_LIST_URL = `${URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`;
const TEACHER_LIST_URL = `${URL_BASE}/Gi%C3%A1o_vi%C3%AAn.json`;

const subjectMap: Record<string, string> = {
  Mathematics: "Toán",
  Literature: "Ngữ văn",
  English: "Tiếng Anh",
  Physics: "Vật lý",
  Chemistry: "Hóa học",
  Biology: "Sinh học",
  History: "Lịch sử",
  Geography: "Địa lý",
  CivicEducation: "Giáo dục công dân",
  Informatics: "Tin học",
  Technology: "Công nghệ",
  PhysicalEducation: "Thể dục",
  Music: "Âm nhạc",
  Art: "Mỹ thuật",
  DefenseEducation: "Giáo dục quốc phòng",
  Science: "Khoa học tự nhiên",
  SocialScience: "Khoa học xã hội",
  Ethics: "Đạo đức",
  CareerOrientation: "Hướng nghiệp",
  Reading: "Đọc hiểu",
  Writing: "Tập làm văn",
  MathematicalLogic: "Toán tư duy",
  ComputerScience: "Khoa học máy tính",
  Programming: "Lập trình",
  STEM: "STEM",
  LifeSkills: "Kỹ năng sống",
  EnvironmentalEducation: "Giáo dục môi trường",
  MoralEducation: "Giáo dục đạo đức",
  Astronomy: "Thiên văn học",
  Economics: "Kinh tế học",
  Psychology: "Tâm lý học",
  Philosophy: "Triết học",
  none: "--",
};

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
): { bg: string; border: string; text: string; antdColor: string } => {
  const parts = taskName.split(" - ");
  const subject = parts.at(-1);

  const colorMap: Record<string, string> = {
    Mathematics: "blue",
    Literature: "red",
    English: "purple",
    Physics: "indigo",
    Chemistry: "green",
    Biology: "teal",
    History: "orange",
    Geography: "yellow",
    CivicEducation: "rose",
    Informatics: "cyan",
    Technology: "lime",
    PhysicalEducation: "emerald",
    Music: "pink",
    Art: "fuchsia",
    DefenseEducation: "gray",
    Science: "sky",
    SocialScience: "amber",
    Ethics: "violet",
    CareerOrientation: "slate",
    Reading: "cyan",
    Writing: "rose",
    MathematicalLogic: "blue",
    ComputerScience: "cyan",
    Programming: "emerald",
    STEM: "teal",
    LifeSkills: "amber",
    EnvironmentalEducation: "green",
    MoralEducation: "purple",
    Astronomy: "indigo",
    Economics: "lime",
    Psychology: "pink",
    Philosophy: "gray",
  };

  const baseColor =
    SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] ||
    SUBJECT_COLORS.default;

  return {
    ...baseColor,
    antdColor: colorMap[subject] || "default",
  };
};

interface ScheduleViewProps {
  initialFilter?: FilterType;
  hideNavigation?: boolean;
}

const ScheduleViewAntd: React.FC<ScheduleViewProps> = ({
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

  const [form] = Form.useForm();
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<
    { id: string; name: string; label: string; email: string }[]
  >([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(SCHEDULE_URL);
      const data = await response.json();

      if (data) {
        let eventsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

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
          const array = Object.keys(data)
            .map((key) => ({
              id: key,
              name: data[key]["Họ và tên"],
              email: data[key]["Email"],
              label:
                data[key]["Họ và tên"] +
                ` - ${data[key]["Email"] || "<Chưa có mail>"}`,
            }))
            .filter((item) => item.name);
          setData(array);
        }
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
      }
    };
    fetchOptions(STUDENT_LIST_URL, setStudents, "Họ và tên");
    fetchOptions(TEACHER_LIST_URL, setTeachers, "Email");
  }, []);

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
        if (event["Loại"] === "LichThi") return false;
        if (activeFilter === "all") return true;
        const type = event["Loại"] === "LichLamViec" ? "work" : "study";
        return type === activeFilter;
      })
      .filter((event) => {
        console.log(event, "11111111", currentUser);
        if (userProfile?.isAdmin) {
          return true;
        } else {
          if (!userProfile.email) return false;
          return event["Teacher ID"] === userProfile.uid;
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

      const taskWithEmail = {
        ...taskData,
        "Email giáo viên": taskData["Email giáo viên"],
      };

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
      form.resetFields();
    } catch (error) {
      console.error(`Error saving event:`, error);
    }
  };

  const handleDeleteEvent = async (event: ScheduleEvent) => {
    try {
      const url = `${URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u/${event.id}.json`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
      }

      await fetchEvents();

      if (selectedEvent?.id === event.id) {
        setDetailModalOpen(false);
        setSelectedEvent(null);
      }

      if (isDayListModalOpen) {
        setDayListModalOpen(false);
        setTimeout(() => setDayListModalOpen(true), 100);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Modal.error({
        title: "Lỗi xóa lịch học",
        content: `Không thể xóa lịch học. Lỗi: ${error}`,
      });
    }
  };

  const handleCardClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleViewKanban = () => {
    setDetailModalOpen(false);
    setKanbanModalOpen(true);
  };

  const handleOpenEditModal = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setDetailModalOpen(false);
    setTimeout(() => {
      setAddModalOpen(true);
    }, 100);
  };

  const handleSlotClick = (date: Date, session: string) => {
    setSelectedDate(date);
    setDayListModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    form.resetFields();
    setAddModalOpen(true);
  };

  const changeWeek = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Table columns for Ant Design Table
  const tableColumns = [
    {
      title: "",
      dataIndex: "session",
      key: "session",
      width: 100,
      fixed: "left" as const,
      render: (session: string) => (
        <div
          style={{ fontWeight: "600", textAlign: "right", paddingRight: 12 }}
        >
          {session}
        </div>
      ),
    },
    ...weekDates.map((date, dayIndex) => ({
      title: () => {
        const dayNames = [
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
          "Chủ nhật",
        ];
        const isToday = date.getTime() === today.getTime();
        return (
          <div
            style={{
              padding: "12px 0",
              background: isToday ? "#e6f7ff" : "#fafafa",
              fontWeight: "bold",
              minWidth: "180px",
              textAlign: "center",
            }}
          >
            <div>{dayNames[dayIndex]}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {formatDate(date)}
            </div>
          </div>
        );
      },
      dataIndex: `day_${dayIndex}`,
      key: `day_${dayIndex}`,
      width: 180,
      render: (_: any, record: any, rowIndex: number) => {
        const session = record.session;
        const currentDate = weekDates[dayIndex];
        const eventsInSlot = eventsForWeek
          .filter((event) => {
            const eventDate = new Date(event["Ngày"]);
            if (
              eventDate.getFullYear() !== currentDate.getFullYear() ||
              eventDate.getMonth() !== currentDate.getMonth() ||
              eventDate.getDate() !== currentDate.getDate()
            ) {
              return false;
            }

            const startHour = parseInt(
              (event["Giờ bắt đầu"] || "0:0").split(":")[0]
            );
            if (session === "Sáng") return startHour < 12;
            if (session === "Chiều") return startHour >= 12 && startHour < 18;
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
            style={{
              padding: "8px",
              minHeight: "120px",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => handleSlotClick(currentDate, session)}
          >
            {eventsInSlot.length > 0 && (
              <Badge
                count={eventsInSlot.length}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                }}
              />
            )}
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {eventsInSlot.map((event) => {
                const colors = getSubjectColor(event["Tên công việc"]);

                return (
                  <Card
                    key={event.id}
                    size="small"
                    hoverable
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(event);
                    }}
                    style={{
                      borderLeft: `4px solid ${colors.antdColor}`,
                    }}
                    actions={[
                      <Tooltip title="Sửa">
                        <EditOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(event);
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title="Xóa">
                        <Popconfirm
                          title="Xác nhận xóa"
                          description="Bạn có chắc muốn xóa lịch học này?"
                          onConfirm={(e) => {
                            e?.stopPropagation();
                            handleDeleteEvent(event);
                          }}
                          onCancel={(e) => e?.stopPropagation()}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <DeleteOutlined
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </Tooltip>,
                    ]}
                  >
                    <div
                      className="line-clamp-3"
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {event.subjectName ||
                        subjectMap[
                          event["Tên công việc"].split(" - ").at(-1) || "none"
                        ] ||
                        "--"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                      }}
                    >
                      {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
                    </div>
                  </Card>
                );
              })}
            </Space>
          </div>
        );
      },
    })),
  ];

  // Table data source
  const tableData = [
    { key: "morning", session: "Sáng" },
    { key: "afternoon", session: "Chiều" },
    { key: "evening", session: "Tối" },
  ];

  return (
    <WrapperContent
      title="Lịch Học & Công Việc"
      toolbar={
        <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
          <DatePicker
            value={dayjs(currentDate)}
            onChange={(date) => date && setCurrentDate(date.toDate())}
            format="DD/MM/YYYY"
          />
          <Button type="primary" onClick={() => setCurrentDate(new Date())}>
            Hôm nay
          </Button>
          <Button icon={<LeftOutlined />} onClick={() => changeWeek(-7)}>
            Tuần trước
          </Button>
          <Button icon={<RightOutlined />} onClick={() => changeWeek(7)}>
            Tuần sau
          </Button>
        </Space>
      }
    >
      <div className="p-4">
        {/* Header */}

        {/* Schedule Grid */}
        <Card>
          <Table
            scroll={{ y: 55 * 10, x: 1200 }}
            columns={tableColumns}
            dataSource={tableData}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        {/* Floating Action Button */}
        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24 }}
          onClick={handleOpenAddModal}
        />

        {/* Modals */}
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
          onAddTask={handleOpenAddModal}
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

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setEditingEvent(null);
            form.resetFields();
          }}
          onSaveTask={handleSaveTask}
          eventToEdit={editingEvent}
          form={form}
          students={students}
          teachers={teachers}
        />

        <KanbanModal
          isOpen={isKanbanModalOpen}
          onClose={() => setKanbanModalOpen(false)}
          event={selectedEvent}
          onUpdate={fetchEvents}
        />
      </div>
    </WrapperContent>
  );
};

// Day Task List Modal
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
  const { userProfile } = useAuth();
  if (!date) return null;
  const isAdmin = React.useMemo(
    () => userProfile?.role === "admin",
    [userProfile]
  );
  const dayEvents = allEvents.filter((event) => {
    if (!event["Ngày"]) return false;
    const eventDate = new Date(event["Ngày"]);
    if (!isAdmin && event["Teacher ID"] !== userProfile?.uid) return false;
    return eventDate.toDateString() === date.toDateString();
  });

  const eventsByTeacher = dayEvents.reduce(
    (acc, event) => {
      const teacher = event["Teacher ID"];
      if (!acc[teacher]) {
        acc[teacher] = [];
      }
      acc[teacher].push(event);
      return acc;
    },
    {} as Record<string, ScheduleEvent[]>
  );

  Object.keys(eventsByTeacher).forEach((teacher) => {
    eventsByTeacher[teacher].sort((a, b) => {
      const timeA = a["Giờ bắt đầu"] || "00:00";
      const timeB = b["Giờ bắt đầu"] || "00:00";
      return timeA.localeCompare(timeB);
    });
  });

  // const teachers = Object.keys(eventsByTeacher).sort();

  const teachers = Object.values(eventsByTeacher)
    .flat()
    .map((item) => ({
      email: item["Email giáo viên"],
      name: item["Giáo viên phụ trách"],
      teacherId: item["Teacher ID"],
    }))
    .filter((item) => {
      if (isAdmin) return true;
      return item.teacherId === userProfile?.uid;
    })
    .sort();

  console.log(teachers, "sfsdfffff");

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          Lịch học ngày{" "}
          {date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddTask}
        >
          Thêm lịch học mới
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <Paragraph>
        Tổng cộng: <Text strong>{dayEvents.length}</Text> buổi học
      </Paragraph>

      {dayEvents.length === 0 ? (
        <Empty description="Không có lịch học nào cho ngày này." />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {teachers.map((teacher) => (
            <Card key={teacher.teacherId} size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ background: "#36797f" }}
                  />
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      {teacher.name} - {teacher.email}
                    </Text>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {eventsByTeacher[teacher.teacherId].length} buổi học
                    </div>
                  </div>
                </Space>
                <Divider style={{ margin: "8px 0" }} />
                <List
                  dataSource={eventsByTeacher[teacher.teacherId]}
                  renderItem={(event) => {
                    const colors = getSubjectColor(event["Tên công việc"]);
                    return (
                      <List.Item
                        actions={[
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(event)}
                          >
                            Sửa
                          </Button>,
                          <Popconfirm
                            title="Xác nhận xóa"
                            description="Bạn có chắc muốn xóa lịch học này?"
                            onConfirm={() => onDelete(event)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ background: colors.border }}>
                              📚
                            </Avatar>
                          }
                          title={
                            <p onClick={() => onEventClick(event)}>
                              {event["Tên công việc"]}
                            </p>
                          }
                          description={
                            <Space direction="vertical" size="small">
                              <Space>
                                <ClockCircleOutlined />
                                {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
                              </Space>
                              <Space>
                                <EnvironmentOutlined />
                                {event["Địa điểm"]}
                              </Space>
                              {event["Học sinh"] &&
                                event["Học sinh"].length > 0 && (
                                  <Space>
                                    <TeamOutlined />
                                    {event["Học sinh"].join(", ")}
                                  </Space>
                                )}
                            </Space>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Space>
            </Card>
          ))}
        </Space>
      )}
    </Modal>
  );
};

// Task Detail Modal
const TaskDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  onViewKanban: () => void;
  onEdit: (event: ScheduleEvent) => void;
}> = ({ isOpen, onClose, event, onViewKanban, onEdit }) => {
  if (!event) return null;

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          Chi tiết lịch học
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(event)}
        >
          Sửa thông tin
        </Button>,
        <Button
          key="kanban"
          icon={<CheckCircleOutlined />}
          onClick={onViewKanban}
        >
          Xem Kanban
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
    >
      <Title level={4}>{event["Tên công việc"]}</Title>
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={
            <>
              <ClockCircleOutlined /> Thời gian
            </>
          }
        >
          {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <EnvironmentOutlined /> Địa điểm
            </>
          }
        >
          {event["Địa điểm"] || "--"}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <UserOutlined /> Giáo viên
            </>
          }
        >
          {event["Giáo viên phụ trách"] || "--"}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <BookOutlined /> Môn học
            </>
          }
        >
          {event.subjectName ||
            subjectMap[event["Tên công việc"].split(" - ").at(-1) || "none"] ||
            "--"}
        </Descriptions.Item>
        {event["Học sinh"] && event["Học sinh"].length > 0 && (
          <Descriptions.Item
            label={
              <>
                <TeamOutlined /> Học sinh
              </>
            }
          >
            <Space wrap>
              {event["Học sinh"].map((name) => (
                <Tag key={name} color="blue">
                  {name}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

// Add/Edit Task Modal
const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (event: Omit<ScheduleEvent, "id">, id?: string) => void;
  eventToEdit: ScheduleEvent | null;
  form: any;
  students: { id: string; name: string }[];
  teachers: { id: string; email: string; label: string; name: string }[];
}> = ({
  isOpen,
  onClose,
  onSaveTask,
  eventToEdit,
  form,
  students,
  teachers,
}) => {
  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        const taskNameParts = (eventToEdit["Tên công việc"] || "").split(" - ");
        const extractedSubject =
          taskNameParts.length >= 3 ? taskNameParts[2] : "";

        form.setFieldsValue({
          taskType: eventToEdit["Loại"] === "LichHoc" ? "study" : "work",
          subjectName: extractedSubject,
          taskDate: dayjs(eventToEdit["Ngày"]),
          taskLocation: eventToEdit["Địa điểm"],
          travelAllowance: eventToEdit["Phụ cấp di chuyển"],
          comment: eventToEdit["Nhận xét"],
          startTime: eventToEdit["Giờ bắt đầu"],
          endTime: eventToEdit["Giờ kết thúc"],
          teacher:
            teachers.find((t) => t.id === eventToEdit["Teacher ID"])?.email ||
            "",
          students: eventToEdit["Học sinh"] || [],
        });
        setStartTime(eventToEdit["Giờ bắt đầu"] || "00:00");
        setEndTime(eventToEdit["Giờ kết thúc"] || "00:00");
      } else {
        form.resetFields();
        setTaskName("");
      }
    }
  }, [eventToEdit, isOpen, form]);

  const handleSubmit = (values: any) => {
    const eventData: Omit<ScheduleEvent, "id"> = {
      "Tên công việc": taskName,
      Loại: values.taskType === "study" ? "LichHoc" : "LichLamViec",
      Ngày: values.taskDate.format("YYYY-MM-DD"),
      "Địa điểm": values.taskLocation || "",
      "Giáo viên phụ trách":
        teachers.find((t) => t.email === values.teacher)?.name || "",
      "Teacher ID": teachers.find((t) => t.email === values.teacher)?.id || "",
      "Giờ bắt đầu": values.startTime || "00:00",
      "Giờ kết thúc": values.endTime || "00:00",
      "Học sinh": values.taskType === "study" ? values.students || [] : [],
      "Student IDs":
        values.taskType === "study"
          ? (values.students || []).map(
              (name: string) => students.find((s) => s.name === name)?.id || ""
            )
          : [],
      "Phụ cấp di chuyển": values.travelAllowance || "",
      "Nhận xét": values.comment || "",
      "Email giáo viên": values.teacher || "",
      subjectName: values.subjectName || "",
    };
    console.log(eventData, "sdfsdfsdfsd", values);
    onSaveTask(eventData, eventToEdit?.id);
  };

  // Auto-generate task name
  useEffect(() => {
    const values = form.getFieldsValue();
    const studentsList = (values.students || []).join(", ");
    const teacherName = values.teacher || "";
    const subject = values.subjectName || "";

    const nameParts = [];
    if (studentsList) nameParts.push(studentsList);
    if (teacherName) nameParts.push(teacherName);
    if (subject) nameParts.push(subject);

    setTaskName(nameParts.join(" - "));
  }, [form]);

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          {eventToEdit ? "Cập nhật công việc" : "Thêm công việc mới"}
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={() => {
          const values = form.getFieldsValue();
          const studentsList = (values.students || []).join(", ");
          const teacherName = values.teacher || "";
          const subject = values.subjectName || "";
          const nameParts = [];
          if (studentsList) nameParts.push(studentsList);
          if (teacherName) nameParts.push(teacherName);
          if (subject) nameParts.push(subject);
          setTaskName(nameParts.join(" - "));
        }}
      >
        <Form.Item
          label="Loại công việc"
          name="taskType"
          initialValue="study"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "study", label: "Lịch học" },
              { value: "work", label: "Lịch làm việc" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Môn học"
          name="subjectName"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="-- Chọn môn học --"
            options={[
              { value: "Mathematics", label: "Toán" },
              { value: "Literature", label: "Ngữ văn" },
              { value: "English", label: "Tiếng Anh" },
              { value: "Physics", label: "Vật lý" },
              { value: "Chemistry", label: "Hóa học" },
              { value: "Biology", label: "Sinh học" },
              { value: "History", label: "Lịch sử" },
              { value: "Geography", label: "Địa lý" },
              { value: "CivicEducation", label: "Giáo dục công dân" },
              { value: "Informatics", label: "Tin học" },
              { value: "Technology", label: "Công nghệ" },
              { value: "PhysicalEducation", label: "Thể dục" },
              { value: "Music", label: "Âm nhạc" },
              { value: "Art", label: "Mỹ thuật" },
              { value: "DefenseEducation", label: "Giáo dục quốc phòng" },
              { value: "Science", label: "Khoa học tự nhiên" },
              { value: "SocialScience", label: "Khoa học xã hội" },
              { value: "Ethics", label: "Đạo đức" },
              { value: "CareerOrientation", label: "Hướng nghiệp" },
              { value: "Reading", label: "Đọc hiểu" },
              { value: "Writing", label: "Tập làm văn" },
              { value: "MathematicalLogic", label: "Toán tư duy" },
              { value: "ComputerScience", label: "Khoa học máy tính" },
              { value: "Programming", label: "Lập trình" },
              { value: "STEM", label: "STEM" },
              { value: "LifeSkills", label: "Kỹ năng sống" },
              { value: "EnvironmentalEducation", label: "Giáo dục môi trường" },
              { value: "MoralEducation", label: "Giáo dục đạo đức" },
              { value: "Astronomy", label: "Thiên văn học" },
              { value: "Economics", label: "Kinh tế học" },
              { value: "Psychology", label: "Tâm lý học" },
              { value: "Philosophy", label: "Triết học" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Giáo viên"
          name="teacher"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn giáo viên"
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={teachers.map((t) => ({
              key: t.id,
              value: t.email,
              label: t.label,
            }))}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.taskType !== currentValues.taskType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("taskType") === "study" && (
              <Form.Item label="Học sinh" name="students">
                <Select
                  mode="multiple"
                  placeholder="Chọn học sinh"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={students.map((s) => ({
                    key: s.id,
                    value: s.name,
                    label: s.name,
                  }))}
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item label="Tên công việc (Tự động)">
          <Input
            disabled
            value={taskName || "Chưa có - Vui lòng chọn đủ thông tin"}
            readOnly
          />
        </Form.Item>

        <Form.Item
          label="Ngày"
          name="taskDate"
          initialValue={dayjs()}
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giờ bắt đầu"
              name="startTime"
              initialValue="08:00"
              rules={[{ required: true }]}
            >
              <Input placeholder="HH:mm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giờ kết thúc"
              name="endTime"
              initialValue="10:00"
              rules={[{ required: true }]}
            >
              <Input placeholder="HH:mm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa điểm" name="taskLocation">
          <Input placeholder="Nhập địa điểm" />
        </Form.Item>

        <Form.Item label="Phụ cấp di chuyển" name="travelAllowance">
          <Input placeholder="Nhập phụ cấp di chuyển" />
        </Form.Item>

        <Form.Item label="Nhận xét" name="comment">
          <Select
            placeholder="-- Chọn nhận xét --"
            options={[
              {
                value:
                  "Student needs to improve completing assignments and mastering basic knowledge. Keep trying and ask for help when needed.",
                label: "Student needs to improve completing assignments...",
              },
              {
                value:
                  "Student has improved well, but needs to pay more attention to details and accuracy in their work.",
                label: "Student has improved well...",
              },
              {
                value:
                  "Student excels in applying knowledge. Try taking on more challenging tasks to develop further.",
                label: "Student excels in applying knowledge...",
              },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            >
              {eventToEdit ? "Cập nhật" : "Thêm công việc"}
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleViewAntd;
