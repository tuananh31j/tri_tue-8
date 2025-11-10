import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../layouts/PageHeader";
import app from "../firebase";

const derivedDatabaseUrl = ((app as any)?.options?.databaseURL as string) || "";
let DATABASE_URL_BASE = "";
if (derivedDatabaseUrl) {
  DATABASE_URL_BASE = `${derivedDatabaseUrl.replace(/\/$/, "")}/datasheet`;
} else {
  DATABASE_URL_BASE =
    "https://morata-a9eba-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet";
}

const STUDENT_LIST_URL = `${DATABASE_URL_BASE}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`;
const ATTENDANCE_URL = `${DATABASE_URL_BASE}/Di%E1%BB%87m_danh.json`;

interface Student {
  id: string;
  "Họ và tên": string;
  "Mã học sinh"?: string;
  "Số điện thoại"?: string;
  [key: string]: any;
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  studentCode?: string;
  date: string;
  present: boolean;
  submittedBy: string;
  timestamp: string;
}

const AttendanceView: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${STUDENT_LIST_URL}?_=${Date.now()}`, {
          cache: "no-cache",
        });
        const data = await response.json();
        if (data) {
          let studentsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          // Filter students if teacher (not admin)
          if (!userProfile?.isAdmin && userProfile?.teacherName) {
            // Get schedule to find which students this teacher teaches
            const scheduleResponse = await fetch(
              `${DATABASE_URL_BASE}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`
            );
            const scheduleData = await scheduleResponse.json();

            if (scheduleData) {
              const teacherStudentNames = new Set<string>();
              Object.values(scheduleData).forEach((event: any) => {
                if (
                  event["Giáo viên phụ trách"] === userProfile.teacherName &&
                  event["Học sinh"]
                ) {
                  event["Học sinh"].forEach((name: string) =>
                    teacherStudentNames.add(name)
                  );
                }
              });

              studentsArray = studentsArray.filter((student) =>
                teacherStudentNames.has(student["Họ và tên"])
              );
            }
          }

          setStudents(studentsArray);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [userProfile]);

  // Load existing attendance for selected date
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetch(`${ATTENDANCE_URL}?_=${Date.now()}`, {
          cache: "no-cache",
        });
        const data = await response.json();

        if (data) {
          const todayAttendance: { [key: string]: boolean } = {};
          Object.values(data).forEach((record: any) => {
            if (record.date === selectedDate) {
              todayAttendance[record.studentId] = record.present;
            }
          });
          setAttendance(todayAttendance);
        }
      } catch (error) {
        console.error("Error loading attendance:", error);
      }
    };
    loadAttendance();
  }, [selectedDate]);

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newAttendance: { [key: string]: boolean } = {};
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = checked;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const now = new Date();
      const submittedBy =
        userProfile?.teacherName || currentUser?.email || "Unknown";

      // Prepare attendance records

      const records: AttendanceRecord[] = Object.entries(attendance)
        .map(([studentId, value]) => {
          if (!value) return;
          const student = students.find((s) => s.id === studentId);
          return {
            studentId,
            studentName: student?.["Họ và tên"] || "Unknown",
            studentCode: student?.["Mã học sinh"],
            date: selectedDate,
            present: attendance[studentId],
            submittedBy,
            timestamp: now.toISOString(),
          };
        })
        .filter(Boolean) as AttendanceRecord[];

      console.log(
        "Submitting attendance records:",
        records,
        students,
        attendance
      );

      // Delete existing records for this date first
      const existingResponse = await fetch(
        `${ATTENDANCE_URL}?_=${Date.now()}`,
        {
          cache: "no-cache",
        }
      );
      const existingData = await existingResponse.json();

      if (existingData) {
        const deletePromises = Object.entries(existingData)
          .filter(([_, record]: [string, any]) => record.date === selectedDate)
          .map(([id, _]) =>
            fetch(`${DATABASE_URL_BASE}/Di%E1%BB%87m_danh/${id}.json`, {
              method: "DELETE",
            })
          );
        await Promise.all(deletePromises);
      }

      // Save new attendance records
      const savePromises = records.map((record) =>
        fetch(ATTENDANCE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        })
      );

      await Promise.all(savePromises);

      alert(
        `✅ Điểm danh thành công cho ngày ${new Date(
          selectedDate
        ).toLocaleDateString("vi-VN")}!\nĐã điểm danh ${
          records.length
        } học sinh.`
      );
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("❌ Lỗi khi lưu điểm danh. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      student["Họ và tên"]?.toLowerCase().includes(search) ||
      student["Mã học sinh"]?.toLowerCase().includes(search) ||
      student["Số điện thoại"]?.toLowerCase().includes(search)
    );
  });

  const presentCount = Object.values(attendance).filter(
    (present) => present
  ).length;
  const absentCount = filteredStudents.length - presentCount;

  return (
    <>
      <PageHeader
        title="STUDENT ATTENDANCE"
        subtitle="Trí Tuệ 8+ - Attendance Management"
        icon="✅"
        sticky
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Date Selector & Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc] text-lg font-semibold"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {presentCount}
                </div>
                <div className="text-sm text-green-700 font-semibold">
                  Present
                </div>
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <div className="text-3xl font-bold text-red-600">
                  {absentCount}
                </div>
                <div className="text-sm text-red-700 font-semibold">Absent</div>
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search Student
              </label>
              <input
                type="text"
                placeholder="Search by name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc]"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#86c7cc]"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-[#86c7cc] to-[#86c7cc] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Student Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <span>Present</span>
                        <input
                          type="checkbox"
                          checked={
                            filteredStudents.length > 0 &&
                            filteredStudents.every((s) => attendance[s.id])
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 cursor-pointer"
                          title="Select All"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-red-50 transition ${
                        attendance[student.id] ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={attendance[student.id] || false}
                          onChange={(e) =>
                            handleCheckboxChange(student.id, e.target.checked)
                          }
                          className="w-6 h-6 cursor-pointer accent-green-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {filteredStudents.length}
                  </span>{" "}
                  students |
                  <span className="text-green-600 font-semibold ml-2">
                    {presentCount} present
                  </span>{" "}
                  |
                  <span className="text-red-600 font-semibold ml-2">
                    {absentCount} absent
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || filteredStudents.length === 0}
                  className="px-8 py-3 bg-[#86c7cc] text-white rounded-lg font-bold hover:bg-[#86c7cc] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>✅ Submit Attendance</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceView;
