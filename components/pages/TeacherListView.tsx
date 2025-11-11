import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { isAdmin } from "../../config/admins";
import type { ScheduleEvent } from "../../types";
import PageHeader from "../../layouts/PageHeader";
import { DATABASE_URL_BASE } from "@/firebase";

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
    teacherName: string,
    fromDate?: Date,
    toDate?: Date
  ): number => {
    const teacherEvents = scheduleEvents.filter((event) => {
      const eventTeacher = normalizeName(event["Giáo viên phụ trách"] || "");
      return eventTeacher === teacherName;
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
    teacherName: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    console.log(`\n📊 Calculating for: "${teacherName}"`);

    const teacherEvents = scheduleEvents.filter((event) => {
      const eventTeacher = normalizeName(event["Giáo viên phụ trách"] || "");
      const matches = eventTeacher === teacherName;
      if (matches) {
        console.log(`  ✅ Match: "${eventTeacher}" === "${teacherName}"`);
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
    teacherName: string,
    month: number,
    year: number
  ) => {
    return scheduleEvents
      .filter((event) => {
        const eventTeacher = normalizeName(event["Giáo viên phụ trách"] || "");
        if (eventTeacher !== teacherName) return false;
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

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
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
      const stats = calculateTeacherHours(teacherName, fromDate, toDate);
      const travelAllowance = calculateTravelAllowance(
        teacherName,
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
    searchTerm,
    currentUser,
    userProfile,
  ]);

  // Group teachers by Biên chế
  const groupedTeachers = displayTeachers.reduce(
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

  const sortedGroups = Object.keys(groupedTeachers).sort();

  const handleEditTeacher = (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    setEditingTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleDeleteTeacher = async (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete teacher "${getTeacherName(teacher)}"?`
      )
    ) {
      try {
        const url = `${DATABASE_URL_BASE}/Gi%C3%A1o_vi%C3%AAn/${teacher.id}.json`;
        const response = await fetch(url, {
          method: "DELETE",
        });
        if (response.ok) {
          setTeachers(teachers.filter((t) => t.id !== teacher.id));
          alert("Teacher deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        alert("Failed to delete teacher");
      }
    }
  };

  const handleSaveTeacher = async (teacherData: Partial<Teacher>) => {
    try {
      const isNew = !teacherData.id;

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
          alert("✅ Teacher added successfully!");
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to add teacher. Status:",
            response.status,
            errorText
          );
          alert(`❌ Failed to add teacher. Status: ${response.status}`);
        }
      } else {
        // Update existing teacher
        const url = `${DATABASE_URL_BASE}/Gi%C3%A1o_vi%C3%AAn/${teacherData.id}.json`;
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
          alert("✅ Teacher updated successfully!");
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to update teacher. Status:",
            response.status,
            errorText
          );
          alert(`❌ Failed to update teacher. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save teacher: " + error);
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setEditModalOpen(true);
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
                        <h1>TEACHING HOURS REPORT</h1>
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
                        <span class="info-label">Full Name:</span>
                        <span class="info-value">${teacherName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone:</span>
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
                        <span class="info-label">Employment Status:</span>
                        <span class="info-value">${
                          teacher["Biên chế"] || "N/A"
                        }</span>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-title">TEACHING SUMMARY</div>
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
                            <div class="summary-label">Status</div>
                        </div>
                    </div>
                </div>

                <h2>Teaching Session Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                            <th>Content</th>
                            <th>Student</th>
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
                        <p><strong>Teacher</strong></p>
                        <div class="signature-line">Signature</div>
                    </div>
                    <div class="signature">
                        <p><strong>Manager</strong></p>
                        <div class="signature-line">Signature</div>
                    </div>
                </div>

                <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
                    Printed on: ${new Date().toLocaleDateString(
                      "en-US"
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
    <>
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add New Teacher button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTeacher}
            className="px-6 py-3 bg-[#36797f] text-white rounded-lg font-semibold hover:bg-[#36797f] transition shadow-lg flex items-center gap-2 z-10 relative"
          >
            <span className="text-xl text-white font-bold">
              + Thêm giáo viên mới
            </span>
          </button>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, mã giáo viên, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f] text-base"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-bold text-[#36797f]">
                {displayTeachers.length}
              </span>{" "}
              giáo viên
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-transparent"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-transparent"
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tình trạng biên chế
              </label>
              <select
                value={selectedBienChe}
                onChange={(e) => setSelectedBienChe(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                {[
                  ...new Set(
                    teachers.map((t) => t["Biên chế"] || "Unclassified")
                  ),
                ]
                  .sort()
                  .map((bienChe) => (
                    <option key={bienChe} value={bienChe}>
                      {bienChe}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-transparent"
              />
            </div>
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Xóa bộ lọc ngày
            </button>
          )}
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Statistics */}
            <div
              style={{
                background: "linear-gradient(to right, #36797f, #36797f)",
              }}
              className="text-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Tổng quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-primary text-3xl font-bold">
                    {displayTeachers.length}
                  </div>
                  <div className="text-primary text-sm mt-1">
                    Tổng giáo viên
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-primary text-3xl font-bold">
                    {sortedGroups.length}
                  </div>
                  <div className="text-primary text-sm mt-1">Loại biên chế</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-primary text-3xl font-bold">
                    {displayTeachers.reduce(
                      (sum, t) => sum + t.totalSessions,
                      0
                    )}
                  </div>
                  <div className="text-primary text-sm mt-1">Tổng buổi dạy</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-primary text-3xl font-bold">
                    {Math.floor(
                      displayTeachers.reduce(
                        (sum, t) => sum + t.hours * 60 + t.minutes,
                        0
                      ) / 60
                    )}
                    h
                  </div>
                  <div className="text-primary text-sm mt-1">Tổng giờ dạy</div>
                </div>
              </div>
            </div>

            {sortedGroups.map((bienChe) => {
              const teachersInGroup = groupedTeachers[bienChe];
              return (
                <div key={bienChe} className="mb-6">
                  {/* Group Header */}
                  <div
                    style={{
                      background: "linear-gradient(to right, #36797f, #36797f)",
                    }}
                    className="text-white px-6 py-4 rounded-t-xl shadow-lg sticky top-0 z-10"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="bg-white text-[#36797f] rounded-full px-4 py-1 text-lg font-bold">
                          {teachersInGroup.length}
                        </span>
                        {bienChe}
                      </h2>
                      <div className="text-sm bg-[#36797f] px-3 py-1 rounded-full">
                        {teachersInGroup.length} giáo viên
                      </div>
                    </div>
                  </div>
                  {/* Teachers in this group */}
                  <div className="bg-white rounded-b-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-100 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Họ tên
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Số điện thoại
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Tổng giờ dạy
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Buổi dạy
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Trợ cấp đi lại
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#2A0A0B] uppercase tracking-wider">
                              Hành động
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teachersInGroup.map((teacher, index) => {
                            const teacherName = getTeacherName(teacher);
                            return (
                              <tr
                                key={index}
                                className="hover:bg-red-50 transition"
                              >
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {teacherName}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {teacher["SĐT"] ||
                                    teacher["Số điện thoại"] ||
                                    "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {teacher["Email"] ||
                                    teacher["Email công ty"] ||
                                    "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="text-sm font-bold text-[#36797f]">
                                    {teacher.hours}h {teacher.minutes}p
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-[#36797f]">
                                    {teacher.totalSessions} Buổi
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="text-sm font-bold text-green-600">
                                    {teacher.totalTravelAllowance
                                      ? teacher.totalTravelAllowance.toLocaleString(
                                          "vi-VN"
                                        )
                                      : "0"}{" "}
                                    VNĐ
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => {
                                        setSelectedTeacher(teacher);
                                        setModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-[#36797f]/20 text-[#36797f] bg-white hover:bg-[#36797f] hover:text-white hover:border-[#36797f] font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                                      title="View Details"
                                    >
                                      👁️ Xem
                                    </button>
                                    <button
                                      onClick={(e) =>
                                        handleEditTeacher(e, teacher)
                                      }
                                      className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-blue-200 text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                                      title="Edit"
                                    >
                                      ✏️ Sửa
                                    </button>
                                    <button
                                      onClick={(e) =>
                                        handleDeleteTeacher(e, teacher)
                                      }
                                      className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-red-200 text-red-600 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                                      title="Delete"
                                    >
                                      🗑️ Xóa
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teacher Detail Modal */}
      {isModalOpen && selectedTeacher && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content-70 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-linear-to-r from-green-600 to-[#36797f] text-white p-6 rounded-t-2xl shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {getTeacherName(selectedTeacher)}
                  </h2>
                  <p className="text-red-100">
                    SĐT:{" "}
                    {selectedTeacher["SĐT"] ||
                      selectedTeacher["Số điện thoại"] ||
                      "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  ✖
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Teacher Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg text-center">
                  <div className="text-primary text-3xl font-bold text-[#36797f]">
                    {selectedTeacher.hours}h {selectedTeacher.minutes}p
                  </div>
                  <div className="text-gray-600 mt-2">Tổng giờ dạy</div>
                </div>
                <div className="bg-linear-to-br from-red-100 to-red-100 p-4 rounded-lg text-center">
                  <div className="text-primary text-3xl font-bold text-[#36797f]">
                    {selectedTeacher.totalSessions}
                  </div>
                  <div className="text-gray-600 mt-2">Tổng số buổi dạy</div>
                </div>
              </div>

              {/* Sessions List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    📅 Lịch giảng dạy - {months[selectedMonth]} {selectedYear}
                  </h3>
                  <button
                    onClick={() =>
                      printReport(
                        selectedTeacher,
                        getTeacherEventsByMonth(
                          getTeacherName(selectedTeacher),
                          selectedMonth,
                          selectedYear
                        )
                      )
                    }
                    className="px-4 py-2 bg-[#36797f] text-white rounded-lg hover:bg-[#36797f] transition font-semibold"
                  >
                    🖨️ In phiếu báo
                  </button>
                </div>
                {(() => {
                  const events = getTeacherEventsByMonth(
                    getTeacherName(selectedTeacher),
                    selectedMonth,
                    selectedYear
                  );
                  if (events.length === 0) {
                    return (
                      <div className="text-center py-10 text-gray-500">
                        <p>Không có buổi dạy nào trong tháng này</p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-3">
                      {events.map((event, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#36797f]"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {event["Tên công việc"]}
                            </h4>
                            <span className="text-sm text-gray-600">
                              {new Date(event["Ngày"]).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>
                              {event["Giờ bắt đầu"]} - {event["Giờ kết thúc"]}
                            </p>
                            <p>{event["Học sinh"] || "N/A"}</p>
                          </div>
                          {event["Nhận xét"] && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {event["Nhận xét"]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content-70 flex flex-col">
            <div className="bg-[#36797f] text-white p-6 rounded-t-2xl shrink-0">
              <h2 className="text-2xl font-bold">
                {editingTeacher && editingTeacher.id
                  ? "Chỉnh sửa giáo viên"
                  : "Thêm giáo viên mới"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                // Auto-generate Teacher Code if adding new teacher
                let teacherCode = editingTeacher?.["Mã giáo viên"] || "";
                if (!editingTeacher?.id) {
                  // Generate new code: GV001, GV002, etc.
                  const existingCodes = teachers
                    .map((t) => t["Mã giáo viên"])
                    .filter((code) => code && code.startsWith("GV"))
                    .map((code) => parseInt(code.replace("GV", "")) || 0);
                  const maxNumber =
                    existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
                  teacherCode = `GV${String(maxNumber + 1).padStart(3, "0")}`;
                }

                const teacherData: Partial<Teacher> = {
                  "Họ và tên": formData.get("name") as string,
                  "Mã giáo viên": teacherCode,
                  SĐT: formData.get("phone") as string,
                  Email: formData.get("email") as string,
                  "Biên chế": formData.get("status") as string,
                  "Vị trí": (formData.get("position") as string) || "Teacher",
                  "Ngân hàng": formData.get("bank") as string,
                  STK: formData.get("account") as string,
                  "Địa chỉ": formData.get("address") as string,
                };

                // Only update password if a new one is provided
                const newPassword = formData.get("password") as string;
                if (newPassword && newPassword.trim()) {
                  teacherData["Password"] = newPassword.trim();
                } else if (!editingTeacher?.id) {
                  // For new teachers, password is required
                  alert("Mật khẩu bắt buộc nhập");
                  return;
                }
                // Preserve the ID if editing an existing teacher
                if (editingTeacher?.id) {
                  teacherData.id = editingTeacher.id;
                }
                handleSaveTeacher(teacherData);
              }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTeacher?.["Họ và tên"] || ""}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={
                      editingTeacher?.["SĐT"] ||
                      editingTeacher?.["Số điện thoại"] ||
                      ""
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={
                      editingTeacher?.["Email"] ||
                      editingTeacher?.["Email công ty"] ||
                      ""
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    name="password"
                    defaultValue={editingTeacher?.["Password"] || ""}
                    required={!editingTeacher?.id}
                    placeholder={
                      editingTeacher?.id
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tình trạng biên chế
                  </label>
                  <select
                    name="status"
                    defaultValue={editingTeacher?.["Biên chế"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="Full-time">Toàn thời gian</option>
                    <option value="Part-time">Bán thời gian</option>
                  </select>
                </div>
                {/* Position field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vị trí
                  </label>
                  <select
                    name="position"
                    defaultValue={editingTeacher?.["Vị trí"] || "Teacher"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                    required
                  >
                    <option value="Teacher">Giáo viên</option>
                    <option value="Admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngân hàng
                  </label>
                  <input
                    type="text"
                    name="bank"
                    defaultValue={editingTeacher?.["Ngân hàng"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    name="account"
                    defaultValue={editingTeacher?.["STK"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    defaultValue={editingTeacher?.["Địa chỉ"] || ""}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#36797f] text-white rounded-lg font-semibold hover:bg-[#36797f] transition"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherListView;
