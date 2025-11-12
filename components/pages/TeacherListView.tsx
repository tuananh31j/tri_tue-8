import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ScheduleEvent } from "../../types";
import { DATABASE_URL_BASE } from "@/firebase";
import {
  Button,
  Input,
  Select,
  DatePicker,
  Table,
  Modal,
  Form,
  Card,
  Statistic,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CloseOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import WrapperContent from "@/components/WrapperContent";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const TEACHER_LIST_URL = `${DATABASE_URL_BASE}/datasheet/Gi%C3%A1o_vi%C3%AAn.json`;
const SCHEDULE_URL = `${DATABASE_URL_BASE}/datasheet/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`;

interface Teacher {
  id: string;
  "Họ và tên": string;
  "Tên giáo viên"?: string;
  "Mã giáo viên"?: string;
  SĐT?: string;
  "Số điện thoại"?: string;
  Email?: string;
  "Email công ty"?: string;
  Password?: string;
  "Chuyên môn"?: string;
  "Biên chế"?: string;
  "Vị trí"?: string;
  "Ngân hàng"?: string;
  STK?: string;
  "Địa chỉ"?: string;
  Ảnh?: string;
  [key: string]: any;
}

const TeacherListView: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBienChe, setSelectedBienChe] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term to prevent excessive re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Ant Design Form instance
  const [form] = Form.useForm();

  // Populate form when editing teacher
  useEffect(() => {
    if (editingTeacher && isEditModalOpen) {
      form.setFieldsValue({
        name: editingTeacher["Họ và tên"] || "",
        phone: editingTeacher["SĐT"] || editingTeacher["Số điện thoại"] || "",
        email: editingTeacher["Email"] || editingTeacher["Email công ty"] || "",
        password: editingTeacher["Password"] || "",
        status: editingTeacher["Biên chế"] || "",
        position: editingTeacher["Vị trí"] || "Teacher",
        bank: editingTeacher["Ngân hàng"] || "",
        account: editingTeacher["STK"] || "",
        address: editingTeacher["Địa chỉ"] || "",
      });
    } else if (!editingTeacher && isEditModalOpen) {
      form.resetFields();
    }
  }, [editingTeacher, isEditModalOpen, form]);

  // 🔍 DEBUG: Component lifecycle
  useEffect(() => {
    console.log("🔄 TeacherListView Component Update:", {
      hasCurrentUser: !!currentUser,
      currentUserEmail: currentUser?.email,
      hasUserProfile: !!userProfile,
      userProfileIsAdmin: userProfile?.isAdmin,
      userProfileRole: userProfile?.role,
      userProfilePosition: userProfile?.position,
    });
  }, [currentUser, userProfile]);

  // Helper to normalize name
  const normalizeName = (name: string): string => {
    if (!name) return "";
    return name.trim().replace(/\s+/g, " ");
  };

  // Helper to get teacher name
  const getTeacherName = (teacher: Teacher): string => {
    const rawName =
      teacher["Họ và tên"] || teacher["Tên giáo viên"] || teacher["Name"] || "";
    return normalizeName(rawName);
  };

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(TEACHER_LIST_URL);
        const data = await response.json();
        if (data) {
          const teachersArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTeachers(teachersArray);
          console.log("✅ Teachers loaded:", teachersArray.length);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  // Fetch schedule events
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(SCHEDULE_URL);
        const data = await response.json();
        if (data) {
          let eventsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // 🔒 PERMISSION FILTER: Admin sees all, Teacher sees only their events
          console.log("🔍 TeacherListView Schedule Permission Debug:", {
            userEmail: currentUser?.email,
            isAdmin: userProfile?.isAdmin,
            totalEvents: eventsArray.length,
          });

          if (!userProfile?.isAdmin && currentUser?.email) {
            console.log(
              "❌ TEACHER MODE - Filtering schedule for teacher:",
              currentUser.email
            );
            eventsArray = eventsArray.filter((event) => {
              const eventEmail = event["Email giáo viên"]?.toLowerCase();
              const userEmail = currentUser.email?.toLowerCase();
              return eventEmail === userEmail;
            });
            console.log(
              `🔒 Filtered to ${eventsArray.length} events for teacher`
            );
          } else {
            console.log("✅ ADMIN MODE - Showing all schedule events");
          }

          setScheduleEvents(eventsArray);
          console.log("✅ Schedule events loaded:", eventsArray.length);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [userProfile, currentUser]);

  // Calculate total travel allowance for a teacher
  const calculateTravelAllowance = (
    teacherId: string,
    fromDate?: Date,
    toDate?: Date
  ): number => {
    const teacherEvents = scheduleEvents.filter((event) => {
      const eventTeacher = event["Teacher ID"];
      return eventTeacher === teacherId;
    });

    let filteredEvents = teacherEvents;
    if (fromDate && toDate) {
      filteredEvents = teacherEvents.filter((event) => {
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }

    let totalAllowance = 0;
    filteredEvents.forEach((event) => {
      const allowance = event["Phụ cấp di chuyển"];
      if (allowance) {
        // Remove non-numeric characters and parse
        const numericValue = parseFloat(
          allowance.toString().replace(/[^\d.]/g, "")
        );
        if (!isNaN(numericValue)) {
          totalAllowance += numericValue;
        }
      }
    });

    return totalAllowance;
  };

  // Calculate total hours for a teacher
  const calculateTeacherHours = (
    teacherId: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    console.log(`\n📊 Calculating for: "${teacherId}"`);

    const teacherEvents = scheduleEvents.filter((event) => {
      const eventTeacher = event["Teacher ID"];
      const matches = eventTeacher === teacherId;
      if (matches) {
        console.log(`  ✅ Match: "${eventTeacher}" === "${teacherId}"`);
      }
      return matches;
    });

    console.log(`  Found ${teacherEvents.length} events total`);

    let filteredEvents = teacherEvents;
    if (fromDate && toDate) {
      filteredEvents = teacherEvents.filter((event) => {
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return eventDate >= fromDate && eventDate <= toDate;
      });
      console.log(
        `  Filtered to ${
          filteredEvents.length
        } events (${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()})`
      );
    }

    let totalMinutes = 0;
    filteredEvents.forEach((event, idx) => {
      const start = event["Giờ bắt đầu"] || "0:0";
      const end = event["Giờ kết thúc"] || "0:0";
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      const minutes = endH * 60 + endM - (startH * 60 + startM);
      if (minutes > 0) {
        totalMinutes += minutes;
        if (idx < 3) {
          console.log(
            `  Event ${idx + 1}: ${start} - ${end} = ${minutes} phút`
          );
        }
      }
    });

    const result = {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      totalSessions: filteredEvents.length,
    };

    console.log(
      `  RESULT: ${result.hours}h ${result.minutes}p (${result.totalSessions} buổi)\n`
    );
    return result;
  };

  // Get teacher events by month
  const getTeacherEventsByMonth = (
    teacherId: string,
    month: number,
    year: number
  ) => {
    return scheduleEvents
      .filter((event) => {
        const eventTeacher = event["Teacher ID"];
        if (eventTeacher !== teacherId) return false;
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a["Ngày"]);
        const dateB = new Date(b["Ngày"]);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Filter teachers data
  const displayTeachers = useMemo(() => {
    console.log("🔍 TeacherListView Permission Debug:", {
      userEmail: currentUser?.email,
      userProfile: userProfile,
      isAdmin: userProfile?.isAdmin,
      role: userProfile?.role,
      position: userProfile?.position,
      teacherId: userProfile?.teacherId,
    });

    let filtered = teachers;

    // 🔒 PERMISSION FILTER: Admin sees all, Teacher sees only themselves
    if (!userProfile?.isAdmin && currentUser?.email) {
      console.log(
        "❌ TEACHER MODE ACTIVATED - Filtering teachers to self only"
      );
      console.log("🔒 Filtering teachers for teacher:", currentUser.email);
      filtered = filtered.filter((teacher) => {
        const teacherEmail = (
          teacher["Email"] ||
          teacher["Email công ty"] ||
          ""
        ).toLowerCase();
        const userEmail = currentUser.email?.toLowerCase();
        return teacherEmail === userEmail;
      });
      console.log("✅ Filtered teachers:", filtered.length);
    } else {
      console.log("✅ ADMIN MODE ACTIVATED - Showing all teachers");
    }
    // Admin sees all teachers

    // Filter by Biên chế
    if (selectedBienChe !== "all") {
      filtered = filtered.filter((t) => {
        const bienChe = t["Biên chế"] || "Chưa phân loại";
        return bienChe === selectedBienChe;
      });
    }

    // Filter by search term (using debounced value)
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((teacher) => {
        const teacherName = getTeacherName(teacher).toLowerCase();
        const phone = (
          teacher["SĐT"] ||
          teacher["Số điện thoại"] ||
          ""
        ).toLowerCase();
        const email = (
          teacher["Email"] ||
          teacher["Email công ty"] ||
          ""
        ).toLowerCase();
        const code = (teacher["Mã giáo viên"] || "").toLowerCase();

        return (
          teacherName.includes(search) ||
          phone.includes(search) ||
          email.includes(search) ||
          code.includes(search)
        );
      });
    }

    return filtered.map((teacher) => {
      const teacherName = getTeacherName(teacher);
      const fromDate = startDate ? new Date(startDate) : undefined;
      const toDate = endDate ? new Date(endDate) : undefined;
      const stats = calculateTeacherHours(teacher.id, fromDate, toDate);
      const travelAllowance = calculateTravelAllowance(
        teacher.id,
        fromDate,
        toDate
      );
      return {
        ...teacher,
        ...stats,
        totalTravelAllowance: travelAllowance,
      };
    });
  }, [
    teachers,
    scheduleEvents,
    startDate,
    endDate,
    selectedBienChe,
    debouncedSearchTerm, // Use debounced value instead of raw searchTerm
    currentUser,
    userProfile,
  ]);

  // Group teachers by Biên chế (memoized for performance)
  const groupedTeachers = useMemo(() => {
    return displayTeachers.reduce(
      (acc, teacher) => {
        const bienChe = teacher["Biên chế"] || "Chưa phân loại";
        if (!acc[bienChe]) {
          acc[bienChe] = [];
        }
        acc[bienChe].push(teacher);
        return acc;
      },
      {} as Record<string, typeof displayTeachers>
    );
  }, [displayTeachers]);

  const sortedGroups = useMemo(
    () => Object.keys(groupedTeachers).sort(),
    [groupedTeachers]
  );

  // Memoized statistics for better performance
  const totalStats = useMemo(
    () => ({
      totalTeachers: displayTeachers.length,
      totalGroups: sortedGroups.length,
      totalSessions: displayTeachers.reduce(
        (sum, t) => sum + t.totalSessions,
        0
      ),
      totalHours: Math.floor(
        displayTeachers.reduce((sum, t) => sum + t.hours * 60 + t.minutes, 0) /
          60
      ),
    }),
    [displayTeachers, sortedGroups]
  );

  const handleEditTeacher = (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    setEditingTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleDeleteTeacher = async (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Xác nhận xoá",
      content: `Bạn có chắc là muốn xoá giáo viên "${getTeacherName(
        teacher
      )}"?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const url = `${DATABASE_URL_BASE}/datasheet/datasheet/Gi%C3%A1o_vi%C3%AAn/${teacher.id}.json`;
          const response = await fetch(url, {
            method: "DELETE",
          });
          if (response.ok) {
            setTeachers(teachers.filter((t) => t.id !== teacher.id));
            Modal.success({ content: "Xoá giáo viên thành công!" });
          }
        } catch (error) {
          console.error("Error deleting teacher:", error);
          Modal.error({ content: "Xoá giáo viên thất bại" });
        }
      },
    });
  };

  const handleSaveTeacher = async (values: any) => {
    try {
      const isNew = !editingTeacher?.id;

      // Validate duplicate email
      if (values.email && values.email.trim()) {
        const emailToCheck = values.email.trim().toLowerCase();
        const duplicateTeacher = teachers.find((t) => {
          const teacherEmail = (
            t["Email"] ||
            t["Email công ty"] ||
            ""
          ).toLowerCase();
          // Skip current teacher when editing
          if (editingTeacher?.id && t.id === editingTeacher.id) {
            return false;
          }
          return teacherEmail === emailToCheck;
        });

        if (duplicateTeacher) {
          message.error("Email đã tồn tại");
          return;
        }
      }

      // Auto-generate Teacher Code if adding new teacher
      let teacherCode = editingTeacher?.["Mã giáo viên"] || "";
      if (isNew) {
        const existingCodes = teachers
          .map((t) => t["Mã giáo viên"])
          .filter((code) => code && code.startsWith("GV"))
          .map((code) => parseInt(code.replace("GV", "")) || 0);
        const maxNumber =
          existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
        teacherCode = `GV${String(maxNumber + 1).padStart(3, "0")}`;
      }

      const teacherData: Partial<Teacher> = {
        "Họ và tên": values.name,
        "Mã giáo viên": teacherCode,
        SĐT: values.phone,
        Email: values.email,
        "Biên chế": values.status,
        "Vị trí": values.position || "Teacher",
        "Ngân hàng": values.bank,
        STK: values.account,
        "Địa chỉ": values.address,
      };

      // Only update password if a new one is provided
      if (values.password && values.password.trim()) {
        teacherData["Password"] = values.password.trim();
      }

      // Preserve the ID if editing an existing teacher
      if (editingTeacher?.id) {
        teacherData.id = editingTeacher.id;
      }

      if (isNew) {
        // Add new teacher
        console.log("📤 Adding new teacher to Firebase:", teacherData);
        const response = await fetch(TEACHER_LIST_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Teacher added to Firebase:", data);
          const newTeacher = { id: data.name, ...teacherData } as Teacher;
          setTeachers([...teachers, newTeacher]);
          setEditModalOpen(false);
          setEditingTeacher(null);
          form.resetFields();
          Modal.success({ content: "Thêm giáo viên thành công!" });
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Lưu giáo viên thất bại. Mã lỗi:",
            response.status,
            errorText
          );
          Modal.error({
            content: `Lưu giáo viên thất bại. Mã lỗi: ${response.status}`,
          });
        }
      } else {
        // Update existing teacher
        const url = `${DATABASE_URL_BASE}/datasheet/Gi%C3%A1o_vi%C3%AAn/${teacherData.id}.json`;
        console.log("📤 Updating teacher:", teacherData.id, teacherData);
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });

        if (response.ok) {
          console.log("✅ Teacher updated in Firebase successfully");
          setTeachers(
            teachers.map((t) =>
              t.id === teacherData.id ? { ...t, ...teacherData } : t
            )
          );
          setEditModalOpen(false);
          setEditingTeacher(null);
          form.resetFields();
          Modal.success({ content: "Cập nhật thành công!" });
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Cập nhật giáo viên thất bại. Mã lỗi:",
            response.status,
            errorText
          );
          Modal.error({
            content: `Cập nhật giáo viên thất bại. Mã lỗi: ${response.status}`,
          });
        }
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      Modal.error({ content: "Lưu giáo viên thất bại: " + error });
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setEditModalOpen(true);
  };

  // Memoized search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Print report function for teachers
  const printReport = (teacher: Teacher, events: ScheduleEvent[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const teacherName = getTeacherName(teacher);
    const totalHours = calculateTeacherHours(
      teacherName,
      new Date(selectedYear, selectedMonth, 1),
      new Date(selectedYear, selectedMonth + 1, 0)
    );

    const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Phiếu báo giờ dạy - ${teacherName}</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 0.5cm;
                    }
                    @media print {
                        body {
                            margin: 0;
                            font-size: 12pt;
                        }
                        h1 { font-size: 24pt !important; }
                        .company-name { font-size: 16pt !important; }
                        h2 { font-size: 16pt !important; }
                        .info-label, .info-value { font-size: 13pt !important; }
                        th, td {
                            padding: 10px !important;
                            font-size: 11pt !important;
                        }
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        width: 100%;
                        max-width: 20cm;
                        margin: 0 auto;
                        padding: 0.5cm;
                        background: white;
                        color: #000;
                        font-size: 13pt;
                    }
                    .header {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        border-bottom: 4px solid #36797f;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo { max-width: 140px; height: 140px; object-fit: contain; }
                    .header-center { flex: 1; text-align: center; padding: 0 20px; }
                    .header-right { text-align: right; min-width: 140px; }
                    h1 {
                        color: #36797f;
                        margin: 15px 0 8px 0;
                        font-size: 42px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .company-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #000;
                        margin: 5px 0;
                    }
                    .month-year {
                        font-size: 20px;
                        color: #666;
                        font-weight: normal;
                    }
                    h2 {
                        color: #36797f;
                        font-size: 22px;
                        margin-top: 35px;
                        margin-bottom: 18px;
                        font-weight: bold;
                        text-transform: uppercase;
                        border-bottom: 3px solid #36797f;
                        padding-bottom: 8px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 35px;
                        padding: 0;
                    }
                    .info-item { margin: 10px 0; }
                    .info-label { font-weight: bold; color: #333; font-size: 18px; }
                    .info-value { color: #000; font-size: 20px; }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 25px 0;
                    }
                    th, td {
                        border: 2px solid #000;
                        padding: 12px;
                        text-align: left;
                        font-size: 15px;
                    }
                    th {
                        background: #36797f;
                        color: white;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .summary {
                        margin: 35px 0;
                        padding: 0;
                    }
                    .summary-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #36797f;
                        text-transform: uppercase;
                        margin-bottom: 25px;
                        border-bottom: 3px solid #36797f;
                        padding-bottom: 8px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 25px;
                        text-align: center;
                    }
                    .summary-item {
                        padding: 20px;
                        border: 3px solid #ddd;
                    }
                    .summary-value {
                        font-size: 42px;
                        font-weight: bold;
                        color: #36797f;
                    }
                    .summary-label {
                        color: #333;
                        margin-top: 10px;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 60px;
                        padding-top: 25px;
                        border-top: 3px solid #36797f;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 50px;
                    }
                    .signature {
                        text-align: center;
                    }
                    .signature p {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .signature-line {
                        margin-top: 70px;
                        padding-top: 5px;
                        font-size: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
          <span className="text-2xl text-white font-extrabold">Trí Tuệ 8+</span>
                    <div class="header-center">
                        <h1>BÁO CÁO GIỜ GIẢNG DẠY</h1>
                        <p class="company-name">Trí Tuệ 8+</p>
                    </div>
                    <div class="header-right">
                        <p class="month-year">${months[selectedMonth]}</p>
                        <p class="month-year">${selectedYear}</p>
                    </div>
                </div>

                <h2>Teacher Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Họ và tên đầy đủ:</span>
                        <span class="info-value">${teacherName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Số điện thoại:</span>
                        <span class="info-value">${
                          teacher["SĐT"] || teacher["Số điện thoại"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${
                          teacher["Email"] || teacher["Email công ty"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tình trạng việc làm:</span>
                        <span class="info-value">${
                          teacher["Biên chế"] || "N/A"
                        }</span>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-title">BÁO CÁO GIỜ GIẢNG DẠY</div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-value">${
                              totalHours.totalSessions
                            }</div>
                            <div class="summary-label">Total Sessions</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${totalHours.hours}h ${
                              totalHours.minutes
                            }m</div>
                            <div class="summary-label">Total Time</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${
                              events.length > 0 ? "Active" : "Inactive"
                            }</div>
                            <div class="summary-label">Trạng thái</div>
                        </div>
                    </div>
                </div>

                <h2>Chi tiết buổi giảng dạy</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Thời lượng</th>
                            <th>Nội dung</th>
                            <th>Học sinh</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events
                          .map((event, index) => {
                            const start = event["Giờ bắt đầu"];
                            const end = event["Giờ kết thúc"];
                            let duration = "-";
                            if (start && end) {
                              const [startH, startM] = start
                                .split(":")
                                .map(Number);
                              const [endH, endM] = end.split(":").map(Number);
                              const totalMinutes =
                                endH * 60 + endM - (startH * 60 + startM);
                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;
                              duration =
                                minutes > 0
                                  ? hours + "h " + minutes + "p"
                                  : hours + "h";
                            }
                            return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${new Date(
                                  event["Ngày"]
                                ).toLocaleDateString("vi-VN")}</td>
                                <td>${start} - ${end}</td>
                                <td style="font-weight: bold;">${duration}</td>
                                <td>${event["Tên công việc"]}</td>
                                <td>${event["Học sinh"] || "N/A"}</td>
                            </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>

                <div class="footer">
                    <div class="signature">
                        <p><strong>Giáo viên</strong></p>
                        <div class="signature-line">Chữ ký</div>
                    </div>
                    <div class="signature">
                        <p><strong>Quản lý</strong></p>
                        <div class="signature-line">Chữ ký</div>
                    </div>
                </div>

                <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
                    Xuất phiếu ngày: ${new Date().toLocaleDateString(
                      "vi-VN"
                    )} - Trí Tuệ 8+
                </p>
            </body>
            </html>
        `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <WrapperContent
      title="Quản lý giáo viên"
      toolbar={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAddTeacher}
          style={{ backgroundColor: "#36797f" }}
        >
          Thêm giáo viên mới
        </Button>
      }
    >
      {/* Search Box */}
      <Card className="mb-6" title="Tìm kiếm giáo viên">
        <Input
          placeholder="🔍 Tìm kiếm theo tên, mã giáo viên, số điện thoại, email..."
          value={searchTerm}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          suffix={
            searchTerm && (
              <ClearOutlined
                onClick={handleClearSearch}
                style={{ cursor: "pointer", color: "#999" }}
              />
            )
          }
          size="large"
          allowClear
        />
        {debouncedSearchTerm && (
          <Text type="secondary" className="mt-2 block">
            Tìm thấy{" "}
            <Text strong style={{ color: "#36797f" }}>
              {displayTeachers.length}
            </Text>{" "}
            giáo viên
          </Text>
        )}
      </Card>

      {/* Filters */}
      <Card title={<Text strong>Bộ lọc</Text>} className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong className="block mb-2">
                Tháng
              </Text>
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value)}
                style={{ width: "100%" }}
                size="large"
              >
                {months.map((month, index) => (
                  <Option key={index} value={index}>
                    {month}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong className="block mb-2">
                Năm
              </Text>
              <Select
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                style={{ width: "100%" }}
                size="large"
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong className="block mb-2">
                Tình trạng biên chế
              </Text>
              <Select
                value={selectedBienChe}
                onChange={(value) => setSelectedBienChe(value)}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="all">Tất cả trạng thái</Option>
                {[
                  ...new Set(
                    teachers.map((t) => t["Biên chế"] || "Unclassified")
                  ),
                ]
                  .sort()
                  .map((bienChe) => (
                    <Option key={bienChe} value={bienChe}>
                      {bienChe}
                    </Option>
                  ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong className="block mb-2">
                Từ ngày
              </Text>
              <DatePicker
                value={startDate ? dayjs(startDate) : null}
                onChange={(date) =>
                  setStartDate(date ? date.format("YYYY-MM-DD") : "")
                }
                style={{ width: "100%" }}
                size="large"
              />
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong className="block mb-2">
                Đến ngày
              </Text>
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={(date) =>
                  setEndDate(date ? date.format("YYYY-MM-DD") : "")
                }
                style={{ width: "100%" }}
                size="large"
              />
            </div>
          </Col>
        </Row>
        {(startDate || endDate) && (
          <Button
            danger
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="mt-4"
          >
            Xóa bộ lọc ngày
          </Button>
        )}
      </Card>

      {/* Teachers Grid */}
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-y-6 mb-12">
          {/* Summary Statistics */}
          <Card
            style={{
              background: "linear-gradient(to right, #36797f, #36797f)",
            }}
            className="shadow-lg"
          >
            <Title
              level={3}
              className="text-center mb-6"
              style={{ color: "white" }}
            >
              Tổng quan
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <Card
                  className="text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                  }}
                >
                  <Statistic
                    value={totalStats.totalTeachers}
                    valueStyle={{
                      color: "white",
                      fontSize: 32,
                      fontWeight: "bold",
                    }}
                  />
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Tổng giáo viên
                  </Text>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card
                  className="text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                  }}
                >
                  <Statistic
                    value={totalStats.totalGroups}
                    valueStyle={{
                      color: "white",
                      fontSize: 32,
                      fontWeight: "bold",
                    }}
                  />
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Loại biên chế
                  </Text>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card
                  className="text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                  }}
                >
                  <Statistic
                    value={totalStats.totalSessions}
                    valueStyle={{
                      color: "white",
                      fontSize: 32,
                      fontWeight: "bold",
                    }}
                  />
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Tổng buổi dạy
                  </Text>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card
                  className="text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                  }}
                >
                  <Statistic
                    value={`${totalStats.totalHours}h`}
                    valueStyle={{
                      color: "white",
                      fontSize: 32,
                      fontWeight: "bold",
                    }}
                  />
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Tổng giờ dạy
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>

          {sortedGroups.map((bienChe) => {
            const teachersInGroup = groupedTeachers[bienChe];

            const columns = [
              {
                title: "#",
                key: "index",
                width: 60,
                render: (_: any, __: any, index: number) => index + 1,
              },
              {
                title: "Họ tên",
                key: "name",
                render: (_: any, teacher: any) => (
                  <Text strong>{getTeacherName(teacher)}</Text>
                ),
              },
              {
                title: "Số điện thoại",
                dataIndex: "SĐT",
                key: "phone",
                render: (_: any, teacher: any) =>
                  teacher["SĐT"] || teacher["Số điện thoại"] || "-",
              },
              {
                title: "Email",
                key: "email",
                render: (_: any, teacher: any) =>
                  teacher["Email"] || teacher["Email công ty"] || "-",
              },
              {
                title: "Tổng giờ dạy",
                key: "hours",
                align: "center" as const,
                render: (_: any, teacher: any) => (
                  <Text strong style={{ color: "#36797f" }}>
                    {teacher.hours}h {teacher.minutes}p
                  </Text>
                ),
              },
              {
                title: "Buổi dạy",
                key: "sessions",
                align: "center" as const,
                render: (_: any, teacher: any) => (
                  <Tag color="red" style={{ fontWeight: "bold" }}>
                    {teacher.totalSessions} Buổi
                  </Tag>
                ),
              },
              {
                title: "Trợ cấp đi lại",
                key: "allowance",
                align: "center" as const,
                render: (_: any, teacher: any) => (
                  <Text strong style={{ color: "#52c41a" }}>
                    {teacher.totalTravelAllowance
                      ? teacher.totalTravelAllowance.toLocaleString("vi-VN")
                      : "0"}{" "}
                    VNĐ
                  </Text>
                ),
              },
              {
                title: "Hành động",
                key: "actions",
                align: "center" as const,
                render: (_: any, teacher: any) => (
                  <Space direction="vertical">
                    <Button
                      type="default"
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setModalOpen(true);
                      }}
                      style={{ borderColor: "#36797f", color: "#36797f" }}
                    >
                      Xem
                    </Button>
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={(e) => handleEditTeacher(e, teacher)}
                      style={{ borderColor: "#1890ff", color: "#1890ff" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={(e) => handleDeleteTeacher(e, teacher)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ];

            return (
              <Card
                key={bienChe}
                className="mb-6"
                title={
                  <div className="flex items-center justify-between">
                    <Space>
                      <Text
                        className="text-white"
                        color="white"
                        strong
                        style={{ fontSize: 18, color: "white" }}
                      >
                        {bienChe}
                      </Text>
                    </Space>
                    <Tag
                      style={{
                        backgroundColor: "#36797f",
                        color: "white",
                        fontSize: 12,
                      }}
                    >
                      {teachersInGroup.length} giáo viên
                    </Tag>
                  </div>
                }
                headStyle={{
                  background: "linear-gradient(to right, #36797f, #36797f)",
                  color: "white",
                }}
              >
                <Table
                  columns={columns}
                  dataSource={teachersInGroup}
                  pagination={false}
                  scroll={{ y: 600 }}
                  rowKey={(record) =>
                    record["Mã giáo viên"] ||
                    record["Họ và tên"] ||
                    Math.random().toString()
                  }
                  rowClassName="hover:bg-red-50"
                />
              </Card>
            );
          })}
        </div>
      )}

      {/* Teacher Detail Modal */}
      <Modal
        open={isModalOpen && !!selectedTeacher}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
        title={
          <div>
            <Title level={4} style={{ margin: 0, color: "#36797f" }}>
              {selectedTeacher && getTeacherName(selectedTeacher)}
            </Title>
            <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              SĐT:{" "}
              {selectedTeacher &&
                (selectedTeacher["SĐT"] ||
                  selectedTeacher["Số điện thoại"] ||
                  "N/A")}
            </Text>
          </div>
        }
        modalRender={(modal) => (
          <div
            style={{
              background: "linear-gradient(to right, #36797f, #36797f)",
              borderRadius: 8,
            }}
          >
            {modal}
          </div>
        )}
        styles={{
          header: {
            background: "transparent",
            color: "white",
            borderBottom: "none",
          },
          body: {
            background: "white",
            borderRadius: "0 0 8px 8px",
          },
        }}
      >
        {selectedTeacher && (
          <>
            {/* Teacher Info */}
            <Row gutter={16} className="mb-6">
              <Col span={12}>
                <Card className="text-center">
                  <Statistic
                    value={`${selectedTeacher.hours}h ${selectedTeacher.minutes}p`}
                    valueStyle={{
                      color: "#36797f",
                      fontSize: 28,
                      fontWeight: "bold",
                    }}
                  />
                  <Text type="secondary">Tổng giờ dạy</Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  className="text-center"
                  style={{ backgroundColor: "#fff1f0" }}
                >
                  <Statistic
                    value={selectedTeacher.totalSessions}
                    valueStyle={{
                      color: "#36797f",
                      fontSize: 28,
                      fontWeight: "bold",
                    }}
                  />
                  <Text type="secondary">Tổng số buổi dạy</Text>
                </Card>
              </Col>
            </Row>

            {/* Sessions List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Title level={5}>
                  📅 Lịch giảng dạy - {months[selectedMonth]} {selectedYear}
                </Title>
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={() =>
                    printReport(
                      selectedTeacher,
                      getTeacherEventsByMonth(
                        selectedTeacher.id,
                        selectedMonth,
                        selectedYear
                      )
                    )
                  }
                  style={{ backgroundColor: "#36797f" }}
                >
                  In phiếu báo
                </Button>
              </div>
              {(() => {
                const events = getTeacherEventsByMonth(
                  selectedTeacher.id,
                  selectedMonth,
                  selectedYear
                );
                if (events.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <Text type="secondary">
                        Không có buổi dạy nào trong tháng này
                      </Text>
                    </div>
                  );
                }
                return (
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    {events.map((event, idx) => (
                      <Card
                        key={idx}
                        size="small"
                        style={{ borderLeft: "4px solid #36797f" }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Text strong>{event["Tên công việc"]}</Text>
                          <Text type="secondary">
                            {new Date(event["Ngày"]).toLocaleDateString(
                              "vi-VN"
                            )}
                          </Text>
                        </div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text type="secondary">
                              {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
                            </Text>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary">
                              {event["Học sinh"] || "N/A"}
                            </Text>
                          </Col>
                        </Row>
                        {event["Nhận xét"] && (
                          <Text type="secondary" italic className="mt-2 block">
                            {event["Nhận xét"]}
                          </Text>
                        )}
                      </Card>
                    ))}
                  </Space>
                );
              })()}
            </div>
          </>
        )}
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingTeacher(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
        title={
          <Title level={4} style={{ margin: 0, color: "#36797f" }}>
            {editingTeacher && editingTeacher.id
              ? "Chỉnh sửa giáo viên"
              : "Thêm giáo viên mới"}
          </Title>
        }
        modalRender={(modal) => (
          <div style={{ background: "#36797f", borderRadius: 8 }}>{modal}</div>
        )}
        styles={{
          header: {
            background: "transparent",
            color: "white",
            borderBottom: "none",
          },
          body: {
            background: "white",
            borderRadius: "0 0 8px 8px",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveTeacher}
          initialValues={{
            position: "Teacher",
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input size="large" type="tel" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input size="large" type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: !editingTeacher?.id,
                    message: "Vui lòng nhập mật khẩu",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={
                    editingTeacher?.id
                      ? "Để trống nếu không đổi mật khẩu"
                      : "Nhập mật khẩu"
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tình trạng biên chế" name="status">
                <Select size="large" placeholder="Chọn tình trạng">
                  <Option value="Full-time">Toàn thời gian</Option>
                  <Option value="Part-time">Bán thời gian</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vị trí"
                name="position"
                rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
              >
                <Select size="large">
                  <Option value="Teacher">Giáo viên</Option>
                  <Option value="Admin">Quản trị viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngân hàng" name="bank">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số tài khoản" name="account">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Địa chỉ" name="address">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                size="large"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingTeacher(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ backgroundColor: "#36797f" }}
              >
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </WrapperContent>
  );
};

export default TeacherListView;
