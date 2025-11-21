import { useState, useEffect } from "react";
import { Card, Table, Tag, Tabs, Descriptions, Empty, Button, Modal, Space, Input, Form, message, List, Popconfirm } from "antd";
import { UserAddOutlined, HistoryOutlined, FileTextOutlined, PlusOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { useAuth } from "../../contexts/AuthContext";
import { Class } from "../../types";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../AddStudentModal";
import ScoreDetailModal from "../ScoreDetailModal";
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
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [attendanceSessions, setAttendanceSessions] = useState<any[]>([]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedClassForDoc, setSelectedClassForDoc] = useState<Class | null>(null);
  const [documentForm] = Form.useForm();

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

  // Load attendance sessions
  useEffect(() => {
    const sessionsRef = ref(database, "datasheet/Điểm_danh_sessions");
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessionsList = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as any),
        }));
        setAttendanceSessions(sessionsList);
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

  // Add document to class
  const handleAddDocument = async (values: any) => {
    if (!selectedClassForDoc) return;

    try {
      const classRef = ref(database, `datasheet/Lớp_học/${selectedClassForDoc.id}`);
      const currentDocuments = selectedClassForDoc["Tài liệu"] || [];
      
      const newDocument = {
        name: values.name,
        description: values.description || "",
        url: values.url,
        uploadedAt: new Date().toISOString(),
        uploadedBy: teacherData?.["Họ và tên"] || userProfile?.displayName || "Giáo viên",
      };

      const updatedDocuments = [...currentDocuments, newDocument];
      
      await update(classRef, {
        "Tài liệu": updatedDocuments,
      });

      message.success("Đã thêm tài liệu thành công!");
      setIsDocumentModalOpen(false);
      documentForm.resetFields();
    } catch (error) {
      console.error("Error adding document:", error);
      message.error("Lỗi khi thêm tài liệu");
    }
  };

  // Delete document from class
  const handleDeleteDocument = async (classData: Class, docIndex: number) => {
    try {
      const classRef = ref(database, `datasheet/Lớp_học/${classData.id}`);
      const currentDocuments = classData["Tài liệu"] || [];
      const updatedDocuments = currentDocuments.filter((_, index) => index !== docIndex);
      
      await update(classRef, {
        "Tài liệu": updatedDocuments,
      });

      message.success("Đã xóa tài liệu thành công!");
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Lỗi khi xóa tài liệu");
    }
  };

  const handleOpenScoreModal = (student: Student, classData: Class) => {
    // Find the most recent session for this class
    const classSessions = attendanceSessions
      .filter((session) => session["Class ID"] === classData.id)
      .sort((a, b) => new Date(b["Ngày"]).getTime() - new Date(a["Ngày"]).getTime());
    
    if (classSessions.length > 0) {
      setSelectedSession(classSessions[0]);
      setSelectedStudent({ id: student.id, name: student["Họ và tên"] });
      setIsScoreModalOpen(true);
    } else {
      Modal.warning({
        title: "Chưa có buổi học",
        content: "Chưa có buổi học nào để thêm điểm. Vui lòng điểm danh buổi học trước.",
      });
    }
  };

  const studentColumns = (classData: Class) => [
    {
      title: "Mã học sinh",
      dataIndex: "Mã học sinh",
      key: "code",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "Họ và tên",
      key: "name",
      width: 200,
    },
    {
      title: "Ngày sinh",
      dataIndex: "Ngày sinh",
      key: "dob",
      width: 120,
    },
    {
      title: "Số điện thoại",
      dataIndex: "Số điện thoại",
      key: "phone",
      width: 130,
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 200,
    },
    {
      title: "Bảng điểm",
      key: "scores",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Student) => (
        <Button
          size="small"
          type="link"
          icon={<FileTextOutlined />}
          onClick={() => handleOpenScoreModal(record, classData)}
        >
          Nhập điểm
        </Button>
      ),
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
                style={{ marginBottom: 16 }}
              >
                <Table
                  columns={studentColumns(classData)}
                  dataSource={getClassStudents(classData)}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 1000 }}
                />
              </Card>

              <Card
                title="Tài liệu học tập"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedClassForDoc(classData);
                      setIsDocumentModalOpen(true);
                    }}
                  >
                    Thêm tài liệu
                  </Button>
                }
              >
                {classData["Tài liệu"] && classData["Tài liệu"].length > 0 ? (
                  <List
                    dataSource={classData["Tài liệu"]}
                    renderItem={(doc: any, index: number) => (
                      <List.Item
                        actions={[
                          <Button
                            type="link"
                            icon={<LinkOutlined />}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Mở
                          </Button>,
                          <Popconfirm
                            title="Xóa tài liệu"
                            description="Bạn có chắc chắn muốn xóa tài liệu này?"
                            onConfirm={() => handleDeleteDocument(classData, index)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button
                              type="link"
                              danger
                              icon={<DeleteOutlined />}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />}
                          title={doc.name}
                          description={
                            <Space direction="vertical" size="small">
                              {doc.description && <div>{doc.description}</div>}
                              <div style={{ fontSize: 12, color: "#999" }}>
                                Đăng tải: {new Date(doc.uploadedAt).toLocaleString("vi-VN")} bởi {doc.uploadedBy}
                              </div>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="Chưa có tài liệu nào" />
                )}
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

      {/* Add Document Modal */}
      <Modal
        title="Thêm tài liệu học tập"
        open={isDocumentModalOpen}
        onCancel={() => {
          setIsDocumentModalOpen(false);
          setSelectedClassForDoc(null);
          documentForm.resetFields();
        }}
        onOk={() => documentForm.submit()}
        okText="Thêm"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={documentForm}
          layout="vertical"
          onFinish={handleAddDocument}
        >
          <Form.Item
            label="Tên tài liệu"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên tài liệu" }]}
          >
            <Input placeholder="Ví dụ: Bài giảng tuần 1" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Mô tả ngắn về tài liệu (không bắt buộc)"
            />
          </Form.Item>

          <Form.Item
            label="Link tài liệu"
            name="url"
            rules={[
              { required: true, message: "Vui lòng nhập link tài liệu" },
              { type: "url", message: "Link không hợp lệ" },
            ]}
            extra="Có thể dùng Google Drive, Dropbox, OneDrive, v.v."
          >
            <Input 
              placeholder="https://drive.google.com/file/d/..." 
              prefix={<LinkOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Score Detail Modal */}
      {selectedStudent && (
        <ScoreDetailModal
          visible={isScoreModalOpen}
          onClose={() => {
            setIsScoreModalOpen(false);
            setSelectedSession(null);
            setSelectedStudent(null);
          }}
          session={selectedSession}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
        />
      )}
    </WrapperContent>
  );
};

export default TeacherClassView;
