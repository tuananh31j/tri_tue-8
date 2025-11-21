import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ScheduleEvent } from "../../types";
import { DATABASE_URL_BASE } from "@/firebase";
import {
  Button,
  Input,
  Table,
  Card,
  Spin,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Select,
  Statistic,
  Typography,
  Row,
  Col,
  Space,
  Tag,
  message,
  Popconfirm,
  Dropdown,
  Tabs,
} from "antd";
import type { MenuProps } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClearOutlined,
  UserOutlined,
  MoreOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import WrapperContent from "@/components/WrapperContent";
import Loader from "@/components/Loader";
import { Empty } from "antd/lib";
import StudentReportButton from "@/components/StudentReportButton";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const { TabPane } = Tabs;
const { Text } = Typography;

const STUDENT_LIST_URL = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`;
const SCHEDULE_URL = `${DATABASE_URL_BASE}/datasheet/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`;
const ATTENDANCE_SESSIONS_URL = `${DATABASE_URL_BASE}/datasheet/%C4%90i%E1%BB%83m_danh_sessions.json`;
const EXTENSION_HISTORY_URL = `${DATABASE_URL_BASE}/datasheet/Gia_h%E1%BA%A1n.json`;

interface Student {
  id: string;
  "Họ và tên": string;
  "Mã học sinh"?: string;
  "Ngày sinh"?: string;
  "Số điện thoại"?: string;
  Email?: string;
  "Trạng thái"?: string;
  "Địa chỉ"?: string;
  "Số giờ đã gia hạn"?: number;
  "Số giờ còn lại"?: number;
  "Số giờ đã học"?: number;
  [key: string]: any;
}

const StudentListView: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExtendModalOpen, setExtendModalOpen] = useState(false);
  const [extendingStudent, setExtendingStudent] = useState<Student | null>(
    null
  );
  const [currentUsername, setCurrentUsername] = useState<string>("Admin"); // Will be updated with actual user
  const [extensionHistory, setExtensionHistory] = useState<any[]>([]);
  const [isEditExtensionModalOpen, setEditExtensionModalOpen] = useState(false);
  const [editingExtension, setEditingExtension] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  // Form instances
  const [editStudentForm] = Form.useForm();
  const [extendHoursForm] = Form.useForm();
  const [editExtensionForm] = Form.useForm();

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Add cache-busting parameter
        const response = await fetch(
          `${STUDENT_LIST_URL}?_=${new Date().getTime()}`,
          {
            cache: "no-cache",
          }
        );
        const data = await response.json();
        if (data) {
          const studentsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          console.log("📚 Students fetched:", studentsArray.length);
          console.log("📊 Sample student data:", studentsArray[0]);
          console.log(
            "🔑 Student IDs:",
            studentsArray.map((s) => ({ id: s.id, name: s["Họ và tên"] }))
          );
          setStudents(studentsArray);
        } else {
          console.warn("⚠️ No students data from Firebase");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch attendance sessions (for calculating hours and sessions)
  useEffect(() => {
    const fetchAttendanceSessions = async () => {
      try {
        const response = await fetch(ATTENDANCE_SESSIONS_URL);
        const data = await response.json();
        if (data) {
          const sessionsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          console.log("📊 Attendance sessions loaded:", sessionsArray.length);
          setAttendanceSessions(sessionsArray);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance sessions:", error);
        setLoading(false);
      }
    };
    fetchAttendanceSessions();
  }, []);

  // Fetch schedule events (for display purposes)
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

          // 🔒 PERMISSION FILTER: Teachers only see their own events
          // ⚠️ TEMPORARILY DISABLED - Everyone can see all data
          // if (userProfile?.role === 'teacher' && currentUser?.email) {
          //     console.log('🔒 Filtering schedule for teacher:', currentUser.email);
          //     eventsArray = eventsArray.filter(event => {
          //         const eventEmail = event["Email giáo viên"]?.toLowerCase();
          //         const userEmail = currentUser.email?.toLowerCase();
          //         return eventEmail === userEmail;
          //     });
          // }

          setScheduleEvents(eventsArray);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [userProfile, currentUser]);

  // Fetch extension history
  useEffect(() => {
    const fetchExtensionHistory = async () => {
      try {
        const response = await fetch(
          `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
          {
            cache: "no-cache",
          }
        );
        const data = await response.json();
        if (data) {
          const historyArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Sort by timestamp descending
          historyArray.sort(
            (a, b) =>
              new Date(b.Timestamp || 0).getTime() -
              new Date(a.Timestamp || 0).getTime()
          );
          console.log("📋 Extension history fetched:", historyArray.length);
          setExtensionHistory(historyArray);
        }
      } catch (error) {
        console.error("Error fetching extension history:", error);
      }
    };
    fetchExtensionHistory();
  }, []);

  // Update edit student form when editingStudent changes
  useEffect(() => {
    if (editingStudent && isEditModalOpen) {
      editStudentForm.setFieldsValue({
        name: editingStudent["Họ và tên"] || "",
        dob: editingStudent["Ngày sinh"] || "",
        phone: editingStudent["Số điện thoại"] || "",
        status: editingStudent["Trạng thái"] || "",
        address: editingStudent["Địa chỉ"] || "",
        password: editingStudent["Mật khẩu"] || "",
      });
    } else if (!editingStudent && isEditModalOpen) {
      // Reset form when adding new student
      editStudentForm.resetFields();
    }
  }, [editingStudent, isEditModalOpen, editStudentForm]);

  // Update extend hours form when extendingStudent changes
  useEffect(() => {
    if (extendingStudent && isExtendModalOpen) {
      extendHoursForm.setFieldsValue({
        studentName: extendingStudent["Họ và tên"] || "",
        additionalHours: 0,
      });
    } else if (!extendingStudent && isExtendModalOpen) {
      extendHoursForm.resetFields();
    }
  }, [extendingStudent, isExtendModalOpen, extendHoursForm]);

  // Update edit extension form when editingExtension changes
  useEffect(() => {
    if (editingExtension && isEditExtensionModalOpen) {
      editExtensionForm.setFieldsValue({
        newHours: editingExtension["Giờ nhập thêm"] || 0,
        reason: "",
      });
    } else if (!editingExtension && isEditExtensionModalOpen) {
      // Reset form
      editExtensionForm.resetFields();
    }
  }, [editingExtension, isEditExtensionModalOpen, editExtensionForm]);

  // Calculate total extended hours from Gia_hạn table
  const calculateTotalExtendedHours = (studentId: string): number => {
    let total = 0;
    extensionHistory.forEach((record) => {
      if (record.studentId === studentId) {
        total += Number(record["Giờ nhập thêm"]) || 0;
      }
    });
    return total;
  };

  // Calculate total hours for a student from Điểm_danh_sessions (matching StudentReport logic)
  const calculateStudentHours = (
    studentId: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    // Filter attendance sessions where this student has a record
    let studentSessions = attendanceSessions.filter((session) => {
      // Check if student has attendance record in this session
      const hasAttendance = session["Điểm danh"]?.some(
        (record: any) => record["Student ID"] === studentId
      );
      return hasAttendance;
    });

    // Apply date filter if provided
    if (fromDate && toDate) {
      studentSessions = studentSessions.filter((session) => {
        if (!session["Ngày"]) return false;
        const sessionDate = new Date(session["Ngày"]);
        return sessionDate >= fromDate && sessionDate <= toDate;
      });
    }

    let totalMinutes = 0;
    let presentSessions = 0;
    let absentSessions = 0;

    studentSessions.forEach((session) => {
      const record = session["Điểm danh"]?.find(
        (r: any) => r["Student ID"] === studentId
      );

      if (record) {
        // Only count hours if student was present
        if (record["Có mặt"]) {
          const start = session["Giờ bắt đầu"] || "0:0";
          const end = session["Giờ kết thúc"] || "0:0";
          const [startH, startM] = start.split(":").map(Number);
          const [endH, endM] = end.split(":").map(Number);
          const minutes = endH * 60 + endM - (startH * 60 + startM);
          if (minutes > 0) totalMinutes += minutes;
          presentSessions++;
        } else {
          absentSessions++;
        }
      }
    });

    console.log(`📊 Student ${studentId} stats:`, {
      totalSessions: studentSessions.length,
      presentSessions,
      absentSessions,
      totalMinutes,
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    });

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      totalSessions: studentSessions.length,
      presentSessions,
      absentSessions,
    };
  };

  // Get student events by date range (using student ID from attendance records)
  const getStudentEventsByDateRange = (
    studentId: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    // If no date range specified, use current month
    if (!fromDate || !toDate) {
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return attendanceSessions
      .filter((session) => {
        // Check if student has attendance record in this session
        const hasAttendance = session["Điểm danh"]?.some(
          (record: any) => record["Student ID"] === studentId
        );
        if (!hasAttendance) return false;
        if (!session["Ngày"]) return false;
        const sessionDate = new Date(session["Ngày"]);
        return sessionDate >= fromDate! && sessionDate <= toDate!;
      })
      .sort((a, b) => {
        const dateA = new Date(a["Ngày"]);
        const dateB = new Date(b["Ngày"]);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Filter students data
  const displayStudents = useMemo(() => {
    console.log("🔍 StudentListView Permission Debug:", {
      userEmail: currentUser?.email,
      userProfile: userProfile,
      isAdmin: userProfile?.isAdmin,
      role: userProfile?.role,
      position: userProfile?.position,
    });

    let filteredStudents = students;

    // 🔒 PERMISSION FILTER: Admin sees all, Teacher sees only their students
    if (!userProfile?.isAdmin && userProfile?.teacherName) {
      console.log("❌ TEACHER MODE ACTIVATED - Filtering students");
      const teacherName = userProfile.uid;

      // Get unique student names from events taught by this teacher
      const teacherStudentNames = new Set<string>();
      scheduleEvents.forEach((event) => {
        if (event["Teacher ID"] === teacherName && event["Học sinh"]) {
          event["Học sinh"].forEach((name) => teacherStudentNames.add(name));
        }
      });

      console.log(
        `👨‍🏫 Teacher ${teacherName} students:`,
        Array.from(teacherStudentNames)
      );

      // Filter students to only show those in teacher's events
      filteredStudents = students.filter((student) =>
        teacherStudentNames.has(student["Họ và tên"])
      );
      console.log(
        `🔒 Filtered to ${filteredStudents.length} students for teacher`
      );
    } else {
      console.log("✅ ADMIN MODE ACTIVATED - Showing all students");
    }
    // Admin sees all students

    console.log(
      `📊 Final student count: ${filteredStudents.length} / ${students.length}`
    );

    return filteredStudents
      .map((student) => {
        const fromDate = startDate ? new Date(startDate) : undefined;
        const toDate = endDate ? new Date(endDate) : undefined;
        const stats = calculateStudentHours(
          student.id, // Use student ID instead of name
          fromDate,
          toDate
        );

        // Tính tổng giờ đã gia hạn từ bảng Gia_hạn (không dùng từ Students)
        const hoursExtendedFromHistory = calculateTotalExtendedHours(
          student.id
        );
        const totalStudiedHours = stats.hours + stats.minutes / 60;
        const hoursRemaining = Math.max(
          0,
          hoursExtendedFromHistory - totalStudiedHours
        );

        return {
          ...student,
          ...stats,
          hoursExtended: hoursExtendedFromHistory, // Override với giá trị từ bảng Gia_hạn
          hoursRemaining: hoursRemaining,
        };
      })
      .filter((student) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          student["Họ và tên"]?.toLowerCase().includes(search) ||
          student["Mã học sinh"]?.toLowerCase().includes(search) ||
          student["Số điện thoại"]?.toLowerCase().includes(search) ||
          student["Email"]?.toLowerCase().includes(search)
        );
      });
  }, [
    students,
    attendanceSessions,
    startDate,
    endDate,
    searchTerm,
    extensionHistory,
    userProfile,
    currentUser,
  ]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleEditStudent = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setEditingStudent(student);
    setEditModalOpen(true);
  };

  const handleDeleteStudent = async (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete student "${student["Họ và tên"]}"?`
      )
    ) {
      try {
        // Get auth token
        if (!currentUser) {
          message.error("Bạn phải đăng nhập để xóa học sinh");
          return;
        }

        const url = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${student.id}.json`;
        const response = await fetch(url, {
          method: "DELETE",
        });
        if (response.ok) {
          setStudents(students.filter((s) => s.id !== student.id));
          message.success("Xóa học sinh thành công!");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        message.error("Xóa học sinh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleSaveStudent = async (studentData: Partial<Student>) => {
    try {
      const isNew = !studentData.id;

      console.log("💾 handleSaveStudent called:", {
        isNew,
        editingStudent,
        editingStudentId: editingStudent?.id,
        studentDataId: studentData.id,
        studentData,
      });

      if (isNew) {
        // Add new student - Remove id field from studentData
        if (!currentUser) {
          message.error("Bạn phải đăng nhập để thêm học sinh");
          return;
        }
        const { id, ...dataWithoutId } = studentData as any;

        console.log("📤 Sending new student data:", dataWithoutId);

        const response = await fetch(`${STUDENT_LIST_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataWithoutId),
        });

        console.log(
          "📡 Response status:",
          response.status,
          response.statusText
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Student added to Firebase:", data);
          const newStudent = { id: data.name, ...dataWithoutId } as Student;
          setStudents([...students, newStudent]);
          setEditModalOpen(false);
          setEditingStudent(null);
          message.success("Thêm học sinh thành công!");
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to add student. Status:",
            response.status,
            errorText
          );
          message.error(
            `Xảy ra lỗi khi thêm học sinh. Trạng thái: ${response.status}\n${errorText}`
          );
        }
      } else {
        // Check if Hours Extended changed
        const oldHours = Number(editingStudent["Số giờ đã gia hạn"]) || 0;
        const newHours = Number(studentData["Số giờ đã gia hạn"]) || 0;
        const hoursChanged = oldHours !== newHours;

        console.log("🔍 Checking Hours Extended change:", {
          oldHours,
          newHours,
          changed: hoursChanged,
        });

        // Update existing student
        if (!currentUser) {
          message.error("Bạn phải đăng nhập để cập nhật học sinh");
          return;
        }
        const url = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${studentData.id}.json`;
        console.log("📤 Updating student:", studentData.id, studentData);
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (response.ok) {
          console.log("✅ Student updated in Firebase successfully");

          // If Hours Extended changed, log it in Extension History
          if (hoursChanged) {
            console.log("📝 Creating adjustment log for Hours Extended change");

            // Calculate current studied hours
            const stats = calculateStudentHours(editingStudent["Họ và tên"]);
            const totalStudiedHours = stats.hours + stats.minutes / 60;
            const hoursRemaining = Math.max(0, newHours - totalStudiedHours);

            const now = new Date();
            const adjustmentLog = {
              studentId: studentData.id,
              "Giờ đã học": `${stats.hours}h ${stats.minutes}p`,
              "Giờ còn lại": hoursRemaining.toFixed(2),
              "Giờ nhập thêm": newHours - oldHours, // The difference (can be negative)
              "Người nhập": currentUsername,
              "Ngày nhập": now.toISOString().split("T")[0],
              "Giờ nhập": now.toTimeString().split(" ")[0],
              Timestamp: now.toISOString(),
              "Adjustment Type": "Manual Edit from Student Profile",
              "Old Total": oldHours,
              "New Total": newHours,
              Note: `Hours Extended manually adjusted from ${oldHours}h to ${newHours}h`,
            };

            try {
              const logResponse = await fetch(EXTENSION_HISTORY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adjustmentLog),
              });

              if (logResponse.ok) {
                console.log("✅ Adjustment logged to Extension History");

                // Refresh extension history
                const refreshHistoryResponse = await fetch(
                  `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
                  {
                    cache: "no-cache",
                  }
                );
                const refreshHistoryData = await refreshHistoryResponse.json();
                if (refreshHistoryData) {
                  const historyArray = Object.keys(refreshHistoryData).map(
                    (key) => ({
                      id: key,
                      ...refreshHistoryData[key],
                    })
                  );
                  historyArray.sort(
                    (a, b) =>
                      new Date(b.Timestamp || 0).getTime() -
                      new Date(a.Timestamp || 0).getTime()
                  );
                  setExtensionHistory(historyArray);
                }
              } else {
                console.warn(
                  "⚠️ Failed to log adjustment, but student updated successfully"
                );
              }
            } catch (logError) {
              console.error("❌ Error logging adjustment:", logError);
              // Don't fail the whole operation
            }
          }

          // Refresh students from Firebase after update
          const refetchResponse = await fetch(
            `${STUDENT_LIST_URL}?_=${new Date().getTime()}`,
            {
              cache: "no-cache",
            }
          );
          const refetchData = await refetchResponse.json();
          if (refetchData) {
            const studentsArray = Object.keys(refetchData).map((key) => ({
              id: key,
              ...refetchData[key],
            }));
            console.log(
              "🔄 Students refetched after update:",
              studentsArray.length
            );
            setStudents(studentsArray);
          }

          setEditModalOpen(false);
          setEditingStudent(null);

          if (hoursChanged) {
            message.success(
              `Học sinh đã cập nhật và thay đổi Giờ mở rộng đã được ghi lại!\nCũ: ${oldHours}h → Mới: ${newHours}h`
            );
          } else {
            message.success("Học sinh đã được cập nhật thành công!");
          }
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Không cập nhật được học sinh. Status:",
            response.status,
            errorText
          );
          message.error(
            `Không cập nhật được học sinh. Status: ${response.status}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      message.error("Lỗi khi lưu học sinh: " + error);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setEditModalOpen(true);
  };

  const handleExtendHours = (student: Student) => {
    setExtendingStudent(student);
    setExtendModalOpen(true);
  };

  const handleEditExtension = (record: any) => {
    setEditingExtension(record);
    setEditExtensionModalOpen(true);
  };

  const handleSaveEditedExtension = async (
    newHours: number,
    reason: string
  ) => {
    if (!editingExtension) return;

    try {
      const oldHours = Number(editingExtension["Giờ nhập thêm"]) || 0;
      const studentId = editingExtension.studentId;

      // Update the existing record with new hours and edit history
      const now = new Date();
      const editHistory = editingExtension["Edit History"] || [];
      editHistory.push({
        "Old Hours": oldHours,
        "New Hours": newHours,
        Reason: reason,
        "Edited By": currentUsername,
        "Edited At": now.toISOString(),
        "Edited Date": now.toLocaleDateString("vi-VN"),
        "Edited Time": now.toTimeString().split(" ")[0],
      });

      const updatedRecord = {
        ...editingExtension,
        "Giờ nhập thêm": newHours,
        "Edit History": editHistory,
        "Last Edited": now.toISOString(),
        "Last Edited By": currentUsername,
      };

      // Update in Firebase
      const updateUrl = `${EXTENSION_HISTORY_URL}/${editingExtension.id}.json`;
      const updateResponse = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update: ${updateResponse.status}`);
      }

      // Recalculate total extended hours
      const historyResponse = await fetch(
        `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const historyData = await historyResponse.json();

      let totalExtended = 0;
      if (historyData) {
        Object.keys(historyData).forEach((key) => {
          const record = historyData[key];
          if (record.studentId === studentId) {
            totalExtended += Number(record["Giờ nhập thêm"]) || 0;
          }
        });
      }

      console.log("📊 Updated total extended hours:", totalExtended);

      // Update student's total extended hours
      if (!currentUser) {
        throw new Error("You must be logged in to update student hours");
      }
      const studentUrl = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${studentId}.json`;
      const studentUpdateResponse = await fetch(studentUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "Số giờ đã gia hạn": totalExtended }),
      });

      if (!studentUpdateResponse.ok) {
        throw new Error(
          `Không cập nhật được học sinh: ${studentUpdateResponse.status}`
        );
      }

      // Refresh all data
      const refetchResponse = await fetch(
        `${STUDENT_LIST_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const refetchData = await refetchResponse.json();
      if (refetchData) {
        const studentsArray = Object.keys(refetchData).map((key) => ({
          id: key,
          ...refetchData[key],
        }));
        setStudents(studentsArray);
      }

      // Refresh extension history
      const refreshHistoryResponse = await fetch(
        `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const refreshHistoryData = await refreshHistoryResponse.json();
      if (refreshHistoryData) {
        const historyArray = Object.keys(refreshHistoryData).map((key) => ({
          id: key,
          ...refreshHistoryData[key],
        }));
        historyArray.sort(
          (a, b) =>
            new Date(b.Timestamp || 0).getTime() -
            new Date(a.Timestamp || 0).getTime()
        );
        setExtensionHistory(historyArray);
      }

      setEditExtensionModalOpen(false);
      setEditingExtension(null);
      message.success("Tiện ích mở rộng đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating extension:", error);
      message.error("Không cập nhật được tiện ích mở rộng: " + error);
    }
  };

  const handleDeleteExtension = async (recordId: string, studentId: string) => {
    if (
      !confirm(
        "⚠️ Bạn có chắc chắn muốn xóa bản ghi tiện ích mở rộng này không?"
      )
    ) {
      return;
    }

    try {
      console.log("🗑️ Deleting extension record:", recordId);

      // Delete from Extension History table
      const deleteUrl = `${EXTENSION_HISTORY_URL}/${recordId}.json`;
      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete: ${deleteResponse.status}`);
      }

      console.log("✅ Extension record deleted");

      // Recalculate total extended hours from remaining records
      const historyResponse = await fetch(
        `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const historyData = await historyResponse.json();

      let totalExtended = 0;
      if (historyData) {
        Object.keys(historyData).forEach((key) => {
          const record = historyData[key];
          if (record.studentId === studentId) {
            totalExtended += Number(record["Giờ nhập thêm"]) || 0;
          }
        });
      }

      console.log("📊 Updated total extended hours:", totalExtended);

      // Update student's total extended hours
      const studentUrl = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${studentId}.json`;
      const updateResponse = await fetch(studentUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "Số giờ đã gia hạn": totalExtended }),
      });

      if (!updateResponse.ok) {
        throw new Error(
          `Không cập nhật được học sinh: ${updateResponse.status}`
        );
      }

      // Refresh all data
      const refetchResponse = await fetch(
        `${STUDENT_LIST_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const refetchData = await refetchResponse.json();
      if (refetchData) {
        const studentsArray = Object.keys(refetchData).map((key) => ({
          id: key,
          ...refetchData[key],
        }));
        setStudents(studentsArray);
      }

      // Refresh extension history
      const refreshHistoryResponse = await fetch(
        `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
        {
          cache: "no-cache",
        }
      );
      const refreshHistoryData = await refreshHistoryResponse.json();
      if (refreshHistoryData) {
        const historyArray = Object.keys(refreshHistoryData).map((key) => ({
          id: key,
          ...refreshHistoryData[key],
        }));
        historyArray.sort(
          (a, b) =>
            new Date(b.Timestamp || 0).getTime() -
            new Date(a.Timestamp || 0).getTime()
        );
        setExtensionHistory(historyArray);
      }

      message.success("Bản ghi mở rộng đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting extension:", error);
      message.error("Không xóa được bản ghi mở rộng: " + error);
    }
  };

  const handleSaveExtension = async (additionalHours: number) => {
    if (!extendingStudent) return;

    try {
      console.log("🔍 Extending student:", {
        id: extendingStudent.id,
        name: extendingStudent["Họ và tên"],
        currentExtended: extendingStudent["Số giờ đã gia hạn"],
      });

      if (!extendingStudent.id) {
        message.error("Lỗi: Học sinh không có ID!");
        console.error("❌ Học sinh thiếu ID:", extendingStudent);
        return;
      }

      // Tìm học sinh từ students state (đã có sẵn)
      console.log("🔍 Searching in students array:", {
        totalStudents: students.length,
        lookingForId: extendingStudent.id,
        availableIds: students.map((s) => s.id),
      });

      const currentStudent = students.find((s) => s.id === extendingStudent.id);

      if (!currentStudent) {
        message.error("Không tìm thấy học sinh trong danh sách!");
        console.error(
          "❌ Student not found in students array. ID:",
          extendingStudent.id
        );
        console.error("📋 Available students:", students);
        return;
      }

      console.log("✅ Found student in state:", currentStudent);

      const now = new Date();
      // Chỉ lưu studentId để nối với bảng Danh_sách_học_sinh
      const extensionRecord = {
        studentId: extendingStudent.id, // KEY để nối 2 bảng
        "Giờ đã học": `${extendingStudent.hours}h ${extendingStudent.minutes}p`,
        "Giờ còn lại": extendingStudent.hoursRemaining?.toFixed(2) || "0",
        "Giờ nhập thêm": additionalHours,
        "Người nhập": currentUsername,
        "Ngày nhập": now.toISOString().split("T")[0],
        "Giờ nhập": now.toTimeString().split(" ")[0],
        Timestamp: now.toISOString(),
      };

      // Save extension history
      const historyResponse = await fetch(EXTENSION_HISTORY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extensionRecord),
      });

      if (historyResponse.ok) {
        // Lấy lại TOÀN BỘ lịch sử gia hạn từ Firebase
        const refreshHistoryResponse = await fetch(
          `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
          {
            cache: "no-cache",
          }
        );
        const historyData = await refreshHistoryResponse.json();

        // Tính TỔNG tất cả giờ gia hạn của học sinh này từ bảng Gia_hạn
        let totalExtended = 0;
        if (historyData) {
          Object.keys(historyData).forEach((key) => {
            const record = historyData[key];
            if (record.studentId === extendingStudent.id) {
              totalExtended += Number(record["Giờ nhập thêm"]) || 0;
            }
          });
        }

        console.log("📤 Cập nhật tổng giờ từ bảng Gia_hạn:", {
          id: extendingStudent.id,
          name: currentStudent["Họ và tên"],
          totalFromHistory: totalExtended,
          justAdded: additionalHours,
        });

        // Cập nhật tổng vào bảng Danh_sách_học_sinh
        if (!currentUser) {
          throw new Error("You must be logged in to update student hours");
        }
        const studentUrl = `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${extendingStudent.id}.json`;
        const updateResponse = await fetch(studentUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "Số giờ đã gia hạn": totalExtended }),
        });

        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log("✅ Extension saved successfully to Firebase:", result);

          // Refetch student data from Firebase to ensure accuracy
          const refetchResponse = await fetch(
            `${STUDENT_LIST_URL}?_=${new Date().getTime()}`,
            {
              cache: "no-cache",
            }
          );
          const refetchData = await refetchResponse.json();
          if (refetchData) {
            const studentsArray = Object.keys(refetchData).map((key) => ({
              id: key,
              ...refetchData[key],
            }));
            console.log("🔄 Students refetched after extension");
            setStudents(studentsArray);
          }

          // Refresh extension history - fetch ALL records again
          const refreshHistoryResponse2 = await fetch(
            `${EXTENSION_HISTORY_URL}?_=${new Date().getTime()}`,
            {
              cache: "no-cache",
            }
          );
          const refreshHistoryData = await refreshHistoryResponse2.json();
          if (refreshHistoryData) {
            const historyArray = Object.keys(refreshHistoryData).map((key) => ({
              id: key,
              ...refreshHistoryData[key],
            }));
            historyArray.sort(
              (a, b) =>
                new Date(b.Timestamp || 0).getTime() -
                new Date(a.Timestamp || 0).getTime()
            );
            console.log(
              "🔄 Extension history refetched:",
              historyArray.length,
              "records"
            );
            setExtensionHistory(historyArray);
          }

          setExtendModalOpen(false);
          setExtendingStudent(null);

          const action = additionalHours >= 0 ? "Thêm" : "Trừ";
          const absHours = Math.abs(additionalHours);
          message.success(
            `Thành công ${action} ${absHours} giờ cho ${extendingStudent["Họ và tên"]}!\nTổng mới: ${totalExtended}h`
          );
        } else {
          const errorText = await updateResponse.text();
          console.error(
            "❌ Failed to update Firebase:",
            updateResponse.status,
            errorText
          );
          message.error(
            `Không cập nhật được học sinh. Status: ${updateResponse.status}`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error saving extension:", error);
      message.error(
        "Không lưu được tiện ích mở rộng. Kiểm tra bảng điều khiển để biết thêm chi tiết."
      );
    }
  };

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

  // Print report function
  const printReport = (student: Student, events: ScheduleEvent[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Use startDate and endDate if available, otherwise use current month
    let fromDate: Date, toDate: Date;
    if (startDate && endDate) {
      fromDate = new Date(startDate);
      toDate = new Date(endDate);
    } else {
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const totalHours = calculateStudentHours(
      student.id, // Use student ID instead of name
      fromDate,
      toDate
    );

    // Tính Hours Extended và Remaining từ bảng Gia_hạn
    const hoursExtendedFromHistory = calculateTotalExtendedHours(student.id);
    const totalStudiedHours = totalHours.hours + totalHours.minutes / 60;
    const hoursRemaining = Math.max(
      0,
      hoursExtendedFromHistory - totalStudiedHours
    );

    const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Phiếu báo học tập - ${student["Họ và tên"]}</title>
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
                        grid-template-columns: repeat(4, 1fr);
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
                        <h1>BÁO CÁO HỌC THUẬT</h1>
                        <p class="company-name">Trí Tuệ 8+</p>
                    </div>
                    <div class="header-right">
                        <p class="month-year">${fromDate.toLocaleDateString(
                          "vi-VN",
                          { month: "long", year: "numeric" }
                        )}</p>
                        ${
                          fromDate.getTime() !== toDate.getTime()
                            ? `<p class="month-year">to ${toDate.toLocaleDateString(
                                "vi-VN",
                                { month: "short", day: "numeric" }
                              )}</p>`
                            : ""
                        }
                    </div>
                </div>

                <h2>Student Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Họ và tên:</span>
                        <span class="info-value">${student["Họ và tên"]}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Mã học sinh:</span>
                        <span class="info-value">${
                          student["Mã học sinh"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Sinh nhật:</span>
                        <span class="info-value">${
                          student["Ngày sinh"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Số điện thoại:</span>
                        <span class="info-value">${
                          student["Số điện thoại"] || "N/A"
                        }</span>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-title">TÓM TẮT HỌC THUẬT</div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-value">${
                              totalHours.totalSessions
                            }</div>
                            <div class="summary-label">Tổng số buổi học</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${totalHours.hours}h ${
                              totalHours.minutes
                            }m</div>
                            <div class="summary-label">Tổng thời gian</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${hoursExtendedFromHistory.toFixed(
                              2
                            )}h</div>
                            <div class="summary-label">Giờ mở rộng</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${hoursRemaining.toFixed(
                              2
                            )}h</div>
                            <div class="summary-label">Giờ còn lại</div>
                        </div>
                    </div>
                </div>

                <h2>Chi tiết buổi học</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Thời lượng</th>
                            <th>Nội dung</th>
                            <th>Giáo viên</th>
                            <th>Nhận xét</th>
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
                                <td>${event["Giáo viên phụ trách"]}</td>
                                <td style="font-size: 11px; max-width: 250px;">${
                                  event["Nhận xét"] || "-"
                                }</td>
                            </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>

                <div class="footer">
                    <div class="signature">
                        <p><strong>Giáo viên phụ trách</strong></p>
                        <div class="signature-line">Chữ ký</div>
                    </div>
                    <div class="signature">
                        <p><strong>Phụ huynh/Người giám hộ</strong></p>
                        <div class="signature-line">Chữ ký</div>
                    </div>
                </div>

                <p style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
                    Ngày in phiếu: ${new Date().toLocaleDateString(
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
      isLoading={loading}
      title="Quản lý học sinh"
      toolbar={
        activeTab === "list" ? (
          <Button
            type="primary"
            onClick={handleAddStudent}
            icon={<PlusOutlined />}
          >
            Thêm mới học sinh
          </Button>
        ) : null
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginTop: -16 }}
      >
        {/* Tab 1: Danh sách học sinh */}
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Danh sách học sinh
            </span>
          }
          key="list"
        >
          {/* Filters */}
          {/* Search Box */}
          <Card title="Tìm kiếm học sinh" className="mb-6">
        <Input
          placeholder="Nhập tên học sinh"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          suffix={
            searchTerm ? (
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={() => setSearchTerm("")}
                size="small"
              />
            ) : null
          }
        />
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Tìm thấy{" "}
            <span className="font-bold text-[#36797f]">
              {displayStudents.length}
            </span>{" "}
            học sinh
          </p>
        )}
      </Card>

      <Card title="Filters" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Từ ngày
            </label>
            <DatePicker
              value={startDate ? dayjs(startDate) : null}
              onChange={(date) =>
                setStartDate(date ? date.format("YYYY-MM-DD") : "")
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Đến ngày
            </label>
            <DatePicker
              value={endDate ? dayjs(endDate) : null}
              onChange={(date) =>
                setEndDate(date ? date.format("YYYY-MM-DD") : "")
              }
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            icon={<ClearOutlined />}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </Card>

      {/* Students Table */}
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <Card>
          <Table
            dataSource={displayStudents.map((student, index) => ({
              key: student.id,
              index: index + 1,
              name: student["Họ và tên"],
              code: student["Mã học sinh"] || "-",
              phone: student["Số điện thoại"] || "-",
              email: student["Email"] || "-",
              hours: `${student.hours}h ${student.minutes}p`,
              hoursExtended: `${student.hoursExtended || 0}h`,
              hoursRemaining: `${student.hoursRemaining ? student.hoursRemaining.toFixed(2) : "0.00"}h`,
              sessions: student.totalSessions,
              student,
            }))}
            columns={[
              {
                title: "#",
                dataIndex: "index",
                key: "index",
                width: 60,
                align: "center",
                fixed: "left",
              },
              {
                title: "Họ và tên",
                dataIndex: "name",
                fixed: "left",
                key: "name",
                render: (text) => <strong>{text}</strong>,
              },
              {
                title: "Mã học sinh",
                dataIndex: "code",
                key: "code",
              },
              {
                title: "Số điện thoại",
                dataIndex: "phone",
                key: "phone",
              },
              {
                title: "Email",
                dataIndex: "email",
                key: "email",
              },
              {
                title: "Buổi học",
                dataIndex: "sessions",
                key: "sessions",
                align: "center",
                render: (sessions) => (
                  <Tag color="purple">{sessions} buổi</Tag>
                ),
              },
              {
                title: "Cài đặt",
                key: "actions",
                align: "center",
                fixed: "right",
                width: 80,
                render: (_, record) => (
                  <Space size={4}>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: "Xem chi tiết",
                            icon: <EyeOutlined />,
                            onClick: () => handleStudentClick(record.student),
                          },
                          {
                            key: "extend",
                            label: "Gia hạn giờ học",
                            icon: <ClockCircleOutlined />,
                            onClick: () => handleExtendHours(record.student),
                          },
                          {
                            type: "divider",
                          },
                          {
                            key: "edit",
                            label: "Chỉnh sửa",
                            icon: <EditOutlined />,
                            onClick: () => {
                              // Create a synthetic event to satisfy the function signature
                              const syntheticEvent = {
                                stopPropagation: () => {},
                              } as React.MouseEvent;
                              handleEditStudent(syntheticEvent, record.student);
                            },
                          },
                          {
                            key: "delete",
                            label: "Xóa học sinh",
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => {
                              Modal.confirm({
                                title: "Xóa học sinh",
                                content: `Bạn có chắc chắn muốn xóa học sinh "${record.student["Họ và tên"]}" không?`,
                                okText: "Xóa",
                                okType: "danger",
                                cancelText: "Hủy",
                                onOk: () => {
                                  const syntheticEvent = {
                                    stopPropagation: () => {},
                                  } as React.MouseEvent;
                                  handleDeleteStudent(
                                    syntheticEvent,
                                    record.student
                                  );
                                },
                              });
                            },
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button
                        type="text"
                        icon={<MoreOutlined />}
                        size="small"
                      />
                    </Dropdown>
                    <StudentReportButton
                      student={record.student}
                      type="link"
                      size="small"
                    />
                  </Space>
                ),
              },
            ]}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 1200 }}
          />
        </Card>
      )}

      {/* Student Detail Modal */}
      <Modal
        title={
          selectedStudent ? (
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {selectedStudent["Họ và tên"]}
                </h2>
                <p className="text-primary text-sm">
                  Hồ sơ học sinh & báo cáo học tập
                </p>
              </div>
            </div>
          ) : null
        }
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        {selectedStudent && (
          <div className="p-6">
            {(() => {
              // Tính Hours Extended và Remaining từ bảng Gia_hạn
              const hoursExtendedFromHistory = calculateTotalExtendedHours(
                selectedStudent.id
              );
              const totalStudiedHours =
                selectedStudent.hours + selectedStudent.minutes / 60;
              const modalHoursRemaining = Math.max(
                0,
                hoursExtendedFromHistory - totalStudiedHours
              );

              return (
                <div>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-l-4 border-[#36797f]">
                      <Statistic
                        title={
                          <span className="text-[#36797f] text-xs font-semibold uppercase tracking-wide">
                            Tổng thời gian học
                          </span>
                        }
                        value={`${selectedStudent.hours}h ${selectedStudent.minutes}m`}
                        valueStyle={{
                          color: "#36797f",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </Card>
                    <Card className="border-l-4 border-[#36797f]">
                      <Statistic
                        title={
                          <span className="text-[#36797f] text-xs font-semibold uppercase tracking-wide">
                            Tổng buổi học
                          </span>
                        }
                        value={selectedStudent.totalSessions}
                        valueStyle={{
                          color: "#36797f",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </Card>
                    <Card className="border-l-4 border-green-600">
                      <Statistic
                        title={
                          <span className="text-green-600 text-xs font-semibold uppercase tracking-wide">
                            Số giờ đã gia hạn
                          </span>
                        }
                        value={`${hoursExtendedFromHistory.toFixed(2)}h`}
                        valueStyle={{
                          color: "#16a34a",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </Card>
                    <Card className="border-l-4 border-[#36797f]">
                      <Statistic
                        title={
                          <span className="text-[#36797f] text-xs font-semibold uppercase tracking-wide">
                            Số giờ còn lại
                          </span>
                        }
                        value={`${modalHoursRemaining.toFixed(2)}h`}
                        valueStyle={{
                          color: "#36797f",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </Card>
                  </div>

                  {/* Student Info */}
                  <Card
                    className="mb-6"
                    style={{ borderColor: "#36797f", borderWidth: "2px" }}
                  >
                    <Typography.Title
                      level={4}
                      style={{
                        color: "#36797f",
                        marginBottom: "16px",
                        borderBottom: "2px solid #36797f",
                        paddingBottom: "8px",
                      }}
                    >
                      Thông tin cá nhân
                    </Typography.Title>
                    <Row gutter={[24, 8]}>
                      {selectedStudent["Mã học sinh"] && (
                        <Col span={12}>
                          <div className="flex items-baseline gap-2">
                            <Typography.Text
                              strong
                              style={{ minWidth: "110px" }}
                            >
                              Mã học sinh:
                            </Typography.Text>
                            <Typography.Text
                              style={{ color: "#36797f", fontWeight: "bold" }}
                            >
                              {selectedStudent["Mã học sinh"]}
                            </Typography.Text>
                          </div>
                        </Col>
                      )}
                      {selectedStudent["Ngày sinh"] && (
                        <Col span={12}>
                          <div className="flex items-baseline gap-2">
                            <Typography.Text
                              strong
                              style={{ minWidth: "110px" }}
                            >
                              Ngày sinh:
                            </Typography.Text>
                            <Typography.Text
                              style={{ color: "#36797f", fontWeight: "bold" }}
                            >
                              {selectedStudent["Ngày sinh"]}
                            </Typography.Text>
                          </div>
                        </Col>
                      )}
                      {selectedStudent["Số điện thoại"] && (
                        <Col span={12}>
                          <div className="flex items-baseline gap-2">
                            <Typography.Text
                              strong
                              style={{ minWidth: "110px" }}
                            >
                              Số điện thoại:
                            </Typography.Text>
                            <Typography.Text
                              style={{ color: "#36797f", fontWeight: "bold" }}
                            >
                              {selectedStudent["Số điện thoại"]}
                            </Typography.Text>
                          </div>
                        </Col>
                      )}
                      {selectedStudent["Email"] && (
                        <Col span={12}>
                          <div className="flex items-baseline gap-2">
                            <Typography.Text
                              strong
                              style={{ minWidth: "110px" }}
                            >
                              Email:
                            </Typography.Text>
                            <Typography.Text
                              style={{ color: "#36797f", fontWeight: "bold" }}
                            >
                              {selectedStudent["Email"]}
                            </Typography.Text>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card>

                  {/* Sessions List */}
                  <Card
                    className="mb-4"
                    style={{ borderColor: "#36797f", borderWidth: "2px" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Typography.Title
                          level={4}
                          style={{ color: "#36797f", margin: "0 0 4px 0" }}
                        >
                          Buổi học
                        </Typography.Title>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: "12px", fontWeight: "500" }}
                        >
                          {startDate && endDate
                            ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                            : `${months[new Date().getMonth()]} ${new Date().getFullYear()}`}
                        </Typography.Text>
                      </div>

                    </div>
                    {(() => {
                      const fromDate = startDate
                        ? new Date(startDate)
                        : new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                          );
                      const toDate = endDate
                        ? new Date(endDate)
                        : new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + 1,
                            0
                          );
                      const events = getStudentEventsByDateRange(
                        selectedStudent["Họ và tên"],
                        fromDate,
                        toDate
                      );
                      if (events.length === 0) {
                        return (
                          <div className="bg-white rounded-xl p-10 text-center shadow-md border-2 border-gray-200">
                            <div className="text-lg font-semibold text-[#36797f]">
                              Không có buổi học trong tháng này
                            </div>
                            <div className="text-gray-600 mt-2 text-sm">
                              Kiểm tra tháng khác để xem lịch sử buổi học
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {events.map((event, index) => (
                            <div
                              key={event.id}
                              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200"
                            >
                              {/* Session Header */}
                              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-l-4 border-[#36797f]">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#36797f] flex items-center justify-center text-white font-bold text-sm">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <div className="font-bold text-base text-[#36797f]">
                                      {event["Tên công việc"]}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                      📅{" "}
                                      {new Date(
                                        event["Ngày"]
                                      ).toLocaleDateString("vi-VN", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right bg-[#36797f] px-3 py-1.5 rounded-lg shadow-sm">
                                  <div className="text-white font-bold text-sm">
                                    {event["Giờ bắt đầu"]} -{" "}
                                    {event["Giờ kết thúc"]}
                                  </div>
                                </div>
                              </div>

                              {/* Session Details */}
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-semibold text-sm">
                                      👨‍🏫 Giáo viên:
                                    </span>
                                    <span className="font-bold text-[#36797f]">
                                      {event["Giáo viên phụ trách"]}
                                    </span>
                                  </div>
                                  {event["Địa điểm"] && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600 font-semibold text-sm">
                                        📍 Địa điểm:
                                      </span>
                                      <span className="font-bold text-[#36797f]">
                                        {event["Địa điểm"]}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {event["Phụ cấp di chuyển"] && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-gray-600 font-semibold text-sm">
                                      💰 Phụ cấp di chuyển:
                                    </span>
                                    <span className="font-bold text-[#36797f]">
                                      {event["Phụ cấp di chuyển"]}
                                    </span>
                                  </div>
                                )}

                                {event["Nhận xét"] && (
                                  <div className="bg-red-50 rounded-lg p-3 border border-[#36797f]">
                                    <div className="text-xs font-bold text-[#36797f] mb-1 uppercase tracking-wide">
                                      Nhận xét của giáo viên:
                                    </div>
                                    <div className="text-gray-700 text-sm leading-relaxed">
                                      {event["Nhận xét"]}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </Card>

                  {/* Extension History */}
                  <div className="mt-6">
                    <Card
                      style={{
                        background:
                          "linear-gradient(to right, #36797f, #36797f)",
                        color: "white",
                        marginBottom: "16px",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography.Title
                            level={3}
                            style={{ color: "white", margin: "0 0 4px 0" }}
                          >
                            Lịch sử gia hạn
                          </Typography.Title>
                          <Typography.Text
                            style={{ color: "white", opacity: 0.8 }}
                          >
                            Hồ sơ thanh toán và giờ nhập thêm
                          </Typography.Text>
                        </div>
                        {(() => {
                          const studentHistory = extensionHistory.filter(
                            (record) => record.studentId === selectedStudent.id
                          );
                          const totalDeposited = studentHistory.reduce(
                            (sum, record) =>
                              sum + (Number(record["Giờ nhập thêm"]) || 0),
                            0
                          );
                          return (
                            <div
                              className="text-right"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.1)",
                                padding: "12px",
                                borderRadius: "8px",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              <Typography.Text
                                style={{
                                  color: "white",
                                  opacity: 0.8,
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Tổng số giờ đã nhập
                              </Typography.Text>
                              <div
                                style={{
                                  color: "white",
                                  fontSize: "36px",
                                  fontWeight: "bold",
                                  marginTop: "4px",
                                }}
                              >
                                {totalDeposited}h
                              </div>
                              <Typography.Text
                                style={{
                                  color: "white",
                                  opacity: 0.6,
                                  fontSize: "12px",
                                  marginTop: "4px",
                                }}
                              >
                                {studentHistory.length} transaction(s)
                              </Typography.Text>
                            </div>
                          );
                        })()}
                      </div>
                    </Card>
                    {(() => {
                      // Filter theo studentId thay vì tên
                      const studentHistory = extensionHistory.filter(
                        (record) => record.studentId === selectedStudent.id
                      );

                      if (studentHistory.length === 0) {
                        return (
                          <Card
                            style={{
                              textAlign: "center",
                              padding: "40px",
                              border: "2px solid #f3f4f6",
                            }}
                          >
                            <Typography.Title
                              level={4}
                              style={{ color: "#6b7280" }}
                            >
                              Chưa có lịch sử gia hạn
                            </Typography.Title>
                            <Typography.Text
                              style={{ color: "#6b7280", marginTop: "8px" }}
                            >
                              Nhấn "⏰ Gia hạn giờ" để thêm lần nhập đầu tiên
                            </Typography.Text>
                          </Card>
                        );
                      }

                      return (
                        <Space
                          direction="vertical"
                          size="middle"
                          style={{ width: "100%" }}
                        >
                          {studentHistory.map((record, index) => {
                            // JOIN: Lấy thông tin mới nhất từ bảng Students
                            const studentInfo =
                              students.find((s) => s.id === record.studentId) ||
                              selectedStudent;

                            return (
                              <Card
                                key={record.id || index}
                                style={{ borderLeft: "4px solid #36797f" }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Tag
                                        color="green"
                                        style={{ fontSize: "12px" }}
                                      >
                                        +{record["Giờ nhập thêm"]} giờ
                                      </Tag>
                                      <Typography.Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                      >
                                        {record["Ngày nhập"]}{" "}
                                        {record["Giờ nhập"]}
                                      </Typography.Text>
                                    </div>
                                    <Row
                                      gutter={16}
                                      style={{
                                        fontSize: "14px",
                                        marginTop: "8px",
                                      }}
                                    >
                                      <Col span={6}>
                                        <Typography.Text type="secondary">
                                          Người nhập:
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          strong
                                          style={{ color: "#374151" }}
                                        >
                                          {record["Người nhập"]}
                                        </Typography.Text>
                                      </Col>
                                      <Col span={6}>
                                        <Typography.Text type="secondary">
                                          Giờ đã học:
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          strong
                                          style={{ color: "#36797f" }}
                                        >
                                          {record["Giờ đã học"]}
                                        </Typography.Text>
                                      </Col>
                                      <Col span={6}>
                                        <Typography.Text type="secondary">
                                          Giờ còn lại:
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          strong
                                          style={{ color: "#16a34a" }}
                                        >
                                          {record["Giờ còn lại"]}h
                                        </Typography.Text>
                                      </Col>
                                      <Col span={6}>
                                        <Typography.Text type="secondary">
                                          Họ tên (live):
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          strong
                                          style={{ color: "#374151" }}
                                        >
                                          {studentInfo["Họ và tên"]}
                                        </Typography.Text>
                                      </Col>
                                    </Row>
                                  </div>
                                  <Space>
                                    <Button
                                      type="default"
                                      icon={<EditOutlined />}
                                      onClick={() =>
                                        handleEditExtension(record)
                                      }
                                      size="small"
                                      title="Edit this extension record"
                                    >
                                      Chỉnh sửa
                                    </Button>
                                    <Button
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() =>
                                        handleDeleteExtension(
                                          record.id,
                                          record.studentId
                                        )
                                      }
                                      size="small"
                                      title="Delete this extension record"
                                    >
                                      Xóa
                                    </Button>
                                  </Space>
                                </div>
                              </Card>
                            );
                          })}
                        </Space>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        title={
          <div
            style={{
              backgroundColor: "#36797f",
              padding: "24px",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
              {editingStudent && editingStudent.id
                ? "Chỉnh sửa thông tin học sinh"
                : "Thêm học sinh mới"}
            </Typography.Title>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingStudent(null);
          editStudentForm.resetFields();
        }}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <Form
          form={editStudentForm}
          onFinish={(values) => {
            // Auto-generate Student Code if adding new student
            let studentCode = editingStudent?.["Mã học sinh"] || "";
            if (!editingStudent?.id) {
              // Generate new code: HS001, HS002, etc.
              const existingCodes = students
                .map((s) => s["Mã học sinh"])
                .filter((code) => code && code.startsWith("HS"))
                .map((code) => parseInt(code.replace("HS", "")) || 0);
              const maxNumber =
                existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
              studentCode = `HS${String(maxNumber + 1).padStart(3, "0")}`;
            }

            const studentData: Partial<Student> = {
              "Họ và tên": values.name,
              "Mã học sinh": studentCode,
              "Ngày sinh": values.dob,
              "Số điện thoại": values.phone,
              "Trạng thái": values.status,
              "Địa chỉ": values.address,
              "Mật khẩu": values.password || "",
              "Số giờ đã gia hạn": editingStudent?.["Số giờ đã gia hạn"] || 0,
            };
            // Preserve the ID if editing an existing student
            if (editingStudent?.id) {
              studentData.id = editingStudent.id;
            }
            handleSaveStudent(studentData);
          }}
          layout="vertical"
          style={{ padding: "24px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="dob">
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Input placeholder="Nhập trạng thái" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Mật khẩu (Phụ huynh)" 
                name="password"
                extra="Mật khẩu để phụ huynh đăng nhập xem thông tin học sinh"
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Địa chỉ" name="address">
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingStudent(null);
                  editStudentForm.resetFields();
                }}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#36797f", borderColor: "#36797f" }}
              >
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Extend Hours Modal */}
      <Modal
        title={
          <div
            style={{
              backgroundColor: "#36797f",
              padding: "20px",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
              💰 Điều chỉnh số dư giờ
            </Typography.Title>
            <Typography.Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                marginTop: "4px",
                display: "block",
              }}
            >
              Thêm hoặc bớt giờ từ tài khoản học sinh
            </Typography.Text>
          </div>
        }
        open={isExtendModalOpen}
        onCancel={() => {
          setExtendModalOpen(false);
          setExtendingStudent(null);
          extendHoursForm.resetFields();
        }}
        footer={null}
        width={500}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <Form
          form={extendHoursForm}
          onFinish={(values) => {
            const additionalHours = Number(values.additionalHours) || 0;
            handleSaveExtension(additionalHours);
          }}
          layout="vertical"
          style={{ padding: "24px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* Họ và tên (auto) */}
            <Form.Item label="Họ và tên" name="studentName">
              <Input disabled />
            </Form.Item>

            {/* Giờ nhập thêm - CHO PHÉP SỐ ÂM */}
            <Form.Item
              label="Thêm hoặc bớt giờ"
              name="additionalHours"
              rules={[{ required: true, message: "Vui lòng nhập số giờ" }]}
              extra="+ để thêm, - để bớt (ví dụ: +50 hoặc -10)"
            >
              <InputNumber
                step={0.5}
                placeholder="+ để thêm, - để bớt"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "18px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              />
            </Form.Item>

            {/* Người nhập (auto) */}
            <Form.Item label="Người nhập">
              <Input value={currentUsername} disabled />
            </Form.Item>

            {/* Ngày nhập (auto) */}
            <Form.Item label="Ngày nhập">
              <Input value={new Date().toLocaleDateString("vi-VN")} disabled />
            </Form.Item>

            {/* Giờ nhập (auto) */}
            <Form.Item label="Giờ nhập">
              <Input value={new Date().toLocaleTimeString("vi-VN")} disabled />
            </Form.Item>
          </Space>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                onClick={() => {
                  setExtendModalOpen(false);
                  setExtendingStudent(null);
                  extendHoursForm.resetFields();
                }}
                style={{ flex: 1 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#36797f",
                  borderColor: "#36797f",
                  flex: 1,
                }}
              >
                💾 Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Extension Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#1890ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
              }}
            >
              ✏️
            </div>
            <div>
              <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
                Chỉnh sửa bản ghi gia hạn
              </Typography.Title>
              <Typography.Text
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
              >
                Chỉnh sửa số giờ nhập thêm và ghi lại lý do
              </Typography.Text>
            </div>
          </div>
        }
        open={isEditExtensionModalOpen}
        onCancel={() => {
          setEditExtensionModalOpen(false);
          setEditingExtension(null);
          editExtensionForm.resetFields();
        }}
        footer={null}
        width={500}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            backgroundColor: "#1890ff",
            padding: "24px",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
            ✏️ Chỉnh sửa bản ghi gia hạn
          </Typography.Title>
          <Typography.Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "14px",
              marginTop: "4px",
              display: "block",
            }}
          >
            Chỉnh sửa số giờ nhập thêm và ghi lại lý do
          </Typography.Text>
        </div>

        <Form
          form={editExtensionForm}
          onFinish={(values) => {
            const newHours = Number(values.newHours) || 0;
            const reason = values.reason || "";
            handleSaveEditedExtension(newHours, reason);
          }}
          layout="vertical"
          style={{ padding: "24px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* Original Hours (read-only) */}
            <Card
              style={{
                backgroundColor: "#f9fafb",
                border: "2px solid #d1d5db",
              }}
            >
              <Typography.Text
                strong
                style={{ marginBottom: "8px", display: "block" }}
              >
                Số giờ hiện tại
              </Typography.Text>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#36797f",
                }}
              >
                {editingExtension?.["Giờ nhập thêm"]} giờ
              </div>
              <Typography.Text
                type="secondary"
                style={{ fontSize: "12px", marginTop: "4px" }}
              >
                Được ghi lại trên: {editingExtension?.["Ngày nhập"]} at{" "}
                {editingExtension?.["Giờ nhập"]}
              </Typography.Text>
            </Card>

            {/* New Hours */}
            <Form.Item
              label="Số giờ mới"
              name="newHours"
              rules={[{ required: true, message: "Vui lòng nhập số giờ mới" }]}
            >
              <InputNumber
                min={0}
                step={0.5}
                placeholder="Nhập số giờ mới"
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Reason */}
            <Form.Item
              label="Lý do chỉnh sửa"
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Vui lòng cung cấp lý do chỉnh sửa",
                },
              ]}
              extra="Ví dụ: Sửa lỗi nhập liệu, cập nhật số tiền thanh toán, v.v."
            >
              <Input.TextArea
                rows={3}
                placeholder="Ví dụ: Sửa lỗi nhập liệu, cập nhật số tiền thanh toán, v.v."
              />
            </Form.Item>

            {/* Edit History Preview */}
            {editingExtension?.["Edit History"] &&
              editingExtension["Edit History"].length > 0 && (
                <Card
                  style={{
                    backgroundColor: "#fef3c7",
                    border: "2px solid #f59e0b",
                  }}
                >
                  <Typography.Text
                    strong
                    style={{
                      color: "#92400e",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    ⚠️ Các lần chỉnh sửa trước (
                    {editingExtension["Edit History"].length})
                  </Typography.Text>
                  <div
                    style={{
                      maxHeight: "128px",
                      overflowY: "auto",
                      fontSize: "12px",
                    }}
                  >
                    {editingExtension["Edit History"].map(
                      (edit: any, idx: number) => (
                        <div
                          key={idx}
                          style={{ color: "#374151", marginBottom: "4px" }}
                        >
                          {edit["Edited Date"]}: {edit["Old Hours"]}h →{" "}
                          {edit["New Hours"]}h
                          <span
                            style={{ color: "#6b7280", fontStyle: "italic" }}
                          >
                            {" "}
                            ({edit["Reason"]})
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              )}

            {/* Current User */}
            <Form.Item label="Người chỉnh sửa">
              <Input value={currentUsername} disabled />
            </Form.Item>
          </Space>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                onClick={() => {
                  setEditExtensionModalOpen(false);
                  setEditingExtension(null);
                  editExtensionForm.resetFields();
                }}
                style={{ flex: 1 }}
              >
                Huỷ
              </Button>
              <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
                💾 Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>


        </TabPane>

        {/* Tab 2: Danh sách học phí */}
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Danh sách học phí
            </span>
          }
          key="tuition"
        >
          <StudentTuitionTab
            students={displayStudents}
            extensionHistory={extensionHistory}
            attendanceSessions={attendanceSessions}
          />
        </TabPane>
      </Tabs>
    </WrapperContent>
  );
};

// Component Tab Học phí
const StudentTuitionTab: React.FC<{
  students: any[];
  extensionHistory: any[];
  attendanceSessions: any[];
}> = ({ students, extensionHistory, attendanceSessions }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [studentInvoices, setStudentInvoices] = useState<Record<string, any>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Load student invoices from Firebase
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${DATABASE_URL_BASE}/datasheet/Phiếu_thu_học_phí.json`);
        const data = await response.json();
        if (data) {
          setStudentInvoices(data);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${DATABASE_URL_BASE}/datasheet/Khóa_học.json`);
        const data = await response.json();
        if (data) {
          const coursesArray = Object.entries(data).map(([id, course]: [string, any]) => ({
            id,
            ...course,
          }));
          setCourses(coursesArray);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Load classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${DATABASE_URL_BASE}/datasheet/Lớp_học.json`);
        const data = await response.json();
        if (data) {
          const classesArray = Object.entries(data).map(([id, cls]: [string, any]) => ({
            id,
            ...cls,
          }));
          setClasses(classesArray);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Tính toán thống kê theo tháng
  const monthlyStats = useMemo(() => {
    const month = selectedMonth.month();
    const year = selectedMonth.year();

    const stats = students.map((student) => {
      // Lọc attendance sessions theo tháng (có mặt)
      const monthSessions = attendanceSessions.filter((session) => {
        const sessionDate = dayjs(session["Ngày"]);
        if (sessionDate.month() !== month || sessionDate.year() !== year) return false;
        
        const record = session["Điểm danh"]?.find(
          (r: any) => r["Student ID"] === student.id
        );
        return record?.["Có mặt"] === true;
      });

      // Tính học phí tháng này dựa trên số buổi học và giá khóa học
      let monthRevenue = 0;
      monthSessions.forEach((session) => {
        const classId = session["Class ID"];
        const classInfo = classes.find((c) => c.id === classId);
        
        if (classInfo) {
          const course = courses.find((c) => 
            c.Khối === classInfo.Khối && c["Môn học"] === classInfo["Môn học"]
          );
          if (course) {
            monthRevenue += course.Giá || 0;
          }
        }
      });

      // Tìm hóa đơn của học sinh trong tháng này
      const invoiceKey = `${student.id}-${month}-${year}`;
      const invoice = studentInvoices[invoiceKey];
      
      let paidAmount = 0;
      let invoiceStatus = "unpaid";
      let discount = 0;
      
      if (invoice && typeof invoice === "object") {
        invoiceStatus = invoice.status || "unpaid";
        paidAmount = invoice.status === "paid" ? (invoice.finalAmount || 0) : 0;
        discount = invoice.discount || 0;
      }

      // Tính tổng doanh thu từ tất cả các tháng (đã thanh toán)
      let totalRevenue = 0;
      Object.entries(studentInvoices).forEach(([key, inv]: [string, any]) => {
        if (key.startsWith(`${student.id}-`) && typeof inv === "object" && inv.status === "paid") {
          totalRevenue += inv.finalAmount || 0;
        }
      });

      return {
        ...student,
        monthSessions: monthSessions.length,
        monthRevenue, // Học phí tháng này (chưa trừ giảm giá)
        discount, // Giảm giá
        finalMonthRevenue: Math.max(0, monthRevenue - discount), // Học phí sau giảm giá
        paidAmount, // Số tiền đã thanh toán
        invoiceStatus, // Trạng thái thanh toán
        totalRevenue, // Tổng doanh thu đã thanh toán
      };
    });

    return stats;
  }, [students, attendanceSessions, selectedMonth, studentInvoices, courses, classes]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: ["Họ và tên"],
      key: "name",
      fixed: "left" as const,
      width: 180,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Số buổi học",
      dataIndex: "monthSessions",
      key: "monthSessions",
      align: "center" as const,
      width: 100,
      render: (sessions: number) => <Tag color="purple">{sessions} buổi</Tag>,
    },
    {
      title: "Học phí tháng này",
      dataIndex: "monthRevenue",
      key: "monthRevenue",
      align: "right" as const,
      width: 150,
      render: (amount: number) => (
        <Text style={{ fontWeight: "bold", fontSize: 13 }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      align: "right" as const,
      width: 120,
      render: (amount: number) => (
        <Text type={amount > 0 ? "warning" : "secondary"} style={{ fontSize: 12 }}>
          {amount > 0 ? `-${formatCurrency(amount)}` : "-"}
        </Text>
      ),
    },
    {
      title: "Phải thu",
      dataIndex: "finalMonthRevenue",
      key: "finalMonthRevenue",
      align: "right" as const,
      width: 150,
      render: (amount: number) => (
        <Tag color="orange" style={{ fontWeight: "bold", fontSize: 13 }}>
          {formatCurrency(amount)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      align: "center" as const,
      width: 120,
      render: (status: string, record: any) => {
        if (record.monthSessions === 0) {
          return <Tag color="default">Không học</Tag>;
        }
        return status === "paid" ? (
          <Tag color="success">Đã thu</Tag>
        ) : (
          <Tag color="error">Chưa thu</Tag>
        );
      },
    },
    {
      title: "Tổng đã thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right" as const,
      width: 150,
      render: (amount: number) => (
        <Tag color="green" style={{ fontWeight: "bold", fontSize: 13 }}>
          {formatCurrency(amount)}
        </Tag>
      ),
    },
  ];

  const totalMonthRevenue = monthlyStats.reduce(
    (sum, s) => sum + s.monthRevenue,
    0
  );
  const totalDiscount = monthlyStats.reduce(
    (sum, s) => sum + s.discount,
    0
  );
  const totalFinalMonthRevenue = monthlyStats.reduce(
    (sum, s) => sum + s.finalMonthRevenue,
    0
  );
  const totalPaidAmount = monthlyStats.reduce(
    (sum, s) => sum + s.paidAmount,
    0
  );
  const totalRevenue = monthlyStats.reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  );

  // Dữ liệu cho biểu đồ cột so sánh (Top 10 học sinh có học phí cao nhất)
  const topStudents = [...monthlyStats]
    .filter(s => s.monthSessions > 0)
    .sort((a, b) => b.finalMonthRevenue - a.finalMonthRevenue)
    .slice(0, 10);

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: topStudents.map((s) => s["Họ và tên"]),
      labels: {
        rotate: -45,
        style: {
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Triệu VNĐ",
      },
      labels: {
        formatter: (val: number) => val.toFixed(1) + "M",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatCurrency(val * 1000000),
      },
    },
    legend: {
      position: "top",
    },
    colors: ["#fa8c16", "#52c41a"],
  };

  const barChartSeries = [
    {
      name: "Học phí tháng này",
      data: topStudents.map((s) => s.monthRevenue / 1000000), // Đổi sang triệu
    },
    {
      name: "Đã thanh toán",
      data: topStudents.map((s) => s.paidAmount / 1000000),
    },
  ];

  // Dữ liệu cho biểu đồ tròn tổng quan
  const pieChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: ["Đã thanh toán", "Chưa thanh toán"],
    colors: ["#52c41a", "#ff4d4f"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatCurrency(val),
      },
    },
  };

  const pieChartSeries = [
    totalPaidAmount,
    totalFinalMonthRevenue - totalPaidAmount
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div>
              <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>
                Chọn tháng:
              </label>
              <DatePicker
                picker="month"
                value={selectedMonth}
                onChange={(date) => date && setSelectedMonth(date)}
                format="MM/YYYY"
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col span={6}>
            <Statistic
              title="Học phí tháng này"
              value={formatCurrency(totalMonthRevenue)}
              valueStyle={{ color: "#fa8c16", fontSize: 18 }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Giảm giá"
              value={formatCurrency(totalDiscount)}
              valueStyle={{ color: "#ff4d4f", fontSize: 18 }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Phải thu"
              value={formatCurrency(totalFinalMonthRevenue)}
              valueStyle={{ color: "#1890ff", fontSize: 18 }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={6} offset={6}>
            <Statistic
              title="Đã thu"
              value={formatCurrency(totalPaidAmount)}
              valueStyle={{ color: "#52c41a", fontSize: 18 }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Chưa thu"
              value={formatCurrency(totalFinalMonthRevenue - totalPaidAmount)}
              valueStyle={{ color: "#ff4d4f", fontSize: 18 }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Tổng đã thu (Tất cả)"
              value={formatCurrency(totalRevenue)}
              valueStyle={{ color: "#52c41a", fontSize: 18 }}
            />
          </Col>
        </Row>
      </Card>

      {/* Biểu đồ */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="Học phí theo học sinh (Top 10)">
            <ReactApexChart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={350}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tình trạng thu học phí">
            <ReactApexChart
              options={pieChartOptions}
              series={pieChartSeries}
              type="donut"
              height={350}
            />
          </Card>
        </Col>
      </Row>

      <Card title={`Danh sách học phí tháng ${selectedMonth.format("MM/YYYY")}`}>
        <Table
          dataSource={monthlyStats}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
                <Table.Summary.Cell index={0}>
                  <strong>TỔNG CỘNG</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  <Tag color="purple">
                    {monthlyStats.reduce((sum, s) => sum + s.monthSessions, 0)} buổi
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <strong>{formatCurrency(totalMonthRevenue)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <strong style={{ color: "#ff4d4f" }}>
                    {totalDiscount > 0 ? `-${formatCurrency(totalDiscount)}` : "-"}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <Tag color="orange" style={{ fontWeight: "bold", fontSize: 13 }}>
                    {formatCurrency(totalFinalMonthRevenue)}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="center">
                  -
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <Tag color="green" style={{ fontWeight: "bold", fontSize: 13 }}>
                    {formatCurrency(totalRevenue)}
                  </Tag>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default StudentListView;
