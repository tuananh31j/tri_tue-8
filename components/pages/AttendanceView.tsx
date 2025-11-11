import { useAuth } from "@/contexts/AuthContext";
import { DATABASE_URL_BASE as BASE_URL } from "@/firebase";
import PageHeader from "@/layouts/PageHeader";
import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Input,
  Table,
  Checkbox,
  Button,
  Card,
  Spin,
  Space,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import WrapperContent from "@/components/WrapperContent";

let DATABASE_URL_BASE = BASE_URL + "/datasheet";

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
      <WrapperContent title="Lịch làm việc">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Date Selector & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Date Selector */}
            <Card title="📅 Select Date" size="small">
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(date) =>
                  setSelectedDate(
                    date
                      ? date.format("YYYY-MM-DD")
                      : new Date().toISOString().split("T")[0]
                  )
                }
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
                className="w-full"
                size="large"
              />
            </Card>

            {/* Stats */}
            <Card title="Attendance Statistics" size="small">
              <Space direction="horizontal" size="large">
                <Statistic
                  title="Present"
                  value={presentCount}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<CheckCircleOutlined />}
                />
                <Statistic
                  title="Absent"
                  value={absentCount}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<CloseCircleOutlined />}
                />
              </Space>
            </Card>

            {/* Search */}
            <Card title="🔍 Search Student" size="small">
              <Input
                placeholder="Search by name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
              />
            </Card>
          </div>

          {/* Attendance Table */}
          {loading ? (
            <Card>
              <div className="text-center py-20">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Loading students...</p>
              </div>
            </Card>
          ) : (
            <Card>
              <Table
                dataSource={filteredStudents.map((student, index) => ({
                  key: student.id,
                  index: index + 1,
                  name: student["Họ và tên"],
                  code: student["Mã học sinh"] || "-",
                  phone: student["Số điện thoại"] || "-",
                  present: attendance[student.id] || false,
                  id: student.id,
                }))}
                columns={[
                  {
                    title: "#",
                    dataIndex: "index",
                    key: "index",
                    width: 60,
                    align: "center",
                  },
                  {
                    title: "Student Name",
                    dataIndex: "name",
                    key: "name",
                    render: (text) => <strong>{text}</strong>,
                  },
                  {
                    title: "Student Code",
                    dataIndex: "code",
                    key: "code",
                  },
                  {
                    title: "Phone",
                    dataIndex: "phone",
                    key: "phone",
                  },
                  {
                    title: (
                      <div className="flex items-center justify-center gap-2">
                        <span>Present</span>
                        <Checkbox
                          checked={
                            filteredStudents.length > 0 &&
                            filteredStudents.every((s) => attendance[s.id])
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </div>
                    ),
                    dataIndex: "present",
                    key: "present",
                    align: "center",
                    render: (present, record) => (
                      <Checkbox
                        checked={present}
                        onChange={(e) =>
                          handleCheckboxChange(record.id, e.target.checked)
                        }
                      />
                    ),
                  },
                ]}
                pagination={false}
                scroll={{ x: 800 }}
                rowClassName={(record) =>
                  attendance[record.id] ? "bg-green-50" : ""
                }
              />

              {/* Submit Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
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
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={submitting || filteredStudents.length === 0}
                    loading={submitting}
                    icon={<CheckCircleOutlined />}
                  >
                    {submitting ? "Submitting..." : "Submit Attendance"}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </WrapperContent>
    </>
  );
};

export default AttendanceView;
