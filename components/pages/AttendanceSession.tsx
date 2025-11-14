import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Checkbox,
  Input,
  InputNumber,
  Form,
  Space,
  message,
  Steps,
  Modal,
  Tag,
} from "antd";
import { SaveOutlined, CheckOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, push, set, update } from "firebase/database";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Class, AttendanceSession, AttendanceRecord } from "../../types";
import dayjs from "dayjs";
import WrapperContent from "@/components/WrapperContent";

interface Student {
  id: string;
  "Họ và tên": string;
  "Mã học sinh": string;
}

const AttendanceSessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const classData: Class = location.state?.classData;
  const sessionDate: string =
    location.state?.date || dayjs().format("YYYY-MM-DD");

  const [currentStep, setCurrentStep] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [totalExercises, setTotalExercises] = useState(0);
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [existingSession, setExistingSession] =
    useState<AttendanceSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    if (!classData) {
      message.error("Không tìm thấy thông tin lớp học");
      navigate("/workspace/attendance");
      return;
    }

    // Check if session already exists for this class and date (only completed sessions)
    const sessionsRef = ref(database, "datasheet/Điểm_danh_sessions");
    const unsubscribeSession = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessions = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<AttendanceSession, "id">),
        }));

        // Only load completed sessions
        const existing = sessions.find(
          (s) =>
            s["Class ID"] === classData.id &&
            s["Ngày"] === sessionDate &&
            s["Trạng thái"] === "completed"
        );

        if (existing) {
          setExistingSession(existing);
          setSessionId(existing.id);
          setAttendanceRecords(existing["Điểm danh"] || []);
          setHomeworkDescription(existing["Bài tập"]?.["Mô tả"] || "");
          setTotalExercises(existing["Bài tập"]?.["Tổng số bài"] || 0);
          setCurrentStep(1); // Go to step 2 to view/edit
        }
      }
      setLoadingSession(false);
    });

    // Load students
    const studentsRef = ref(database, "datasheet/Danh_sách_học_sinh");
    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allStudents = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Student, "id">),
        }));

        const classStudents = allStudents.filter((s) =>
          classData["Student IDs"]?.includes(s.id)
        );

        setStudents(classStudents);

        // Initialize attendance records only if no existing session
        if (!existingSession) {
          setAttendanceRecords(
            classStudents.map((s) => ({
              "Student ID": s.id,
              "Tên học sinh": s["Họ và tên"],
              "Có mặt": false,
              "Ghi chú": "",
            }))
          );
        }
      }
    });

    return () => {
      unsubscribeSession();
      unsubscribeStudents();
    };
  }, [classData, navigate, sessionDate, existingSession]);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record["Student ID"] === studentId
          ? { ...record, "Có mặt": present }
          : record
      )
    );
  };

  const handleSelectAll = (present: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => ({
        ...record,
        "Có mặt": present,
      }))
    );
  };

  const handleLateChange = (studentId: string, late: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => {
        if (record["Student ID"] === studentId) {
          const updated = { ...record };
          if (late) {
            updated["Đi muộn"] = true;
          } else {
            delete updated["Đi muộn"];
          }
          return updated;
        }
        return record;
      })
    );
  };

  const handleAbsentWithPermissionChange = (
    studentId: string,
    withPermission: boolean
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => {
        if (record["Student ID"] === studentId) {
          const updated = { ...record };
          if (withPermission) {
            updated["Vắng có phép"] = true;
          } else {
            delete updated["Vắng có phép"];
          }
          return updated;
        }
        return record;
      })
    );
  };

  const handleExercisesCompletedChange = (
    studentId: string,
    count: number | null
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => {
        if (record["Student ID"] === studentId) {
          const updated = { ...record };
          if (count !== null && count !== undefined) {
            updated["Bài tập hoàn thành"] = count;
          } else {
            delete updated["Bài tập hoàn thành"];
          }
          return updated;
        }
        return record;
      })
    );
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record["Student ID"] === studentId
          ? { ...record, "Ghi chú": note }
          : record
      )
    );
  };

  const handleScoreChange = (studentId: string, score: number | null) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => {
        if (record["Student ID"] === studentId) {
          const updated = { ...record };
          if (score !== null && score !== undefined) {
            updated["Điểm"] = score;
          } else {
            delete updated["Điểm"];
          }
          return updated;
        }
        return record;
      })
    );
  };

  // Helper function to remove undefined values
  const cleanData = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => cleanData(item));
    }
    if (obj !== null && typeof obj === "object") {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = cleanData(value);
        }
        return acc;
      }, {} as any);
    }
    return obj;
  };

  const handleSaveAttendance = () => {
    // Save attendance time info to state (will be saved to Firebase on complete)
    const attendanceTime = new Date().toISOString();
    const attendancePerson =
      userProfile?.displayName || userProfile?.email || "";

    // Store in a way that can be used later
    (window as any).__attendanceInfo = {
      time: attendanceTime,
      person: attendancePerson,
    };

    message.success("Đã lưu điểm danh tạm thời");
    setCurrentStep(1);
  };

  const handleCompleteSession = async () => {
    setSaving(true);
    try {
      const todaySchedule = classData["Lịch học"]?.find((s) => {
        const today = dayjs();
        const todayDayOfWeek = today.day() === 0 ? 8 : today.day() + 1;
        return s["Thứ"] === todayDayOfWeek;
      });

      const completionTime = new Date().toISOString();
      const completionPerson =
        userProfile?.displayName || userProfile?.email || "";

      // Get attendance info from step 1
      const attendanceInfo = (window as any).__attendanceInfo || {
        time: completionTime,
        person: completionPerson,
      };

      if (sessionId && existingSession) {
        // Update existing session
        const updateData = {
          "Trạng thái": "completed",
          "Điểm danh": attendanceRecords,
          "Thời gian hoàn thành": completionTime,
          "Người hoàn thành": completionPerson,
          "Bài tập":
            homeworkDescription || totalExercises
              ? {
                  "Mô tả": homeworkDescription,
                  "Tổng số bài": totalExercises,
                  "Người giao": completionPerson,
                  "Thời gian giao": completionTime,
                }
              : undefined,
        };

        const cleanedData = cleanData(updateData);
        const sessionRef = ref(
          database,
          `datasheet/Điểm_danh_sessions/${sessionId}`
        );
        await update(sessionRef, cleanedData);
      } else {
        // Create new session (only when completing)
        const sessionData: Omit<AttendanceSession, "id"> = {
          "Mã lớp": classData["Mã lớp"],
          "Tên lớp": classData["Tên lớp"],
          "Class ID": classData.id,
          Ngày: sessionDate,
          "Giờ bắt đầu": todaySchedule?.["Giờ bắt đầu"] || "",
          "Giờ kết thúc": todaySchedule?.["Giờ kết thúc"] || "",
          "Giáo viên": userProfile?.displayName || userProfile?.email || "",
          "Teacher ID": userProfile?.teacherId || userProfile?.uid || "",
          "Trạng thái": "completed",
          "Điểm danh": attendanceRecords,
          "Thời gian điểm danh": attendanceInfo.time,
          "Người điểm danh": attendanceInfo.person,
          "Thời gian hoàn thành": completionTime,
          "Người hoàn thành": completionPerson,
          "Bài tập":
            homeworkDescription || totalExercises
              ? {
                  "Mô tả": homeworkDescription,
                  "Tổng số bài": totalExercises,
                  "Người giao": completionPerson,
                  "Thời gian giao": completionTime,
                }
              : undefined,
          Timestamp: completionTime,
        };

        const cleanedData = cleanData(sessionData);
        const sessionsRef = ref(database, "datasheet/Điểm_danh_sessions");
        const newSessionRef = push(sessionsRef);
        await set(newSessionRef, cleanedData);
      }

      // Clear attendance info
      delete (window as any).__attendanceInfo;

      message.success("Đã hoàn thành buổi học");

      Modal.success({
        title: "Hoàn thành điểm danh",
        content: "Buổi học đã được lưu thành công!",
        onOk: () => navigate("/workspace/attendance"),
      });
    } catch (error) {
      console.error("Error completing session:", error);
      message.error("Không thể hoàn thành buổi học");
    } finally {
      setSaving(false);
    }
  };

  const attendanceColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã học sinh",
      dataIndex: "Mã học sinh",
      key: "code",
      width: 120,
      render: (_: any, record: Student) => record["Mã học sinh"],
    },
    {
      title: "Họ và tên",
      dataIndex: "Họ và tên",
      key: "name",
      render: (_: any, record: Student) => record["Họ và tên"],
    },
    {
      title: "Có mặt",
      key: "present",
      width: 100,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        return (
          <Checkbox
            checked={attendanceRecord?.["Có mặt"]}
            onChange={(e) =>
              handleAttendanceChange(record.id, e.target.checked)
            }
            disabled={currentStep !== 0}
          />
        );
      },
    },
    {
      title: "Ghi chú",
      key: "note",
      width: 200,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        return (
          <Input
            placeholder="Ghi chú"
            value={attendanceRecord?.["Ghi chú"]}
            onChange={(e) => handleNoteChange(record.id, e.target.value)}
            disabled={currentStep !== 0}
          />
        );
      },
    },
  ];

  const homeworkColumns = [
    ...attendanceColumns.slice(0, 3),
    {
      title: "Có mặt",
      key: "present",
      width: 80,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        return attendanceRecord?.["Có mặt"] ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <Tag color="red">Vắng</Tag>
        );
      },
    },
    {
      title: "Đi muộn",
      key: "late",
      width: 90,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        if (!attendanceRecord?.["Có mặt"]) return "-";
        return (
          <Checkbox
            checked={attendanceRecord?.["Đi muộn"] || false}
            onChange={(e) => handleLateChange(record.id, e.target.checked)}
          />
        );
      },
    },
    {
      title: "Vắng có phép",
      key: "permission",
      width: 110,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        if (attendanceRecord?.["Có mặt"]) return "-";
        return (
          <Checkbox
            checked={attendanceRecord?.["Vắng có phép"] || false}
            onChange={(e) =>
              handleAbsentWithPermissionChange(record.id, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Bài tập hoàn thành",
      key: "exercises",
      width: 120,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        if (!attendanceRecord?.["Có mặt"]) return "-";

        return (
          <InputNumber
            min={0}
            max={totalExercises || 100}
            placeholder="Số bài"
            value={attendanceRecord?.["Bài tập hoàn thành"] ?? null}
            onChange={(value) =>
              handleExercisesCompletedChange(record.id, value)
            }
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Điểm",
      key: "score",
      width: 100,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        if (!attendanceRecord?.["Có mặt"]) return "-";

        return (
          <InputNumber
            min={0}
            max={10}
            step={0.5}
            placeholder="Điểm"
            value={attendanceRecord?.["Điểm"] ?? null}
            onChange={(value) => handleScoreChange(record.id, value)}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Ghi chú",
      key: "note",
      width: 150,
      render: (_: any, record: Student) => {
        const attendanceRecord = attendanceRecords.find(
          (r) => r["Student ID"] === record.id
        );
        return (
          <Input
            placeholder="Ghi chú"
            value={attendanceRecord?.["Ghi chú"]}
            onChange={(e) => handleNoteChange(record.id, e.target.value)}
          />
        );
      },
    },
  ];

  if (!classData) {
    return null;
  }

  const presentCount = attendanceRecords.filter((r) => r["Có mặt"]).length;
  const absentCount = attendanceRecords.length - presentCount;

  return (
    <WrapperContent title="Điểm danh" isLoading={loadingSession}>
      {existingSession && (
        <Card
          style={{
            marginBottom: 16,
            backgroundColor: "#e6f7ff",
            borderColor: "#91d5ff",
          }}
          size="small"
        >
          <p style={{ margin: 0 }}>
            ℹ️ Buổi học này đã được điểm danh trước đó. Bạn có thể xem lại hoặc
            chỉnh sửa thông tin.
          </p>
        </Card>
      )}

      <Card
        title={
          <div>
            <h2 style={{ margin: 0 }}>{classData["Tên lớp"]}</h2>
            <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
              {dayjs(sessionDate).format("dddd, DD/MM/YYYY")}
            </p>
          </div>
        }
      >
        <Steps
          current={currentStep}
          items={[
            {
              title: "Điểm danh",
              description: "Ghi nhận học sinh có mặt",
            },
            {
              title: "Giao bài tập",
              description: "Chấm điểm và giao bài tập",
            },
          ]}
          style={{ marginBottom: 32 }}
        />

        {currentStep === 0 && (
          <div>
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <span>Tổng: {students.length}</span>
                <span style={{ color: "green" }}>Có mặt: {presentCount}</span>
                <span style={{ color: "red" }}>Vắng: {absentCount}</span>
              </Space>
              <Space>
                <Button
                  size="small"
                  onClick={() => handleSelectAll(true)}
                  icon={<CheckOutlined />}
                >
                  Chọn tất cả
                </Button>
                <Button size="small" onClick={() => handleSelectAll(false)}>
                  Bỏ chọn tất cả
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveAttendance}
                >
                  Tiếp tục
                </Button>
              </Space>
            </div>

            <Table
              columns={attendanceColumns}
              dataSource={students}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Card title="Bài tập về nhà" style={{ marginBottom: 16 }}>
              <Form layout="vertical">
                <Form.Item label="Mô tả bài tập">
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập mô tả bài tập..."
                    value={homeworkDescription}
                    onChange={(e) => setHomeworkDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Tổng số bài tập">
                  <InputNumber
                    min={0}
                    placeholder="Số lượng bài tập"
                    value={totalExercises}
                    onChange={(value) => setTotalExercises(value || 0)}
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Form>
            </Card>

            <Card title="Chấm điểm học sinh">
              <Table
                columns={homeworkColumns}
                dataSource={students}
                rowKey="id"
                pagination={false}
              />
            </Card>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>Quay lại</Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleCompleteSession}
                  loading={saving}
                >
                  Hoàn thành buổi học
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Card>
    </WrapperContent>
  );
};

export default AttendanceSessionPage;
