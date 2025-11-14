import { useState, useEffect } from "react";
import { Card, Table, Tag, Tabs, Descriptions, Empty, Button } from "antd";
import { UserAddOutlined, HistoryOutlined } from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { useAuth } from "../../contexts/AuthContext";
import { Class } from "../../types";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../AddStudentModal";
import WrapperContent from "@/components/WrapperContent";

interface Student {
  id: string;
  "Họ và tên": string;
  "Mã học sinh": string;
  "Ngày sinh"?: string;
  "Số điện thoại"?: string;
  Email?: string;
}

const TeacherClassView = () => {
  const { userProfile } = useAuth();
  const { classes, loading } = useClasses();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [teacherData, setTeacherData] = useState<any>(null);

  const teacherId = userProfile?.teacherId || userProfile?.uid || "";

  // Load teacher data to get actual teacher ID from Giáo_viên table
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
          console.log("TeacherClassView - Found teacher:", { id, teacher });
          setTeacherData({ id, ...(teacher as any) });
        }
      }
    });
    return () => unsubscribe();
  }, [userProfile?.email]);

  useEffect(() => {
    const studentsRef = ref(database, "datasheet/Danh_sách_học_sinh");
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Student, "id">),
        }));
        setStudents(studentList);
      }
    });
    return () => unsubscribe();
  }, []);

  // Use teacherData.id if available, otherwise fallback to teacherId from profile
  const actualTeacherId = teacherData?.id || teacherId;

  console.log("TeacherClassView - Filter info:", {
    userProfile,
    teacherId,
    teacherDataId: teacherData?.id,
    actualTeacherId,
    allClasses: classes.map((c) => ({
      id: c.id,
      name: c["Tên lớp"],
      teacherId: c["Teacher ID"],
    })),
  });

  const myClasses = classes.filter((c) => {
    const match = c["Teacher ID"] === actualTeacherId;
    console.log(
      "Checking class:",
      c["Tên lớp"],
      "Teacher ID:",
      c["Teacher ID"],
      "Match:",
      match
    );
    return match;
  });

  const getClassStudents = (classData: Class) => {
    return students.filter((s) => classData["Student IDs"]?.includes(s.id));
  };

  const studentColumns = [
    {
      title: "Mã học sinh",
      dataIndex: "Mã học sinh",
      key: "code",
    },
    {
      title: "Họ và tên",
      dataIndex: "Họ và tên",
      key: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "Ngày sinh",
      key: "dob",
    },
    {
      title: "Số điện thoại",
      dataIndex: "Số điện thoại",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
    },
  ];


  if (myClasses.length === 0) {
    return (
      <WrapperContent title="Lớp học của tôi" isLoading={loading}>
        <div style={{ padding: "24px" }}>
          <Empty description="Bạn chưa được phân công lớp học nào." />
        </div>
      </WrapperContent>
    );
  }

  return (
    <WrapperContent title="Lớp học của tôi" isLoading={loading}>
      <Tabs
        items={myClasses.map((classData) => ({
          key: classData.id,
          label: classData["Tên lớp"],
          children: (
            <div>
              <Card
                title="Thông tin lớp học"
                extra={
                  <Button
                    icon={<HistoryOutlined />}
                    onClick={() =>
                      navigate(`/workspace/classes/${classData.id}/history`)
                    }
                  >
                    Lịch sử buổi học
                  </Button>
                }
                style={{ marginBottom: 16 }}
              >
                <Descriptions column={2}>
                  <Descriptions.Item label="Mã lớp">
                    {classData["Mã lớp"]}
                  </Descriptions.Item>
                  <Descriptions.Item label="Môn học">
                    {classData["Môn học"]}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khối">
                    {classData["Khối"]}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag
                      color={
                        classData["Trạng thái"] === "active" ? "green" : "red"
                      }
                    >
                      {classData["Trạng thái"] === "active"
                        ? "Hoạt động"
                        : "Ngừng"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số học sinh">
                    {classData["Student IDs"]?.length || 0}
                  </Descriptions.Item>
                </Descriptions>

                {classData["Lịch học"] && classData["Lịch học"].length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4>Lịch học trong tuần:</h4>
                    {classData["Lịch học"].map((schedule, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <Tag color="blue">Thứ {schedule["Thứ"]}</Tag>
                        {schedule["Giờ bắt đầu"]} - {schedule["Giờ kết thúc"]}
                        {schedule["Địa điểm"] && ` - ${schedule["Địa điểm"]}`}
                      </div>
                    ))}
                  </div>
                )}

                {classData["Ghi chú"] && (
                  <div style={{ marginTop: 16 }}>
                    <strong>Ghi chú:</strong> {classData["Ghi chú"]}
                  </div>
                )}
              </Card>

              <Card
                title="Danh sách học sinh"
                extra={
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => {
                      setSelectedClass(classData);
                      setIsStudentModalOpen(true);
                    }}
                  >
                    Thêm học sinh
                  </Button>
                }
              >
                <Table
                  columns={studentColumns}
                  dataSource={getClassStudents(classData)}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </div>
          ),
        }))}
      />

      <AddStudentModal
        open={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
      />
    </WrapperContent>
  );
};

export default TeacherClassView;
