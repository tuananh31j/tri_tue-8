import WrapperContent from "@/components/WrapperContent";
import { DATABASE_URL_BASE, database } from "@/firebase";
import { ref, onValue, update } from "firebase/database";
import { subjectOptions } from "@/utils/selectOptions";
import {
  Tabs,
  Table,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Tag,
  Space,
  Modal,
  Card,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import DiscountInput from "../DiscountInput";

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: string;
  "Họ và tên": string;
  "Mã học sinh"?: string;
  "Số điện thoại"?: string;
  Email?: string;
  [key: string]: any;
}

interface Teacher {
  id: string;
  "Họ và tên": string;
  "Mã giáo viên"?: string;
  "Biên chế"?: string;
  "Số điện thoại"?: string;
  Email?: string;
  "Ngân hàng"?: string;
  STK?: string;
  [key: string]: any;
}

interface AttendanceSession {
  id: string;
  Ngày: string;
  "Giờ bắt đầu": string;
  "Giờ kết thúc": string;
  "Mã lớp": string;
  "Tên lớp": string;
  "Teacher ID": string;
  "Giáo viên": string;
  "Student IDs"?: string[];
  "Điểm danh"?: any[];
  "Phụ cấp di chuyển"?: number;
  [key: string]: any;
}

interface Course {
  id: string;
  Khối: number;
  "Môn học": string;
  Giá: number;
  "Lương GV Part-time": number;
  "Lương GV Full-time": number;
  [key: string]: any;
}

interface StudentInvoice {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  month: number;
  year: number;
  totalSessions: number;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: "paid" | "unpaid";
  sessions: AttendanceSession[];
}

interface TeacherSalary {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherCode: string;
  bienChe: string;
  month: number;
  year: number;
  totalSessions: number;
  totalHours: number;
  totalMinutes: number;
  totalSalary: number;
  totalAllowance: number;
  status: "paid" | "unpaid";
  sessions: AttendanceSession[];
}

const InvoicePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Student invoice filters
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentMonth, setStudentMonth] = useState(dayjs().month());
  const [studentYear, setStudentYear] = useState(dayjs().year());
  const [studentStatusFilter, setStudentStatusFilter] = useState<
    "all" | "paid" | "unpaid"
  >("all");

  // Trigger to force recalculation after discount update
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Teacher salary filters
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [teacherMonth, setTeacherMonth] = useState(dayjs().month());
  const [teacherYear, setTeacherYear] = useState(dayjs().year());
  const [teacherBienCheFilter, setTeacherBienCheFilter] =
    useState<string>("all");
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<
    "all" | "paid" | "unpaid"
  >("all");

  // Invoice status storage in Firebase
  const [studentInvoiceStatus, setStudentInvoiceStatus] = useState<
    Record<
      string,
      | {
          status: "paid" | "unpaid";
          discount?: number;
          // Full invoice data for paid records
          studentId?: string;
          studentName?: string;
          studentCode?: string;
          month?: number;
          year?: number;
          totalSessions?: number;
          totalAmount?: number;
          finalAmount?: number;
          paidAt?: string;
          sessions?: any[];
        }
      | "paid"
      | "unpaid"
    >
  >({});
  const [teacherSalaryStatus, setTeacherSalaryStatus] = useState<
    Record<
      string,
      | "paid"
      | "unpaid"
      | {
          status: "paid" | "unpaid";
          // Full salary data for paid records
          teacherId?: string;
          teacherName?: string;
          teacherCode?: string;
          bienChe?: string;
          month?: number;
          year?: number;
          totalSessions?: number;
          totalHours?: number;
          totalMinutes?: number;
          totalSalary?: number;
          totalAllowance?: number;
          paidAt?: string;
          bankInfo?: {
            bank: string | null;
            accountNo: string | null;
            accountName: string | null;
          };
          sessions?: any[];
        }
    >
  >({});

  // Load payment status from Firebase
  useEffect(() => {
    const studentInvoicesRef = ref(database, "datasheet/Phiếu_thu_học_phí");
    const teacherSalariesRef = ref(database, "datasheet/Phiếu_lương_giáo_viên");

    const unsubscribeStudents = onValue(studentInvoicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStudentInvoiceStatus(data);
      }
    });

    const unsubscribeTeachers = onValue(teacherSalariesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeacherSalaryStatus(data);
      }
    });

    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch students
        const studentsRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`
        );
        const studentsData = await studentsRes.json();
        if (studentsData) {
          setStudents(
            Object.entries(studentsData).map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
          );
        }

        // Fetch teachers
        const teachersRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Gi%C3%A1o_vi%C3%AAn.json`
        );
        const teachersData = await teachersRes.json();
        if (teachersData) {
          setTeachers(
            Object.entries(teachersData).map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
          );
        }

        // Fetch attendance sessions
        const sessionsRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/%C4%90i%E1%BB%83m_danh_sessions.json`
        );
        const sessionsData = await sessionsRes.json();
        if (sessionsData) {
          setSessions(
            Object.entries(sessionsData).map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
          );
        }

        // Fetch courses
        const coursesRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Kh%C3%B3a_h%E1%BB%8Dc.json`
        );
        const coursesData = await coursesRes.json();
        if (coursesData) {
          setCourses(
            Object.entries(coursesData).map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
          );
        }

        // Fetch classes
        const classesRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/L%E1%BB%9Bp_h%E1%BB%8Dc.json`
        );
        const classesData = await classesRes.json();
        if (classesData) {
          setClasses(
            Object.entries(classesData).map(([id, data]: [string, any]) => ({
              id,
              ...data,
            }))
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Lỗi khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate travel allowance
  const calculateTravelAllowance = (
    teacherId: string,
    fromDate?: Date,
    toDate?: Date
  ): number => {
    const teacherSessions = sessions.filter((session) => {
      const sessionTeacher = session["Teacher ID"];
      return sessionTeacher === teacherId;
    });

    let filteredSessions = teacherSessions;
    if (fromDate && toDate) {
      filteredSessions = teacherSessions.filter((session) => {
        if (!session["Ngày"]) return false;
        const sessionDate = new Date(session["Ngày"]);
        return sessionDate >= fromDate && sessionDate <= toDate;
      });
    }

    let totalAllowance = 0;
    filteredSessions.forEach((session) => {
      const allowance = session["Phụ cấp di chuyển"];
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

  // Calculate student invoices
  const studentInvoices = useMemo(() => {
    const invoicesMap: Record<string, StudentInvoice> = {};

    // First, load all paid invoices from Firebase (these are immutable)
    Object.entries(studentInvoiceStatus).forEach(([key, data]) => {
      if (!data) return;

      const status = typeof data === "string" ? data : data.status;

      // If paid and has complete data in Firebase, use it directly
      if (status === "paid" && typeof data === "object" && data.studentId) {
        // Only include if it matches the selected month/year
        if (data.month === studentMonth) {
          invoicesMap[key] = {
            id: key,
            studentId: data.studentId,
            studentName: data.studentName || "",
            studentCode: data.studentCode || "",
            month: data.month ?? 0,
            year: data.year ?? 0,
            totalSessions: data.totalSessions ?? 0,
            totalAmount: data.totalAmount ?? 0,
            discount: data.discount ?? 0,
            finalAmount: data.finalAmount ?? 0,
            status: "paid",
            sessions: data.sessions || [],
          };
        }
      }
    });

    // Then calculate unpaid invoices from sessions
    sessions.forEach((session) => {
      const sessionDate = new Date(session["Ngày"]);
      const sessionMonth = sessionDate.getMonth();
      const sessionYear = sessionDate.getFullYear();

      if (
        sessionMonth === studentMonth &&
        // sessionYear === studentYear &&
        session["Điểm danh"]
      ) {
        session["Điểm danh"].forEach((record: any) => {
          const studentId = record["Student ID"];
          if (!studentId || !record["Có mặt"]) return;

          const key = `${studentId}-${sessionMonth}-${sessionYear}`;

          // Skip if already loaded from Firebase as paid
          if (invoicesMap[key]?.status === "paid") return;

          const student = students.find((s) => s.id === studentId);
          if (!student) return;

          // Find class info using Class ID from session
          const classId = session["Class ID"];
          const classInfo = classes.find((c) => c.id === classId);

          // Find course using Khối and Môn học from class info
          // Handle both value (Mathematics) and label (Toán) formats
          const course = classInfo
            ? courses.find((c) => {
                if (c.Khối !== classInfo.Khối) return false;
                const classSubject = classInfo["Môn học"];
                const courseSubject = c["Môn học"];
                // Direct match
                if (classSubject === courseSubject) return true;
                // Try matching with subject options (label <-> value)
                const subjectOption = subjectOptions.find(
                  (opt) =>
                    opt.label === classSubject || opt.value === classSubject
                );
                if (subjectOption) {
                  return (
                    courseSubject === subjectOption.label ||
                    courseSubject === subjectOption.value
                  );
                }
                return false;
              })
            : undefined;

          const pricePerSession = course?.Giá || 0;

          if (!invoicesMap[key]) {
            const invoiceData = studentInvoiceStatus[key];
            const discount =
              typeof invoiceData === "object" && invoiceData !== null
                ? invoiceData.discount || 0
                : 0;
            const status =
              typeof invoiceData === "string"
                ? invoiceData
                : typeof invoiceData === "object" && invoiceData !== null
                  ? invoiceData.status || "unpaid"
                  : "unpaid";

            invoicesMap[key] = {
              id: key,
              studentId,
              studentName: student["Họ và tên"] || "",
              studentCode: student["Mã học sinh"] || "",
              month: sessionMonth,
              year: sessionYear,
              totalSessions: 0,
              totalAmount: 0,
              discount: discount,
              finalAmount: 0,
              status: status,
              sessions: [],
            };
          }

          invoicesMap[key].totalSessions++;
          invoicesMap[key].totalAmount += pricePerSession;
          invoicesMap[key].sessions.push(session);
        });
      }
    });

    // Calculate final amount for unpaid invoices only
    Object.values(invoicesMap).forEach((invoice) => {
      if (invoice.status !== "paid") {
        const finalAmount = Math.max(0, invoice.totalAmount - invoice.discount);
        invoice.finalAmount = finalAmount;
      }
    });

    return Object.values(invoicesMap);
  }, [
    sessions,
    students,
    courses,
    classes,
    studentMonth,
    studentYear,
    studentInvoiceStatus,
    refreshTrigger,
  ]);

  // Calculate teacher salaries
  const teacherSalaries = useMemo(() => {
    const salariesMap: Record<string, TeacherSalary> = {};

    // First, load all paid salaries from Firebase (these are immutable)
    Object.entries(teacherSalaryStatus).forEach(([key, data]) => {
      if (!data) return;

      const status = typeof data === "string" ? data : data.status;

      // If paid and has complete data in Firebase, use it directly
      if (status === "paid" && typeof data === "object" && data.teacherId) {
        // Only include if it matches the selected month/year
        if (data.month === teacherMonth && data.year === teacherYear) {
          salariesMap[key] = {
            id: key,
            teacherId: data.teacherId,
            teacherName: data.teacherName || "",
            teacherCode: data.teacherCode || "",
            bienChe: data.bienChe || "Chưa phân loại",
            month: data.month ?? 0,
            year: data.year ?? 0,
            totalSessions: data.totalSessions ?? 0,
            totalHours: data.totalHours ?? 0,
            totalMinutes: data.totalMinutes ?? 0,
            totalSalary: data.totalSalary ?? 0,
            totalAllowance: data.totalAllowance ?? 0,
            status: "paid",
            sessions: data.sessions || [],
          };
        }
      }
    });

    // Then calculate unpaid salaries from sessions
    sessions.forEach((session) => {
      const sessionDate = new Date(session["Ngày"]);
      const sessionMonth = sessionDate.getMonth();
      const sessionYear = sessionDate.getFullYear();

      if (sessionMonth === teacherMonth && sessionYear === teacherYear) {
        const teacherId = session["Teacher ID"];
        if (!teacherId) return;

        const key = `${teacherId}-${sessionMonth}-${sessionYear}`;

        // Skip if already loaded from Firebase as paid
        if (salariesMap[key]?.status === "paid") return;

        const teacher = teachers.find((t) => t.id === teacherId);
        if (!teacher) return;

        const bienChe = teacher["Biên chế"] || "Chưa phân loại";

        // Calculate session duration
        const [startH, startM] = (session["Giờ bắt đầu"] || "0:0")
          .split(":")
          .map(Number);
        const [endH, endM] = (session["Giờ kết thúc"] || "0:0")
          .split(":")
          .map(Number);
        const minutes = endH * 60 + endM - (startH * 60 + startM);

        // Find class info using Class ID from session
        const classId = session["Class ID"];
        const classInfo = classes.find((c) => c.id === classId);

        // Find course using Khối and Môn học from class info
        // Handle both value (Mathematics) and label (Toán) formats
        const course = classInfo
          ? courses.find((c) => {
              if (c.Khối !== classInfo.Khối) return false;
              const classSubject = classInfo["Môn học"];
              const courseSubject = c["Môn học"];
              // Direct match
              if (classSubject === courseSubject) return true;
              // Try matching with subject options (label <-> value)
              const subjectOption = subjectOptions.find(
                (opt) =>
                  opt.label === classSubject || opt.value === classSubject
              );
              if (subjectOption) {
                return (
                  courseSubject === subjectOption.label ||
                  courseSubject === subjectOption.value
                );
              }
              return false;
            })
          : undefined;

        const salaryRate =
          bienChe === "Full-time"
            ? Number(course?.["Lương GV Full-time"]) || 0
            : Number(course?.["Lương GV Part-time"]) || 0;

        if (!salariesMap[key]) {
          // Normalize status - handle both direct value and nested object
          const statusValue = teacherSalaryStatus[key];
          const status =
            typeof statusValue === "object" && statusValue?.status
              ? statusValue.status
              : (statusValue as "paid" | "unpaid") || "unpaid";

          salariesMap[key] = {
            id: key,
            teacherId,
            teacherName: teacher["Họ và tên"] || "",
            teacherCode: teacher["Mã giáo viên"] || "",
            bienChe,
            month: sessionMonth,
            year: sessionYear,
            totalSessions: 0,
            totalHours: 0,
            totalMinutes: 0,
            totalSalary: 0,
            totalAllowance: 0,
            status,
            sessions: [],
          };
        }

        salariesMap[key].totalSessions++;
        salariesMap[key].totalMinutes += minutes;
        salariesMap[key].totalSalary += salaryRate;
        salariesMap[key].sessions.push(session);
      }
    });

    // Convert total minutes to hours and calculate total allowance for unpaid only
    Object.values(salariesMap).forEach((salary) => {
      if (salary.status !== "paid") {
        salary.totalHours = Math.floor(salary.totalMinutes / 60);
        salary.totalMinutes = salary.totalMinutes % 60;

        // Find teacher info to get travel allowance per session
        const teacher = teachers.find((t) => t.id === salary.teacherId);
        const travelAllowancePerSession = teacher?.["Trợ cấp đi lại"] || 0;

        // Calculate total travel allowance = allowance per session * number of sessions
        salary.totalAllowance =
          travelAllowancePerSession * salary.totalSessions;
      }
    });

    return Object.values(salariesMap);
  }, [
    sessions,
    teachers,
    courses,
    classes,
    teacherMonth,
    teacherYear,
    teacherSalaryStatus,
  ]);

  // Filter student invoices
  const filteredStudentInvoices = useMemo(() => {
    return studentInvoices.filter((invoice) => {
      const matchSearch =
        !studentSearchTerm ||
        invoice.studentName
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase()) ||
        invoice.studentCode
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase());

      const matchStatus =
        studentStatusFilter === "all" || invoice.status === studentStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [studentInvoices, studentSearchTerm, studentStatusFilter]);

  // Filter teacher salaries
  const filteredTeacherSalaries = useMemo(() => {
    return teacherSalaries.filter((salary) => {
      const matchSearch =
        !teacherSearchTerm ||
        salary.teacherName
          .toLowerCase()
          .includes(teacherSearchTerm.toLowerCase()) ||
        salary.teacherCode
          .toLowerCase()
          .includes(teacherSearchTerm.toLowerCase());

      const matchBienChe =
        teacherBienCheFilter === "all" ||
        salary.bienChe === teacherBienCheFilter;

      const matchStatus =
        teacherStatusFilter === "all" || salary.status === teacherStatusFilter;

      return matchSearch && matchBienChe && matchStatus;
    });
  }, [
    teacherSalaries,
    teacherSearchTerm,
    teacherBienCheFilter,
    teacherStatusFilter,
  ]);

  // Update payment status
  const updateStudentInvoiceStatus = async (
    invoiceId: string,
    status: "paid" | "unpaid"
  ) => {
    Modal.confirm({
      title:
        status === "paid" ? "Xác nhận thanh toán" : "Hủy xác nhận thanh toán",
      content:
        status === "paid"
          ? "Bạn có chắc chắn muốn đánh dấu phiếu thu này đã thanh toán?"
          : "Bạn có chắc chắn muốn hủy trạng thái thanh toán?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Find the invoice data
          const invoice = studentInvoices.find((inv) => inv.id === invoiceId);
          if (!invoice) {
            message.error("Không tìm thấy thông tin phiếu thu");
            return;
          }

          const invoiceRef = ref(
            database,
            `datasheet/Phiếu_thu_học_phí/${invoiceId}`
          );
          const currentData = studentInvoiceStatus[invoiceId] || {};

          // When marking as paid, save complete invoice data
          if (status === "paid") {
            await update(invoiceRef, {
              ...currentData,
              status,
              studentId: invoice.studentId,
              studentName: invoice.studentName,
              studentCode: invoice.studentCode,
              month: invoice.month,
              year: invoice.year,
              totalSessions: invoice.totalSessions,
              totalAmount: invoice.totalAmount,
              discount: invoice.discount,
              finalAmount: invoice.finalAmount,
              paidAt: new Date().toISOString(),
              sessions: invoice.sessions.map((s) => ({
                id: s.id,
                Ngày: s["Ngày"],
                "Giờ bắt đầu": s["Giờ bắt đầu"],
                "Giờ kết thúc": s["Giờ kết thúc"],
                "Tên lớp": s["Tên lớp"],
                "Mã lớp": s["Mã lớp"],
              })),
            });
          } else {
            // Only allow unpaid if not yet marked as paid
            await update(invoiceRef, {
              ...currentData,
              status,
            });
          }

          message.success(
            status === "paid"
              ? "Đã đánh dấu đã thanh toán"
              : "Đã đánh dấu chưa thanh toán"
          );
        } catch (error) {
          console.error("Error updating student invoice status:", error);
          message.error("Lỗi khi cập nhật trạng thái");
        }
      },
    });
  };

  // Update discount
  const updateStudentDiscount = async (invoiceId: string, discount: number) => {
    console.log(invoiceId, discount, ">>>>>>>>>");
    try {
      const currentData = studentInvoiceStatus[invoiceId];
      const currentStatus =
        typeof currentData === "object" ? currentData.status : currentData;

      // Không cho phép cập nhật nếu đã thanh toán
      if (currentStatus === "paid") {
        message.error(
          "Không thể cập nhật phiếu đã thanh toán. Dữ liệu đã được lưu cố định."
        );
        return;
      }

      const invoiceRef = ref(
        database,
        `datasheet/Phiếu_thu_học_phí/${invoiceId}`
      );
      const updateData =
        typeof currentData === "object"
          ? { ...currentData, discount }
          : { status: currentStatus || "unpaid", discount };

      await update(invoiceRef, updateData);
      message.success("Đã cập nhật miễn giảm học phí");

      // Trigger recalculation of table
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating discount:", error);
      message.error("Lỗi khi cập nhật miễn giảm");
    }
  };

  const updateTeacherSalaryStatus = async (
    salaryId: string,
    status: "paid" | "unpaid"
  ) => {
    Modal.confirm({
      title:
        status === "paid" ? "Xác nhận thanh toán" : "Hủy xác nhận thanh toán",
      content:
        status === "paid"
          ? "Bạn có chắc chắn muốn đánh dấu phiếu lương này đã thanh toán?"
          : "Bạn có chắc chắn muốn hủy trạng thái thanh toán?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          console.log("🔄 Updating teacher salary status:", {
            salaryId,
            status,
          });

          // Find the salary data
          const salary = teacherSalaries.find((sal) => sal.id === salaryId);
          if (!salary) {
            message.error("Không tìm thấy thông tin phiếu lương");
            return;
          }

          const salaryRef = ref(
            database,
            `datasheet/Phiếu_lương_giáo_viên/${salaryId}`
          );

          console.log(
            "📍 Firebase path:",
            `datasheet/Phiếu_lương_giáo_viên/${salaryId}`
          );

          // When marking as paid, save complete salary data
          if (status === "paid") {
            const teacher = teachers.find((t) => t.id === salary.teacherId);
            await update(salaryRef, {
              status,
              teacherId: salary.teacherId,
              teacherName: salary.teacherName,
              teacherCode: salary.teacherCode,
              bienChe: salary.bienChe,
              month: salary.month,
              year: salary.year,
              totalSessions: salary.totalSessions,
              totalHours: salary.totalHours,
              totalMinutes: salary.totalMinutes,
              totalSalary: salary.totalSalary,
              totalAllowance: salary.totalAllowance,
              paidAt: new Date().toISOString(),
              bankInfo: {
                bank: teacher?.["Ngân hàng"] || null,
                accountNo: teacher?.STK || null,
                accountName: teacher?.["Họ và tên"] || null,
              },
              sessions: salary.sessions.map((s) => ({
                id: s.id,
                Ngày: s["Ngày"],
                "Giờ bắt đầu": s["Giờ bắt đầu"],
                "Giờ kết thúc": s["Giờ kết thúc"],
                "Tên lớp": s["Tên lớp"],
                "Mã lớp": s["Mã lớp"],
              })),
            });
          } else {
            // Only allow unpaid if not yet marked as paid
            await update(salaryRef, { status });
          }

          console.log("✅ Firebase updated successfully");

          // Update local state to trigger re-render
          setTeacherSalaryStatus((prev) => ({
            ...prev,
            [salaryId]: status,
          }));

          message.success(
            status === "paid"
              ? "Đã đánh dấu đã thanh toán"
              : "Đã đánh dấu chưa thanh toán"
          );
        } catch (error) {
          console.error("❌ Error updating teacher salary status:", error);
          message.error("Lỗi khi cập nhật trạng thái");
        }
      },
    });
  };

  // View and export invoice
  const viewStudentInvoice = (invoice: StudentInvoice) => {
    const content = generateStudentInvoiceHTML(invoice);
    const modal = Modal.info({
      title: `Phiếu thu học phí - ${invoice.studentName}`,
      width: 800,
      maskClosable: true,
      closable: true,
      content: (
        <div
          id={`student-invoice-${invoice.id}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ),
      footer: (
        <Space>
          <Button onClick={() => modal.destroy()}>Đóng</Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => printInvoice(content)}
          >
            In phiếu
          </Button>
        </Space>
      ),
    });
  };

  const viewTeacherSalary = (salary: TeacherSalary) => {
    const content = generateTeacherSalaryHTML(salary);
    const modal = Modal.info({
      title: `Phiếu lương giáo viên - ${salary.teacherName}`,
      width: 800,
      maskClosable: true,
      closable: true,
      content: (
        <div
          id={`teacher-salary-${salary.id}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ),
      footer: (
        <Space>
          <Button onClick={() => modal.destroy()}>Đóng</Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => printInvoice(content)}
          >
            In phiếu
          </Button>
        </Space>
      ),
    });
  };

  // Generate VietQR URL with hardcoded bank info for students
  const generateVietQR = (
    amount: string,
    studentName: string,
    month: string
  ): string => {
    const bankId = "VPB"; // VPBank
    const accountNo = "4319888";
    const accountName = "NGUYEN THI HOA";
    const numericAmount = amount.replace(/[^0-9]/g, "");
    const description = `HP T${month} ${studentName}`;
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${numericAmount}&addInfo=${encodeURIComponent(
      description
    )}&accountName=${encodeURIComponent(accountName)}`;
  };

  // Generate VietQR URL for teacher salary payment
  const generateTeacherVietQR = (
    amount: number,
    teacherName: string,
    month: number,
    bankName: string,
    accountNo: string,
    accountName: string
  ): string => {
    // Extract bank code from bank name (simple mapping)
    const bankCodeMap: Record<string, string> = {
      VPBank: "VPB",
      Vietcombank: "VCB",
      Techcombank: "TCB",
      BIDV: "BIDV",
      Agribank: "ABB",
      VietinBank: "CTG",
      MBBank: "MB",
      ACB: "ACB",
      Sacombank: "STB",
      VIB: "VIB",
    };

    const bankId = bankCodeMap[bankName] || "VCB"; // Default to VCB if not found
    const numericAmount = amount.toString().replace(/[^0-9]/g, "");
    const description = `Luong T${month + 1} ${teacherName}`;

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${numericAmount}&addInfo=${encodeURIComponent(
      description
    )}&accountName=${encodeURIComponent(accountName)}`;
  };

  const generateStudentInvoiceHTML = (invoice: StudentInvoice) => {
    // Group sessions by class and calculate totals
    const classSummary: Record<
      string,
      {
        className: string;
        classCode: string;
        sessionCount: number;
        pricePerSession: number;
        totalPrice: number;
      }
    > = {};

    // Calculate average price per session
    const avgPricePerSession = invoice.totalSessions > 0
      ? invoice.totalAmount / invoice.totalSessions
      : 0;

    invoice.sessions.forEach((session) => {
      const className = session["Tên lớp"] || "";
      const classCode = session["Mã lớp"] || "";
      const key = `${classCode}-${className}`;

      if (!classSummary[key]) {
        classSummary[key] = {
          className,
          classCode,
          sessionCount: 0,
          pricePerSession: avgPricePerSession,
          totalPrice: 0,
        };
      }

      classSummary[key].sessionCount++;
      classSummary[key].totalPrice = classSummary[key].pricePerSession * classSummary[key].sessionCount;
    });

    const classRows = Object.values(classSummary);

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
          <img
            src="/img/logo.png"
            alt="Background Logo"
            style="width: auto; height: 400px; max-width: 400px; object-fit: contain; opacity: 0.08; filter: grayscale(50%); user-select: none; pointer-events: none;"
          />
        </div>
        <div style="position: relative; z-index: 1;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #36797f; margin: 0;">PHIẾU THU HỌC PHÍ</h1>
          <p style="font-size: 18px; margin: 5px 0;">Trí Tuệ 8+</p>
          <p>Tháng ${invoice.month + 1}/${invoice.year}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p><strong>Học sinh:</strong> ${invoice.studentName}</p>
          <p><strong>Mã học sinh:</strong> ${invoice.studentCode}</p>
          <p><strong>Số buổi học:</strong> ${invoice.totalSessions} buổi</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #36797f; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Lớp</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Số buổi</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Giá/buổi</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            ${classRows
              .map(
                (classData, i) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${classData.className}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${classData.sessionCount}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${classData.pricePerSession.toLocaleString("vi-VN")} đ</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${classData.totalPrice.toLocaleString("vi-VN")} đ</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background: #f5f5f5; font-weight: bold;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-start: right;">Tổng học phí:</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${invoice.totalAmount.toLocaleString("vi-VN")} đ</td>
            </tr>
            ${
              invoice.discount > 0
                ? `
            <tr style="background: #fff; color: #f5222d;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-start: right;"><strong>Miễn giảm:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">-${invoice.discount.toLocaleString("vi-VN")} đ</td>
            </tr>
            `
                : ""
            }
            <tr style="background: #36797f; color: white; font-size: 16px;">
              <td colspan="4" style="border: 1px solid #ddd; padding: 12px; text-start: right;"><strong>Thành tiền:</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${invoice.finalAmount.toLocaleString("vi-VN")} đ</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; text-align: center; display: flex; flex-direction: column; align-items: center;">
          <p style="margin-bottom: 15px; font-size: 16px; font-weight: bold;">Quét mã QR để thanh toán</p>
          <img
            src="${generateVietQR(invoice.finalAmount.toString(), invoice.studentName, (invoice.month + 1).toString())}"
            alt="VietQR"
            style="width: 200px; height: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 8px;"
          />
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            Ngân hàng: VPBank - STK: 4319888<br/>
            Người nhận: NGUYEN THI HOA
          </p>
        </div>

        <p style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
          Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}
        </p>
        </div>
      </div>
    `;
  };

  const generateTeacherSalaryHTML = (salary: TeacherSalary) => {
    const teacher = teachers.find((t) => t.id === salary.teacherId);
    const travelAllowancePerSession = Number(teacher?.["Trợ cấp đi lại"]) || 0;

    // Define level schools
    const levelSchools = [
      { key: "1,2,3,4,5", value: "TH", label: "Tiểu học" },
      { key: "6,7,8,9", value: "THCS", label: "Trung học cơ sở" },
      { key: "10,11,12", value: "THPT", label: "Trung học phổ thông" },
    ];

    // Group sessions by level school
    const levelSummary: Record<
      string,
      {
        level: string;
        levelLabel: string;
        sessionCount: number;
        totalSalary: number;
        totalAllowance: number;
      }
    > = {};

    salary.sessions.forEach((session) => {
      const className = session["Tên lớp"] || "";
      const classCode = session["Mã lớp"] || "";

      // Find class info using Class ID from session
      const classId = session["Class ID"];
      const classInfo = classes.find((c) => c.id === classId);
      const gradeNumber = classInfo?.Khối || null;

      // Find which level this grade belongs to
      let level = levelSchools.find((l) => {
        if (!gradeNumber) return false;
        const grades = l.key.split(",").map((g) => parseInt(g));
        return grades.includes(gradeNumber);
      });

      // If no grade found or no level matched, default to TH (Tiểu học)
      if (!level) {
        console.log("⚠️ Session without valid grade, defaulting to TH:", {
          className,
          classCode,
          gradeNumber,
          classId,
        });
        level = levelSchools[0]; // Default to TH
      }

      // Find course using class info
      const course = classInfo
        ? courses.find(
            (c) =>
              c.Khối === classInfo.Khối && c["Môn học"] === classInfo["Môn học"]
          )
        : undefined;

      const salaryPerSession =
        salary.bienChe === "Full-time"
          ? Number(course?.["Lương GV Full-time"]) || 0
          : Number(course?.["Lương GV Part-time"]) || 0;
      if (!levelSummary[level.value]) {
        levelSummary[level.value] = {
          level: level.value,
          levelLabel: level.label,
          sessionCount: 0,
          totalSalary: 0,
          totalAllowance: 0,
        };
      }

      levelSummary[level.value].sessionCount++;
      levelSummary[level.value].totalSalary += salaryPerSession;
      levelSummary[level.value].totalAllowance += travelAllowancePerSession;
    });

    const levelData = Object.values(levelSummary);
    // Use the pre-calculated values from salary object for accuracy
    const grandTotal = salary.totalSalary + salary.totalAllowance;

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
          <img
            src="/img/logo.png"
            alt="Background Logo"
            style="width: auto; height: 400px; max-width: 400px; object-fit: contain; opacity: 0.08; filter: grayscale(50%); user-select: none; pointer-events: none;"
          />
        </div>
        <div style="position: relative; z-index: 1;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff0000; margin: 0; font-size: 28px;">PHIẾU LƯƠNG THÁNG ${salary.month + 1}</h1>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Họ và tên:</strong> ${salary.teacherName}</p>
          <p style="margin: 5px 0;"><strong>Môn Phụ Trách:</strong> ${teacher?.["Chuyên môn"] || "Đa môn"}</p>
          <p style="margin: 5px 0;"><strong>Tổng số buổi dạy:</strong> ${salary.totalSessions} buổi</p>
          <p style="margin: 5px 0;"><strong>Trợ cấp đi lại:</strong> ${travelAllowancePerSession.toLocaleString("vi-VN")} VNĐ/buổi</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Khối</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Ca dạy</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: right;">Lương</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: right;">Phụ cấp</th>
            </tr>
          </thead>
          <tbody>
            ${levelData
              .map(
                (level) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>${level.level}</strong></td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${level.sessionCount}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${level.totalSalary.toLocaleString("vi-VN")}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${level.totalAllowance.toLocaleString("vi-VN")}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background: #f9f9f9;">
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: left;"><strong>Tổng lương cơ bản</strong></td>
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: right;"><strong>${salary.totalSalary.toLocaleString("vi-VN")}</strong></td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: left;"><strong>Tổng phụ cấp</strong></td>
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: right;"><strong>${salary.totalAllowance.toLocaleString("vi-VN")}</strong></td>
            </tr>
            <tr style="background: #e8f5e9; font-weight: bold;">
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 16px;">TỔNG LƯƠNG</td>
              <td colspan="2" style="border: 1px solid #000; padding: 8px; text-align: right; font-size: 16px;">${grandTotal.toLocaleString("vi-VN")}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Ghi chú:</strong> ${teacher?.["Ghi chú"] || "Thầy Cô kiểm tra ký thông tin và tiền lương. Nếu có sai sót báo lại với Trung Tâm"}</p>
        </div>



        ${
          teacher?.["Ngân hàng"] && teacher?.STK
            ? `
        <div style="margin-top: 30px; text-align: center; display: flex; flex-direction: column; align-items: center;">
          <p style="margin-bottom: 15px; font-size: 16px; font-weight: bold;">Quét mã QR để nhận lương</p>
          <img
            src="${generateTeacherVietQR(
              grandTotal,
              salary.teacherName,
              salary.month,
              teacher["Ngân hàng"],
              teacher.STK,
              teacher["Họ và tên"]
            )}"
            alt="VietQR"
            style="width: 200px; height: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 8px;"
          />
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            Ngân hàng: ${teacher["Ngân hàng"]} - STK: ${teacher.STK}<br/>
            Người nhận: ${teacher["Họ và tên"]}
          </p>
        </div>
        `
            : ` <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Thông tin ngân hàng:</strong></p>
          <p style="margin: 5px 0;">Ngân hàng: ${teacher?.["Ngân hàng"] || "N/A"}</p>
          <p style="margin: 5px 0;">Số tài khoản: ${teacher?.STK || "N/A"}</p>
        </div>`
        }

        <p style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}
        </p>
        </div>
      </div>
    `;
  };

  const exportToImage = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${elementId}-${new Date().getTime()}.png`;
      link.click();
      message.success("Đã xuất ảnh thành công");
    } catch (error) {
      console.error("Error exporting image:", error);
      message.error("Lỗi khi xuất ảnh");
    }
  };

  const printInvoice = (content: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>In phiếu</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Expandable row render for student invoice details
  const expandedRowRender = (record: StudentInvoice) => {
    // Group sessions by class
    const classSummary: Record<
      string,
      {
        className: string;
        classCode: string;
        sessionCount: number;
        pricePerSession: number;
        totalPrice: number;
      }
    > = {};

    // If invoice is paid, use sessions data from Firebase (already saved)
    if (record.status === "paid") {
      const firebaseData = studentInvoiceStatus[record.id];
      if (
        firebaseData &&
        typeof firebaseData === "object" &&
        firebaseData.sessions
      ) {
        // Use saved sessions from Firebase
        firebaseData.sessions.forEach((session: any) => {
          const className = session["Tên lớp"] || "";
          const classCode = session["Mã lớp"] || "";
          const key = `${classCode}-${className}`;

          if (!classSummary[key]) {
            classSummary[key] = {
              className,
              classCode,
              sessionCount: 0,
              pricePerSession: 0,
              totalPrice: 0,
            };
          }

          classSummary[key].sessionCount++;
        });

        // Calculate prices from saved totalAmount
        const totalSessions = firebaseData.totalSessions || 1;
        const avgPrice = (firebaseData.totalAmount || 0) / totalSessions;

        Object.values(classSummary).forEach((summary) => {
          summary.pricePerSession = avgPrice;
          summary.totalPrice = avgPrice * summary.sessionCount;
        });
      }
    } else {
      // For unpaid invoices, calculate from current data
      record.sessions.forEach((session) => {
        const className = session["Tên lớp"] || "";
        const classCode = session["Mã lớp"] || "";
        const key = `${classCode}-${className}`;

        // Find class info using Class ID from session
        const classId = session["Class ID"];
        const classInfo = classes.find((c) => c.id === classId);

        // Find course using Khối and Môn học from class info
        const course = classInfo
          ? courses.find((c) => {
              if (c.Khối !== classInfo.Khối) return false;
              const classSubject = classInfo["Môn học"];
              const courseSubject = c["Môn học"];
              // Direct match
              if (classSubject === courseSubject) return true;
              // Try matching with subject options (label <-> value)
              const subjectOption = subjectOptions.find(
                (opt) =>
                  opt.label === classSubject || opt.value === classSubject
              );
              if (subjectOption) {
                return (
                  courseSubject === subjectOption.label ||
                  courseSubject === subjectOption.value
                );
              }
              return false;
            })
          : undefined;

        const pricePerSession = course?.Giá || 0;

        if (!classSummary[key]) {
          classSummary[key] = {
            className,
            classCode,
            sessionCount: 0,
            pricePerSession,
            totalPrice: 0,
          };
        }

        classSummary[key].sessionCount++;
        classSummary[key].totalPrice += pricePerSession;
      });
    }

    const classData = Object.values(classSummary);

    const expandColumns = [
      {
        title: "Tên lớp",
        dataIndex: "className",
        key: "className",
        width: 250,
      },
      {
        title: "Mã lớp",
        dataIndex: "classCode",
        key: "classCode",
        width: 120,
      },
      {
        title: "Số buổi",
        dataIndex: "sessionCount",
        key: "sessionCount",
        width: 100,
        align: "center" as const,
        render: (count: number) => <Tag color="blue">{count} buổi</Tag>,
      },
      {
        title: "Giá/buổi",
        dataIndex: "pricePerSession",
        key: "pricePerSession",
        width: 150,
        align: "right" as const,
        render: (price: number) => (
          <Text style={{ color: "#52c41a" }}>
            {price.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 150,
        align: "right" as const,
        render: (total: number) => (
          <Text strong style={{ color: "#1890ff" }}>
            {total.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
    ];

    return (
      <Table
        columns={expandColumns}
        dataSource={classData}
        pagination={false}
        rowKey={(row) => `${row.classCode}-${row.className}`}
        size="small"
        style={{ margin: "0 48px" }}
      />
    );
  };

  // Student invoice columns - Memoized to prevent recreation
  const studentColumns = useMemo(
    () => [
      {
        title: "Mã HS",
        dataIndex: "studentCode",
        key: "studentCode",
        width: 100,
      },
      {
        title: "Họ tên",
        dataIndex: "studentName",
        key: "studentName",
        width: 200,
      },
      {
        title: "Số buổi",
        dataIndex: "totalSessions",
        key: "totalSessions",
        width: 100,
        align: "center" as const,
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 130,
        render: (amount: number) => (
          <Text style={{ color: "#36797f" }}>
            {amount.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
      {
        title: "Miễn giảm",
        key: "discount",
        width: 200,
        render: (_: any, record: StudentInvoice) => (
          <DiscountInput
            record={record}
            updateStudentDiscount={updateStudentDiscount}
          />
        ),
      },
      {
        title: "Thành tiền",
        key: "finalAmount",
        width: 130,
        render: (_: any, record: StudentInvoice) => (
          <Text strong style={{ color: "#1890ff", fontSize: "14px" }}>
            {record.finalAmount.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: "paid" | "unpaid") => (
          <Tag color={status === "paid" ? "green" : "red"}>
            {status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Tag>
        ),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 200,
        render: (_: any, record: StudentInvoice) => (
          <Space>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => viewStudentInvoice(record)}
            >
              Xem
            </Button>
            {record.status !== "paid" && (
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => updateStudentInvoiceStatus(record.id, "paid")}
              >
                Xác nhận TT
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [updateStudentDiscount, viewStudentInvoice, updateStudentInvoiceStatus]
  );

  // Expandable row render for teacher salary details
  const expandedTeacherRowRender = (record: TeacherSalary) => {
    // Find teacher info to get travel allowance per session
    const teacher = teachers.find((t) => t.id === record.teacherId);
    const travelAllowancePerSession = teacher?.["Trợ cấp đi lại"] || 0;

    // Group sessions by class
    const classSummary: Record<
      string,
      {
        className: string;
        classCode: string;
        sessionCount: number;
        salaryPerSession: number;
        totalSalary: number;
        totalAllowance: number;
      }
    > = {};

    // If salary is paid, use sessions data from Firebase (already saved)
    if (record.status === "paid") {
      const firebaseData = teacherSalaryStatus[record.id];
      if (
        firebaseData &&
        typeof firebaseData === "object" &&
        firebaseData.sessions
      ) {
        // Use saved sessions from Firebase
        firebaseData.sessions.forEach((session: any) => {
          const className = session["Tên lớp"] || "";
          const classCode = session["Mã lớp"] || "";
          const key = `${classCode}-${className}`;

          if (!classSummary[key]) {
            classSummary[key] = {
              className,
              classCode,
              sessionCount: 0,
              salaryPerSession: 0,
              totalSalary: 0,
              totalAllowance: 0,
            };
          }

          classSummary[key].sessionCount++;
        });

        // Calculate from saved data
        const totalSessions = firebaseData.totalSessions || 1;
        const avgSalary = (firebaseData.totalSalary || 0) / totalSessions;
        const avgAllowance = (firebaseData.totalAllowance || 0) / totalSessions;

        Object.values(classSummary).forEach((summary) => {
          summary.salaryPerSession = avgSalary;
          summary.totalSalary = avgSalary * summary.sessionCount;
          summary.totalAllowance = avgAllowance * summary.sessionCount;
        });
      }
    } else {
      // For unpaid salaries, calculate from current data
      record.sessions.forEach((session) => {
        const className = session["Tên lớp"] || "";
        const classCode = session["Mã lớp"] || "";
        const key = `${classCode}-${className}`;

        // Find class info using Class ID from session
        const classId = session["Class ID"];
        const classInfo = classes.find((c) => c.id === classId);

        // Find course using Khối and Môn học from class info
        const course = classInfo
          ? courses.find(
              (c) =>
                c.Khối === classInfo.Khối &&
                c["Môn học"] === classInfo["Môn học"]
            )
          : undefined;

        const salaryPerSession =
          record.bienChe === "Full-time"
            ? course?.["Lương GV Full-time"] || 0
            : course?.["Lương GV Part-time"] || 0;

        if (!classSummary[key]) {
          classSummary[key] = {
            className,
            classCode,
            sessionCount: 0,
            salaryPerSession,
            totalSalary: 0,
            totalAllowance: 0,
          };
        }

        classSummary[key].sessionCount++;
        classSummary[key].totalSalary += salaryPerSession;
        // Calculate allowance = allowancePerSession * sessionCount for this class
        classSummary[key].totalAllowance =
          travelAllowancePerSession * classSummary[key].sessionCount;
      });
    }

    const classData = Object.values(classSummary);

    const expandColumns = [
      {
        title: "Tên lớp",
        dataIndex: "className",
        key: "className",
        width: 250,
      },
      {
        title: "Mã lớp",
        dataIndex: "classCode",
        key: "classCode",
        width: 120,
      },
      {
        title: "Số buổi",
        dataIndex: "sessionCount",
        key: "sessionCount",
        width: 100,
        align: "center" as const,
        render: (count: number) => <Tag color="blue">{count} buổi</Tag>,
      },
      {
        title: "Lương/buổi",
        dataIndex: "salaryPerSession",
        key: "salaryPerSession",
        width: 150,
        align: "right" as const,
        render: (salary: number) => (
          <Text style={{ color: "#52c41a" }}>
            {salary.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
      {
        title: "Phụ cấp",
        dataIndex: "totalAllowance",
        key: "totalAllowance",
        width: 150,
        align: "right" as const,
        render: (allowance: number) => (
          <Text style={{ color: "#fa8c16" }}>
            {allowance.toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
      {
        title: "Tổng lương",
        key: "totalPay",
        width: 150,
        align: "right" as const,
        render: (_: any, row: any) => (
          <Text strong style={{ color: "#1890ff" }}>
            {(row.totalSalary + row.totalAllowance).toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
    ];

    return (
      <Table
        columns={expandColumns}
        dataSource={classData}
        pagination={false}
        rowKey={(row) => `${row.classCode}-${row.className}`}
        size="small"
        style={{ margin: "0 48px" }}
      />
    );
  };

  // Teacher salary columns
  const teacherColumns = [
    {
      title: "Mã GV",
      dataIndex: "teacherCode",
      key: "teacherCode",
      width: 100,
    },
    {
      title: "Họ tên",
      dataIndex: "teacherName",
      key: "teacherName",
      width: 180,
    },
    {
      title: "Biên chế",
      dataIndex: "bienChe",
      key: "bienChe",
      width: 120,
    },
    {
      title: "Số buổi",
      dataIndex: "totalSessions",
      key: "totalSessions",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Giờ dạy",
      key: "hours",
      width: 100,
      render: (_: any, record: TeacherSalary) => (
        <Text>
          {record.totalHours}h {record.totalMinutes}p
        </Text>
      ),
    },
    {
      title: "Lương + Phụ cấp",
      key: "totalPay",
      width: 150,
      render: (_: any, record: TeacherSalary) => (
        <Text strong style={{ color: "#36797f" }}>
          {(record.totalSalary + record.totalAllowance).toLocaleString("vi-VN")}{" "}
          đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: "paid" | "unpaid") => (
        <Tag color={status === "paid" ? "green" : "red"}>
          {status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_: any, record: TeacherSalary) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewTeacherSalary(record)}
          >
            Xem
          </Button>
          {record.status !== "paid" && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => updateTeacherSalaryStatus(record.id, "paid")}
            >
              Đã TT
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const studentTab = (
    <Space direction="vertical" className="w-full">
      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Tháng
            </Text>
            <DatePicker
              picker="month"
              value={dayjs().month(studentMonth).year(studentYear)}
              onChange={(date) => {
                if (date) {
                  setStudentMonth(date.month());
                  setStudentYear(date.year());
                }
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Trạng thái
            </Text>
            <Select
              value={studentStatusFilter}
              onChange={setStudentStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="unpaid">Chưa thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Text strong className="block mb-2">
              Tìm kiếm
            </Text>
            <Input
              placeholder="Tìm theo tên hoặc mã học sinh..."
              prefix={<SearchOutlined />}
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Summary */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Text type="secondary">Tổng phiếu thu</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#36797f" }}>
              {filteredStudentInvoices.length}
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text type="secondary">Đã thanh toán</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#52c41a" }}>
              {
                filteredStudentInvoices.filter((i) => i.status === "paid")
                  .length
              }
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text type="secondary">Tổng thu</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#36797f" }}>
              {filteredStudentInvoices
                .reduce((sum, i) => sum + i.finalAmount, 0)
                .toLocaleString("vi-VN")}{" "}
              đ
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={studentColumns}
        dataSource={filteredStudentInvoices}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.sessions.length > 0,
        }}
      />
    </Space>
  );

  const teacherTab = (
    <Space direction="vertical" className="w-full">
      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Tháng
            </Text>
            <DatePicker
              picker="month"
              value={dayjs().month(teacherMonth).year(teacherYear)}
              onChange={(date) => {
                if (date) {
                  setTeacherMonth(date.month());
                  setTeacherYear(date.year());
                }
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Biên chế
            </Text>
            <Select
              value={teacherBienCheFilter}
              onChange={setTeacherBienCheFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Trạng thái
            </Text>
            <Select
              value={teacherStatusFilter}
              onChange={setTeacherStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="unpaid">Chưa thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong className="block mb-2">
              Tìm kiếm
            </Text>
            <Input
              placeholder="Tìm theo tên hoặc mã giáo viên..."
              prefix={<SearchOutlined />}
              value={teacherSearchTerm}
              onChange={(e) => setTeacherSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Summary */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Text type="secondary">Tổng phiếu lương</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#36797f" }}>
              {filteredTeacherSalaries.length}
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text type="secondary">Đã thanh toán</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#52c41a" }}>
              {
                filteredTeacherSalaries.filter((s) => s.status === "paid")
                  .length
              }
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text type="secondary">Tổng chi</Text>
            <Title level={3} style={{ margin: "10px 0", color: "#36797f" }}>
              {filteredTeacherSalaries
                .reduce((sum, s) => sum + s.totalSalary + s.totalAllowance, 0)
                .toLocaleString("vi-VN")}{" "}
              đ
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={teacherColumns}
        dataSource={filteredTeacherSalaries}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        expandable={{
          expandedRowRender: expandedTeacherRowRender,
          rowExpandable: (record) => record.sessions.length > 0,
        }}
      />
    </Space>
  );

  return (
    <WrapperContent title="Hóa đơn & Biên nhận">
      <Tabs
        defaultActiveKey="students"
        items={[
          {
            key: "students",
            label: "Phiếu thu học phí",
            children: studentTab,
          },
          {
            key: "teachers",
            label: "Phiếu lương giáo viên",
            children: teacherTab,
          },
        ]}
      />
    </WrapperContent>
  );
};

export default InvoicePage;
