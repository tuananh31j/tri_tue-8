import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { ScheduleEvent } from "../types";
import PageHeader from "../layouts/PageHeader";

const DATABASE_URL_BASE =
  "https://morata-a9eba-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet";
const STUDENT_LIST_URL = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`;
const SCHEDULE_URL = `${DATABASE_URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`;
const EXTENSION_HISTORY_URL = `${DATABASE_URL_BASE}/Gia_h%E1%BA%A1n.json`;

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

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Add cache-busting parameter
        const response = await fetch(`${STUDENT_LIST_URL}?_=${Date.now()}`, {
          cache: "no-cache",
        });
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [userProfile, currentUser]);

  // Fetch extension history
  useEffect(() => {
    const fetchExtensionHistory = async () => {
      try {
        const response = await fetch(
          `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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

  // Calculate total hours for a student
  const calculateStudentHours = (
    studentName: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    const studentEvents = scheduleEvents.filter((event) =>
      event["Học sinh"]?.includes(studentName)
    );

    let filteredEvents = studentEvents;
    if (fromDate && toDate) {
      filteredEvents = studentEvents.filter((event) => {
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }

    let totalMinutes = 0;
    filteredEvents.forEach((event) => {
      const start = event["Giờ bắt đầu"] || "0:0";
      const end = event["Giờ kết thúc"] || "0:0";
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      const minutes = endH * 60 + endM - (startH * 60 + startM);
      if (minutes > 0) totalMinutes += minutes;
    });

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      totalSessions: filteredEvents.length,
    };
  };

  // Get student events by date range
  const getStudentEventsByDateRange = (
    studentName: string,
    fromDate?: Date,
    toDate?: Date
  ) => {
    // If no date range specified, use current month
    if (!fromDate || !toDate) {
      const now = new Date();
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return scheduleEvents
      .filter((event) => {
        if (!event["Học sinh"]?.includes(studentName)) return false;
        if (!event["Ngày"]) return false;
        const eventDate = new Date(event["Ngày"]);
        return eventDate >= fromDate! && eventDate <= toDate!;
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
      const teacherName = userProfile.teacherName;

      // Get unique student names from events taught by this teacher
      const teacherStudentNames = new Set<string>();
      scheduleEvents.forEach((event) => {
        if (event["Giáo viên phụ trách"] === teacherName && event["Học sinh"]) {
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
          student["Họ và tên"],
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
    scheduleEvents,
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
          alert("⚠️ You must be logged in to delete students");
          return;
        }
        const authToken = await currentUser.getIdToken();

        const url = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh/${student.id}.json?auth=${authToken}`;
        const response = await fetch(url, {
          method: "DELETE",
        });
        if (response.ok) {
          setStudents(students.filter((s) => s.id !== student.id));
          alert("Student deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
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
        const { id, ...dataWithoutId } = studentData as any;

        console.log("📤 Sending new student data:", dataWithoutId);

        const response = await fetch(STUDENT_LIST_URL, {
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
          alert("✅ Student added successfully!");
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to add student. Status:",
            response.status,
            errorText
          );
          alert(
            `❌ Failed to add student. Status: ${response.status}\n${errorText}`
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
        const url = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Fc_sinh/${studentData.id}.json`;
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
                  `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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
            `${STUDENT_LIST_URL}?_=${Date.now()}`,
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
            alert(
              `✅ Student updated and Hours Extended change logged!\nOld: ${oldHours}h → New: ${newHours}h`
            );
          } else {
            alert("✅ Student updated successfully!");
          }
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to update student. Status:",
            response.status,
            errorText
          );
          alert(`❌ Failed to update student. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student: " + error);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setEditModalOpen(true);
  };

  const handleExtendHours = (student: Student) => {
    console.log("🎯 Opening extend modal for student:", {
      id: student.id,
      name: student["Họ và tên"],
      currentExtended: student["Số giờ đã gia hạn"],
    });
    setExtendingStudent(student);
    setExtendModalOpen(true);
  };

  const handleEditExtension = (record: any) => {
    console.log("✏️ Editing extension record:", record);
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

      console.log("💾 Saving edited extension:", {
        recordId: editingExtension.id,
        oldHours,
        newHours,
        reason,
      });

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

      console.log("✅ Extension record updated");

      // Recalculate total extended hours
      const historyResponse = await fetch(
        `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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
      const studentUrl = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Fc_sinh/${studentId}.json`;
      const studentUpdateResponse = await fetch(studentUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "Số giờ đã gia hạn": totalExtended }),
      });

      if (!studentUpdateResponse.ok) {
        throw new Error(
          `Failed to update student: ${studentUpdateResponse.status}`
        );
      }

      // Refresh all data
      const refetchResponse = await fetch(
        `${STUDENT_LIST_URL}?_=${Date.now()}`,
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
        `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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
      alert("✅ Extension record updated successfully!");
    } catch (error) {
      console.error("Error updating extension:", error);
      alert("❌ Failed to update extension: " + error);
    }
  };

  const handleDeleteExtension = async (recordId: string, studentId: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this extension record?")) {
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
        `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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
      const studentUrl = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Fc_sinh/${studentId}.json`;
      const updateResponse = await fetch(studentUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "Số giờ đã gia hạn": totalExtended }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update student: ${updateResponse.status}`);
      }

      // Refresh all data
      const refetchResponse = await fetch(
        `${STUDENT_LIST_URL}?_=${Date.now()}`,
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
        `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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

      alert("✅ Extension record deleted successfully!");
    } catch (error) {
      console.error("Error deleting extension:", error);
      alert("❌ Failed to delete extension: " + error);
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
        alert("❌ Lỗi: Học sinh không có ID!");
        console.error("❌ Student missing ID:", extendingStudent);
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
        alert("❌ Không tìm thấy học sinh trong danh sách!");
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
          `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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
        const studentUrl = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Fc_sinh/${extendingStudent.id}.json`;
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
            `${STUDENT_LIST_URL}?_=${Date.now()}`,
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
            `${EXTENSION_HISTORY_URL}?_=${Date.now()}`,
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

          const action = additionalHours >= 0 ? "added" : "subtracted";
          const absHours = Math.abs(additionalHours);
          alert(
            `✅ Successfully ${action} ${absHours} hours for ${extendingStudent["Họ và tên"]}!\nNew total: ${totalExtended}h`
          );
        } else {
          const errorText = await updateResponse.text();
          console.error(
            "❌ Failed to update Firebase:",
            updateResponse.status,
            errorText
          );
          alert(
            `❌ Failed to update student. Status: ${updateResponse.status}`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error saving extension:", error);
      alert("❌ Failed to save extension. Check console for details.");
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
      student["Họ và tên"],
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
                        border-bottom: 4px solid #86c7cc;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo { max-width: 140px; height: 140px; object-fit: contain; }
                    .header-center { flex: 1; text-align: center; padding: 0 20px; }
                    .header-right { text-align: right; min-width: 140px; }
                    h1 {
                        color: #86c7cc;
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
                        color: #86c7cc;
                        font-size: 22px;
                        margin-top: 35px;
                        margin-bottom: 18px;
                        font-weight: bold;
                        text-transform: uppercase;
                        border-bottom: 3px solid #86c7cc;
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
                        background: #86c7cc;
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
                        color: #86c7cc;
                        text-transform: uppercase;
                        margin-bottom: 25px;
                        border-bottom: 3px solid #86c7cc;
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
                        color: #86c7cc;
                    }
                    .summary-label {
                        color: #333;
                        margin-top: 10px;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 60px;
                        padding-top: 25px;
                        border-top: 3px solid #86c7cc;
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
                        <h1>ACADEMIC REPORT</h1>
                        <p class="company-name">Trí Tuệ 8+</p>
                    </div>
                    <div class="header-right">
                        <p class="month-year">${fromDate.toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}</p>
                        ${
                          fromDate.getTime() !== toDate.getTime()
                            ? `<p class="month-year">to ${toDate.toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}</p>`
                            : ""
                        }
                    </div>
                </div>

                <h2>Student Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Full Name:</span>
                        <span class="info-value">${student["Họ và tên"]}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Student Code:</span>
                        <span class="info-value">${
                          student["Mã học sinh"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date of Birth:</span>
                        <span class="info-value">${
                          student["Ngày sinh"] || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone Number:</span>
                        <span class="info-value">${
                          student["Số điện thoại"] || "N/A"
                        }</span>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-title">ACADEMIC SUMMARY</div>
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
                            <div class="summary-value">${hoursExtendedFromHistory.toFixed(
                              2
                            )}h</div>
                            <div class="summary-label">Hours Extended</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${hoursRemaining.toFixed(
                              2
                            )}h</div>
                            <div class="summary-label">Remaining Hours</div>
                        </div>
                    </div>
                </div>

                <h2>Session Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                            <th>Content</th>
                            <th>Teacher</th>
                            <th>Comment</th>
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
                        <p><strong>Teacher In Charge</strong></p>
                        <div class="signature-line">Signature</div>
                    </div>
                    <div class="signature">
                        <p><strong>Parent/Guardian</strong></p>
                        <div class="signature-line">Signature</div>
                    </div>
                </div>

                <p style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
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
      <PageHeader
        title="STUDENT LIST"
        subtitle="Trí Tuệ 8+ - Student Management"
      />

      {/* Filters */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddStudent}
            className="px-6 py-3 bg-[#86c7cc] text-white rounded-lg font-semibold hover:bg-[#86c7cc] transition shadow-lg flex items-center gap-2"
          >
            <span className="text-xl text-white">+</span>
            <span>Add New Student</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, mã học sinh, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc] text-base"
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
              <span className="font-bold text-[#86c7cc]">
                {displayStudents.length}
              </span>{" "}
              học sinh
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#86c7cc]"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-[#86c7cc] to-[#86c7cc] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Student Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Hours Studied
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Hours Extended
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Hours Remaining
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider min-w-[280px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-red-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {student["Họ và tên"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student["Mã học sinh"] || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student["Số điện thoại"] || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student["Email"] || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-[#86c7cc]">
                          {student.hours}h {student.minutes}p
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-[#86c7cc]">
                          {student.hoursExtended || 0}h
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-green-600">
                          {student.hoursRemaining
                            ? student.hoursRemaining.toFixed(2)
                            : "0.00"}
                          h
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {student.totalSessions} sessions
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex gap-1 justify-center flex-wrap">
                          <button
                            onClick={() => handleStudentClick(student)}
                            className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-[#86c7cc]/20 text-[#86c7cc] bg-white hover:bg-[#86c7cc] hover:text-white hover:border-[#86c7cc] font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                            title="View Details"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleExtendHours(student)}
                            className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-green-200 text-green-600 bg-white hover:bg-green-600 hover:text-white hover:border-green-600 font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                            title="Extend Hours"
                          >
                            ⏰ Extension
                          </button>
                          <button
                            onClick={(e) => handleEditStudent(e, student)}
                            className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-blue-200 text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteStudent(e, student)}
                            className="px-3 py-1.5 inline-flex items-center justify-center gap-1 rounded-xl shadow-sm border border-red-200 text-red-600 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold text-xs transition-all duration-150 ease-out hover:scale-105 hover:shadow-md"
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && displayStudents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Chưa có học sinh nào</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal - Professional Design */}
      {isModalOpen &&
        selectedStudent &&
        (() => {
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
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 p-4"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-[#86c7cc] px-8 py-6 border-b-4 border-[#86c7cc]">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#86c7cc] hover:bg-[#86c7cc] flex items-center justify-center transition text-white text-2xl font-bold shadow-lg"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#86c7cc] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {selectedStudent["Họ và tên"].charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">
                        {selectedStudent["Họ và tên"]}
                      </h2>
                      <p className="text-red-100 text-sm font-medium uppercase tracking-wide">
                        Student Profile & Academic Record
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto p-6 bg-white">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#86c7cc]">
                      <div className="text-[#86c7cc] text-xs font-semibold uppercase tracking-wide mb-2">
                        Total Study Time
                      </div>
                      <div className="text-3xl font-bold text-[#86c7cc]">
                        {selectedStudent.hours}h {selectedStudent.minutes}m
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#86c7cc]">
                      <div className="text-[#86c7cc] text-xs font-semibold uppercase tracking-wide mb-2">
                        Total Sessions
                      </div>
                      <div className="text-3xl font-bold text-[#86c7cc]">
                        {selectedStudent.totalSessions}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-600">
                      <div className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">
                        Hours Extended
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {hoursExtendedFromHistory.toFixed(2)}h
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#86c7cc]">
                      <div className="text-[#86c7cc] text-xs font-semibold uppercase tracking-wide mb-2">
                        Remaining Hours
                      </div>
                      <div className="text-3xl font-bold text-[#86c7cc]">
                        {modalHoursRemaining.toFixed(2)}h
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="bg-white rounded-xl p-5 mb-6 shadow-md border-2 border-[#86c7cc]">
                    <h3 className="text-lg font-bold text-[#86c7cc] mb-4 pb-2 border-b-2 border-[#86c7cc]">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {selectedStudent["Mã học sinh"] && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-600 font-semibold min-w-[110px]">
                            Student Code:
                          </span>
                          <p className="font-bold text-[#86c7cc]">
                            {selectedStudent["Mã học sinh"]}
                          </p>
                        </div>
                      )}
                      {selectedStudent["Ngày sinh"] && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-600 font-semibold min-w-[110px]">
                            Date of Birth:
                          </span>
                          <p className="font-bold text-[#86c7cc]">
                            {selectedStudent["Ngày sinh"]}
                          </p>
                        </div>
                      )}
                      {selectedStudent["Số điện thoại"] && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-600 font-semibold min-w-[110px]">
                            Phone:
                          </span>
                          <p className="font-bold text-[#86c7cc]">
                            {selectedStudent["Số điện thoại"]}
                          </p>
                        </div>
                      )}
                      {selectedStudent["Email"] && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-600 font-semibold min-w-[110px]">
                            Email:
                          </span>
                          <p className="font-bold text-[#86c7cc]">
                            {selectedStudent["Email"]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sessions List */}
                  <div>
                    <div className="bg-white rounded-xl p-4 mb-4 shadow-md border-2 border-[#86c7cc] flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#86c7cc] mb-1">
                          Academic Sessions
                        </h3>
                        <p className="text-gray-600 text-xs font-medium">
                          {startDate && endDate
                            ? `${new Date(
                                startDate
                              ).toLocaleDateString()} - ${new Date(
                                endDate
                              ).toLocaleDateString()}`
                            : `${
                                months[new Date().getMonth()]
                              } ${new Date().getFullYear()}`}
                        </p>
                      </div>
                      <button
                        onClick={() => {
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
                          printReport(
                            selectedStudent,
                            getStudentEventsByDateRange(
                              selectedStudent["Họ và tên"],
                              fromDate,
                              toDate
                            )
                          );
                        }}
                        className="px-5 py-2 bg-[#86c7cc] text-white rounded-lg font-bold hover:bg-[#86c7cc] transition shadow-md text-xs uppercase tracking-wide"
                      >
                        Print Report
                      </button>
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
                            <div className="text-lg font-semibold text-[#86c7cc]">
                              No sessions in this month
                            </div>
                            <div className="text-gray-600 mt-2 text-sm">
                              Check another month for session history
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
                              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-l-4 border-[#86c7cc]">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#86c7cc] flex items-center justify-center text-white font-bold text-sm">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <div className="font-bold text-base text-[#86c7cc]">
                                      {event["Tên công việc"]}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                      📅{" "}
                                      {new Date(
                                        event["Ngày"]
                                      ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right bg-[#86c7cc] px-3 py-1.5 rounded-lg shadow-sm">
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
                                      👨‍🏫 Teacher:
                                    </span>
                                    <span className="font-bold text-[#86c7cc]">
                                      {event["Giáo viên phụ trách"]}
                                    </span>
                                  </div>
                                  {event["Địa điểm"] && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600 font-semibold text-sm">
                                        📍 Location:
                                      </span>
                                      <span className="font-bold text-[#86c7cc]">
                                        {event["Địa điểm"]}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {event["Phụ cấp di chuyển"] && (
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-gray-600 font-semibold text-sm">
                                      💰 Travel Allowance:
                                    </span>
                                    <span className="font-bold text-[#86c7cc]">
                                      {event["Phụ cấp di chuyển"]}
                                    </span>
                                  </div>
                                )}

                                {event["Nhận xét"] && (
                                  <div className="bg-red-50 rounded-lg p-3 border border-[#86c7cc]">
                                    <div className="text-xs font-bold text-[#86c7cc] mb-1 uppercase tracking-wide">
                                      Teacher's Comment:
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
                  </div>

                  {/* Extension History - JOIN với bảng Students */}
                  <div className="mt-6">
                    <div className="bg-linear-to-r from-[#86c7cc] to-[#86c7cc] rounded-xl p-6 mb-4 shadow-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            Extension History
                          </h3>
                          <p className="text-white/80 text-sm">
                            Payment and hour deposit records
                          </p>
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
                            <div className="text-right bg-white/10 rounded-lg px-6 py-3 backdrop-blur-sm">
                              <div className="text-white/80 text-xs font-medium uppercase tracking-wide">
                                Total Hours Deposited
                              </div>
                              <div className="text-white text-3xl font-bold mt-1">
                                {totalDeposited}h
                              </div>
                              <div className="text-white/60 text-xs mt-1">
                                {studentHistory.length} transaction(s)
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    {(() => {
                      // Filter theo studentId thay vì tên
                      const studentHistory = extensionHistory.filter(
                        (record) => record.studentId === selectedStudent.id
                      );

                      if (studentHistory.length === 0) {
                        return (
                          <div className="bg-white rounded-xl p-10 text-center shadow-md border-2 border-gray-200">
                            <div className="text-lg font-semibold text-gray-600">
                              No extension history yet
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                              Click "⏰ Extend Hours" to add the first deposit
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {studentHistory.map((record, index) => {
                            // JOIN: Lấy thông tin mới nhất từ bảng Students
                            const studentInfo =
                              students.find((s) => s.id === record.studentId) ||
                              selectedStudent;

                            return (
                              <div
                                key={record.id || index}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border-l-4 border-[#86c7cc]"
                              >
                                <div className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                          +{record["Giờ nhập thêm"]} giờ
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {record["Ngày nhập"]}{" "}
                                          {record["Giờ nhập"]}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                                        <div>
                                          <span className="text-gray-600">
                                            Người nhập:
                                          </span>
                                          <span className="font-semibold text-gray-800 ml-2">
                                            {record["Người nhập"]}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Giờ đã học:
                                          </span>
                                          <span className="font-semibold text-[#86c7cc] ml-2">
                                            {record["Giờ đã học"]}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Giờ còn lại:
                                          </span>
                                          <span className="font-semibold text-green-600 ml-2">
                                            {record["Giờ còn lại"]}h
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Họ tên (live):
                                          </span>
                                          <span className="font-semibold text-gray-800 ml-2">
                                            {studentInfo["Họ và tên"]}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Mã HS (live):
                                          </span>
                                          <span className="font-semibold text-gray-800 ml-2">
                                            {studentInfo["Mã học sinh"] ||
                                              "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                      <button
                                        onClick={() =>
                                          handleEditExtension(record)
                                        }
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                                        title="Edit this extension record"
                                      >
                                        ✏️ Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteExtension(
                                            record.id,
                                            record.studentId
                                          )
                                        }
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                                        title="Delete this extension record"
                                      >
                                        🗑️ Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto modal-content-70 flex flex-col">
            <div className="bg-[#86c7cc] text-white p-6 rounded-t-2xl shrink-0">
              <h2 className="text-2xl font-bold">
                {editingStudent && editingStudent.id
                  ? "Edit Student"
                  : "Add New Student"}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

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
                  "Họ và tên": formData.get("name") as string,
                  "Mã học sinh": studentCode,
                  "Ngày sinh": formData.get("dob") as string,
                  "Số điện thoại": formData.get("phone") as string,
                  "Trạng thái": formData.get("status") as string,
                  "Địa chỉ": formData.get("address") as string,
                  "Số giờ đã gia hạn":
                    editingStudent?.["Số giờ đã gia hạn"] || 0, // Preserve existing value or 0 for new students
                };
                // Preserve the ID if editing an existing student
                if (editingStudent?.id) {
                  studentData.id = editingStudent.id;
                }
                handleSaveStudent(studentData);
              }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingStudent?.["Họ và tên"] || ""}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    defaultValue={editingStudent?.["Ngày sinh"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingStudent?.["Số điện thoại"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    name="status"
                    defaultValue={editingStudent?.["Trạng thái"] || ""}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    defaultValue={editingStudent?.["Địa chỉ"] || ""}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#86c7cc] text-white rounded-lg font-semibold hover:bg-[#86c7cc] transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Hours Modal */}
      {isExtendModalOpen && extendingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full modal-content-70 overflow-hidden">
            <div className="bg-[#86c7cc] text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">💰 Adjust Hours Balance</h2>
              <p className="text-red-100 text-sm mt-1">
                Add or subtract hours from student account
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const additionalHours =
                  Number(formData.get("additionalHours")) || 0;
                handleSaveExtension(additionalHours);
              }}
              className="p-6"
            >
              <div className="space-y-4">
                {/* Họ và tên (auto) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={extendingStudent["Họ và tên"]}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Giờ nhập thêm - CHO PHÉP SỐ ÂM */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ➕➖ Add or Subtract Hours *
                  </label>
                  <input
                    type="number"
                    name="additionalHours"
                    step="0.5"
                    required
                    placeholder="+ to add, - to subtract (e.g., +50 or -10)"
                    className="w-full p-4 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc] text-xl font-bold text-center"
                  />
                </div>

                {/* Người nhập (auto) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Entered By
                  </label>
                  <input
                    type="text"
                    value={currentUsername}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Ngày nhập (auto) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString("en-US")}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Giờ nhập (auto) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleTimeString("en-US")}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setExtendModalOpen(false);
                    setExtendingStudent(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#86c7cc] text-white rounded-lg font-semibold hover:bg-[#86c7cc] transition shadow-lg"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Extension Modal */}
      {isEditExtensionModalOpen && editingExtension && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full modal-content-70 overflow-hidden">
            <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">✏️ Edit Extension Record</h2>
              <p className="text-blue-100 text-sm mt-1">
                Modify hour deposit and record the reason
              </p>
            </div>

            <form
              key={editingExtension.id}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newHours = Number(formData.get("newHours")) || 0;
                const reason = (formData.get("reason") as string) || "";
                handleSaveEditedExtension(newHours, reason);
              }}
              className="p-6"
            >
              <div className="space-y-4">
                {/* Original Hours (read-only) */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Hours
                  </label>
                  <div className="text-3xl font-bold text-[#86c7cc]">
                    {editingExtension["Giờ nhập thêm"]} hours
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Recorded on: {editingExtension["Ngày nhập"]} at{" "}
                    {editingExtension["Giờ nhập"]}
                  </div>
                </div>

                {/* New Hours */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Hours *
                  </label>
                  <input
                    type="number"
                    name="newHours"
                    step="0.5"
                    min="0"
                    required
                    key={`hours-${editingExtension.id}`}
                    defaultValue={editingExtension["Giờ nhập thêm"]}
                    placeholder="Enter new hour amount"
                    className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Edit *
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    placeholder="Example: Corrected entry error, updated payment amount, etc."
                    className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    ℹ️ This edit will be logged in the history for audit
                    purposes
                  </div>
                </div>

                {/* Edit History Preview */}
                {editingExtension["Edit History"] &&
                  editingExtension["Edit History"].length > 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                      <div className="text-sm font-semibold text-yellow-800 mb-2">
                        ⚠️ Previous Edits (
                        {editingExtension["Edit History"].length})
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                        {editingExtension["Edit History"].map(
                          (edit: any, idx: number) => (
                            <div key={idx} className="text-gray-700">
                              {edit["Edited Date"]}: {edit["Old Hours"]}h →{" "}
                              {edit["New Hours"]}h
                              <span className="text-gray-500 italic">
                                {" "}
                                ({edit["Reason"]})
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Current User */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edited By
                  </label>
                  <input
                    type="text"
                    value={currentUsername}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditExtensionModalOpen(false);
                    setEditingExtension(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentListView;
