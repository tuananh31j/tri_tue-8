import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  Descriptions,
  message,
  Statistic,
  Row,
  Col,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  EyeOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { Class } from "../../types";
import ClassFormModal from "../../components/ClassFormModal";
import AddStudentModal from "../../components/AddStudentModal";
import WrapperContent from "@/components/WrapperContent";
import { subjectMap } from "@/utils/selectOptions";
import { DATABASE_URL_BASE } from "@/firebase";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const ClassManagement = () => {
  const { classes, loading, deleteClass } = useClasses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [gradeClass, setGradeClass] = useState<Class | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<any[]>([]);

  const handleEdit = (record: Class) => {
    setEditingClass(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (classId: string) => {
    await deleteClass(classId);
  };

  const handleAddStudent = (record: Class) => {
    setSelectedClass(record);
    setIsStudentModalOpen(true);
  };

  const handleViewDetail = (record: Class) => {
    setViewingClass(record);
    setIsDetailModalOpen(true);
  };

  const handleViewGrades = (record: Class) => {
    setGradeClass(record);
    setIsGradeModalOpen(true);
  };

  // Load students and attendance sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Danh_sách_học_sinh.json`
        );
        const studentsData = await studentsRes.json();
        if (studentsData) {
          const studentsArray = Object.entries(studentsData).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
            })
          );
          setStudents(studentsArray);
        }

        // Fetch attendance sessions
        const sessionsRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Điểm_danh_sessions.json`
        );
        const sessionsData = await sessionsRes.json();
        if (sessionsData) {
          const sessionsArray = Object.entries(sessionsData).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
            })
          );
          setAttendanceSessions(sessionsArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Get unique values for filters
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(classes.map((c) => c["Môn học"]));
    return Array.from(subjects).sort();
  }, [classes]);

  const uniqueGrades = useMemo(() => {
    const grades = new Set(classes.map((c) => c["Khối"]));
    return Array.from(grades).sort((a, b) => Number(a) - Number(b));
  }, [classes]);

  const uniqueTeachers = useMemo(() => {
    const teachers = new Set(classes.map((c) => c["Giáo viên chủ nhiệm"]));
    return Array.from(teachers).sort();
  }, [classes]);

  // Apply all filters
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Status filter
      if (filterStatus !== "all" && c["Trạng thái"] !== filterStatus) {
        return false;
      }

      // Subject filter
      if (filterSubject !== "all" && c["Môn học"] !== filterSubject) {
        return false;
      }

      // Grade filter
      if (filterGrade !== "all" && c["Khối"].toString() !== filterGrade) {
        return false;
      }

      // Teacher filter
      if (filterTeacher !== "all" && c["Giáo viên chủ nhiệm"] !== filterTeacher) {
        return false;
      }

      // Search filter (search in class name, code, teacher)
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchName = c["Tên lớp"]?.toLowerCase().includes(search);
        const matchCode = c["Mã lớp"]?.toLowerCase().includes(search);
        const matchTeacher = c["Giáo viên chủ nhiệm"]?.toLowerCase().includes(search);
        
        if (!matchName && !matchCode && !matchTeacher) {
          return false;
        }
      }

      return true;
    });
  }, [classes, filterStatus, filterSubject, filterGrade, filterTeacher, searchTerm]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterStatus("all");
    setFilterSubject("all");
    setFilterGrade("all");
    setFilterTeacher("all");
    setSearchTerm("");
  };

  const columns = [
    {
      title: "Mã lớp",
      dataIndex: "Mã lớp",
      key: "code",
      width: 120,
    },
    {
      title: "Tên lớp",
      dataIndex: "Tên lớp",
      key: "name",
      width: 200,
    },
    {
      title: "Môn học",
      dataIndex: "Môn học",
      key: "subject",
      width: 150,
      render: (subject: string) => subjectMap[subject] || subject,
    },
    {
      title: "Khối",
      dataIndex: "Khối",
      key: "grade",
      width: 100,
    },
    {
      title: "Giáo viên",
      dataIndex: "Giáo viên chủ nhiệm",
      key: "teacher",
      width: 180,
    },
    {
      title: "Số học sinh",
      key: "studentCount",
      width: 120,
      render: (_: any, record: Class) => (
        <span>{record["Student IDs"]?.length || 0}</span>
      ),
    },
    {
      title: "Lịch học",
      key: "schedule",
      width: 200,
      render: (_: any, record: Class) => (
        <div>
          {record["Lịch học"]?.map((schedule, index) => (
            <div key={index} style={{ fontSize: "12px" }}>
              Thứ {schedule["Thứ"]}: {schedule["Giờ bắt đầu"]} -{" "}
              {schedule["Giờ kết thúc"]}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Trạng thái",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 220,
      fixed: "right" as const,
      render: (_: any, record: Class) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => handleViewGrades(record)}
            size="small"
          >
            Điểm
          </Button>
          <Button
            type="link"
            icon={<UserAddOutlined />}
            onClick={() => handleAddStudent(record)}
            size="small"
          >
            HS
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa lớp học"
            description="Bạn có chắc chắn muốn xóa lớp học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <WrapperContent
      title="Quản lý lớp học"
      toolbar={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClass(null);
            setIsModalOpen(true);
          }}
        >
          Thêm lớp học
        </Button>
      }
    >
      {/* Filter Section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Tìm kiếm:
              </label>
              <Input
                placeholder="Tên lớp, mã lớp, giáo viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Trạng thái:
              </label>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Ngừng</Select.Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Môn học:
              </label>
              <Select
                value={filterSubject}
                onChange={setFilterSubject}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                <Select.Option value="all">Tất cả</Select.Option>
                {uniqueSubjects.map((subject) => (
                  <Select.Option key={subject} value={subject}>
                    {subjectMap[subject] || subject}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Khối:
              </label>
              <Select
                value={filterGrade}
                onChange={setFilterGrade}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                {uniqueGrades.map((grade) => (
                  <Select.Option key={grade} value={grade.toString()}>
                    Khối {grade}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Giáo viên:
              </label>
              <Select
                value={filterTeacher}
                onChange={setFilterTeacher}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                <Select.Option value="all">Tất cả</Select.Option>
                {uniqueTeachers.map((teacher) => (
                  <Select.Option key={teacher} value={teacher}>
                    {teacher}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                &nbsp;
              </label>
              <Button onClick={handleResetFilters} block>
                Xóa bộ lọc
              </Button>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Space>
              <Tag color="blue">
                Tìm thấy: {filteredClasses.length} / {classes.length} lớp học
              </Tag>
              {filterStatus !== "all" && (
                <Tag color="green" closable onClose={() => setFilterStatus("all")}>
                  Trạng thái: {filterStatus === "active" ? "Hoạt động" : "Ngừng"}
                </Tag>
              )}
              {filterSubject !== "all" && (
                <Tag color="purple" closable onClose={() => setFilterSubject("all")}>
                  Môn: {subjectMap[filterSubject] || filterSubject}
                </Tag>
              )}
              {filterGrade !== "all" && (
                <Tag color="orange" closable onClose={() => setFilterGrade("all")}>
                  Khối {filterGrade}
                </Tag>
              )}
              {filterTeacher !== "all" && (
                <Tag color="cyan" closable onClose={() => setFilterTeacher("all")}>
                  GV: {filterTeacher}
                </Tag>
              )}
              {searchTerm && (
                <Tag color="magenta" closable onClose={() => setSearchTerm("")}>
                  Tìm kiếm: "{searchTerm}"
                </Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredClasses}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} lớp học`,
        }}
      />

      <ClassFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        editingClass={editingClass}
      />

      <AddStudentModal
        open={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
      />

      <Modal
        title={`Chi tiết lớp học - ${viewingClass?.["Tên lớp"] || ""}`}
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setViewingClass(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {viewingClass && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã lớp">
                {viewingClass["Mã lớp"]}
              </Descriptions.Item>
              <Descriptions.Item label="Tên lớp">
                {viewingClass["Tên lớp"]}
              </Descriptions.Item>
              <Descriptions.Item label="Môn học">
                {subjectMap[viewingClass["Môn học"]] || viewingClass["Môn học"]}
              </Descriptions.Item>
              <Descriptions.Item label="Khối">
                {viewingClass["Khối"]}
              </Descriptions.Item>
              <Descriptions.Item label="Giáo viên chủ nhiệm" span={2}>
                {viewingClass["Giáo viên chủ nhiệm"]}
              </Descriptions.Item>
              <Descriptions.Item label="Số học sinh">
                {viewingClass["Student IDs"]?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    viewingClass["Trạng thái"] === "active" ? "green" : "red"
                  }
                >
                  {viewingClass["Trạng thái"] === "active"
                    ? "Hoạt động"
                    : "Ngừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {new Date(viewingClass["Ngày tạo"]).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo" span={2}>
                {viewingClass["Người tạo"]}
              </Descriptions.Item>
            </Descriptions>

            {viewingClass["Lịch học"] &&
              viewingClass["Lịch học"].length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4>Lịch học trong tuần:</h4>
                  <Table
                    dataSource={viewingClass["Lịch học"].map(
                      (schedule, index) => ({
                        key: index,
                        ...schedule,
                      })
                    )}
                    columns={[
                      {
                        title: "Thứ",
                        dataIndex: "Thứ",
                        key: "day",
                        render: (day: number) => `Thứ ${day}`,
                      },
                      {
                        title: "Giờ bắt đầu",
                        dataIndex: "Giờ bắt đầu",
                        key: "start",
                      },
                      {
                        title: "Giờ kết thúc",
                        dataIndex: "Giờ kết thúc",
                        key: "end",
                      },
                      {
                        title: "Địa điểm",
                        dataIndex: "Địa điểm",
                        key: "location",
                      },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </div>
              )}

            {viewingClass["Học sinh"] &&
              viewingClass["Học sinh"].length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4>
                    Danh sách học sinh ({viewingClass["Học sinh"].length}):
                  </h4>
                  <div style={{ maxHeight: 200, overflow: "auto" }}>
                    {viewingClass["Học sinh"].map((student, index) => (
                      <Tag key={index} style={{ marginBottom: 8 }}>
                        {student}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

            {viewingClass["Ghi chú"] && (
              <div style={{ marginTop: 24 }}>
                <h4>Ghi chú:</h4>
                <p>{viewingClass["Ghi chú"]}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Grade Report Modal */}
      <GradeReportModal
        open={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setGradeClass(null);
        }}
        classData={gradeClass}
        students={students}
        attendanceSessions={attendanceSessions}
      />
    </WrapperContent>
  );
};

// Grade Report Modal Component
const GradeReportModal: React.FC<{
  open: boolean;
  onClose: () => void;
  classData: Class | null;
  students: any[];
  attendanceSessions: any[];
}> = ({ open, onClose, classData, students, attendanceSessions }) => {
  
  // Calculate grade data for all students in the class
  const gradeData = useMemo(() => {
    if (!classData) return [];
    
    const studentIds = classData["Student IDs"] || [];
    
    return studentIds.map((studentId) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return null;

      // Get all sessions for this class
      const classSessions = attendanceSessions.filter(
        (session) => session["Class ID"] === classData.id
      );

      let totalSessions = 0;
      let attendedSessions = 0;
      let lateSessions = 0;
      let totalScore = 0;
      let scoredSessions = 0;
      let totalHomework = 0;
      let completedHomework = 0;

      classSessions.forEach((session) => {
        const record = session["Điểm danh"]?.find(
          (r: any) => r["Student ID"] === studentId
        );

        if (record) {
          totalSessions++;
          
          if (record["Có mặt"]) {
            attendedSessions++;
          }
          
          if (record["Đi muộn"]) {
            lateSessions++;
          }

          // Score
          if (record["Điểm"] !== null && record["Điểm"] !== undefined) {
            totalScore += record["Điểm"];
            scoredSessions++;
          }

          // Homework
          if (session["Bài tập"]) {
            const totalExercises = session["Bài tập"]["Tổng số bài"] || 0;
            const completed = record["Bài tập hoàn thành"] || 0;
            totalHomework += totalExercises;
            completedHomework += completed;
          }
        }
      });

      const attendanceRate = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
      const averageScore = scoredSessions > 0 ? totalScore / scoredSessions : 0;
      const homeworkRate = totalHomework > 0 ? (completedHomework / totalHomework) * 100 : 0;

      return {
        studentId,
        studentName: student["Họ và tên"],
        studentCode: student["Mã học sinh"] || "-",
        totalSessions,
        attendedSessions,
        lateSessions,
        absentSessions: totalSessions - attendedSessions,
        attendanceRate,
        averageScore,
        scoredSessions,
        totalHomework,
        completedHomework,
        homeworkRate,
      };
    }).filter(Boolean);
  }, [classData, students, attendanceSessions]);

  // Calculate class statistics
  const classStats = useMemo(() => {
    if (gradeData.length === 0) return null;

    const avgAttendance = gradeData.reduce((sum: number, d: any) => sum + d.attendanceRate, 0) / gradeData.length;
    const avgScore = gradeData.reduce((sum: number, d: any) => sum + d.averageScore, 0) / gradeData.length;
    const avgHomework = gradeData.reduce((sum: number, d: any) => sum + d.homeworkRate, 0) / gradeData.length;
    const totalSessions = gradeData[0]?.totalSessions || 0;

    return {
      avgAttendance,
      avgScore,
      avgHomework,
      totalSessions,
    };
  }, [gradeData]);

  // Get all unique score names from all students
  const allScoreNames = useMemo(() => {
    if (!classData) return [];
    
    const scoreNamesSet = new Set<string>();
    const classSessions = attendanceSessions.filter(
      (session) => session["Class ID"] === classData.id
    );
    
    classSessions.forEach((session) => {
      session["Điểm danh"]?.forEach((record: any) => {
        if (record["Chi tiết điểm"]) {
          record["Chi tiết điểm"].forEach((score: any) => {
            scoreNamesSet.add(score["Tên điểm"]);
          });
        }
      });
    });
    
    return Array.from(scoreNamesSet).sort();
  }, [attendanceSessions, classData]);
  
  if (!classData) return null;



  // Export to Excel
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ["BẢNG ĐIỂM TỔNG HỢP LỚP HỌC"],
        [`Lớp: ${classData["Tên lớp"]} (${classData["Mã lớp"]})`],
        [`Môn học: ${subjectMap[classData["Môn học"]] || classData["Môn học"]}`],
        [`Khối: ${classData["Khối"]}`],
        [`Giáo viên: ${classData["Giáo viên chủ nhiệm"]}`],
        [`Số học sinh: ${gradeData.length}`],
        [`Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm")}`],
        [],
        ["STT", "Mã HS", "Họ và tên", "Tổng buổi", "Có mặt", "Vắng", "Muộn", "Tỷ lệ (%)", "Điểm TB", "Số bài chấm", "BTVN hoàn thành", "Tổng BTVN", "Tỷ lệ BTVN (%)"],
        ...gradeData.map((data: any, index) => [
          index + 1,
          data.studentCode,
          data.studentName,
          data.totalSessions,
          data.attendedSessions,
          data.absentSessions,
          data.lateSessions,
          data.attendanceRate.toFixed(1),
          data.averageScore.toFixed(1),
          data.scoredSessions,
          data.completedHomework,
          data.totalHomework,
          data.homeworkRate.toFixed(1),
        ]),
        [],
        ["Thống kê chung:"],
        ["Tổng số buổi học:", gradeData.length > 0 ? gradeData[0].totalSessions : 0],
        ["Tỷ lệ tham gia trung bình:", `${(gradeData.reduce((sum: number, d: any) => sum + d.attendanceRate, 0) / gradeData.length || 0).toFixed(1)}%`],
        ["Điểm trung bình lớp:", (gradeData.reduce((sum: number, d: any) => sum + d.averageScore, 0) / gradeData.length || 0).toFixed(1)],
        ["Tỷ lệ hoàn thành BTVN:", `${(gradeData.reduce((sum: number, d: any) => sum + d.homeworkRate, 0) / gradeData.length || 0).toFixed(1)}%`],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Set column widths
      summarySheet['!cols'] = [
        { wch: 5 },  // STT
        { wch: 12 }, // Mã HS
        { wch: 25 }, // Họ và tên
        { wch: 10 }, // Tổng buổi
        { wch: 10 }, // Có mặt
        { wch: 8 },  // Vắng
        { wch: 8 },  // Muộn
        { wch: 12 }, // Tỷ lệ
        { wch: 10 }, // Điểm TB
        { wch: 12 }, // Số bài chấm
        { wch: 15 }, // BTVN hoàn thành
        { wch: 12 }, // Tổng BTVN
        { wch: 15 }, // Tỷ lệ BTVN
      ];

      XLSX.utils.book_append_sheet(wb, summarySheet, "Bảng điểm tổng hợp");

      // Save file
      const fileName = `Bang_diem_${classData["Mã lớp"]}_${dayjs().format("YYYYMMDD")}.xlsx`;
      XLSX.writeFile(wb, fileName);
      message.success("Đã xuất file Excel thành công!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Lỗi khi xuất file Excel");
    }
  };

  // Create dynamic columns for each score name
  const scoreColumns = allScoreNames.map((scoreName) => ({
    title: scoreName,
    key: `score-${scoreName}`,
    width: 100,
    align: "center" as const,
    render: (_: any, record: any) => {
      // Find the most recent score with this name for this student
      const classSessions = attendanceSessions.filter(
        (session) => session["Class ID"] === classData.id
      );
      
      let latestScore: any = null;
      let latestDate = "";
      
      classSessions.forEach((session) => {
        const studentRecord = session["Điểm danh"]?.find(
          (r: any) => r["Student ID"] === record.studentId
        );
        if (studentRecord?.["Chi tiết điểm"]) {
          studentRecord["Chi tiết điểm"].forEach((score: any) => {
            if (score["Tên điểm"] === scoreName) {
              if (!latestDate || score["Ngày"] > latestDate) {
                latestScore = score;
                latestDate = score["Ngày"];
              }
            }
          });
        }
      });
      
      if (!latestScore) return <span>-</span>;
      
      const scoreValue = latestScore["Điểm"];
      return (
        <Tag color={scoreValue >= 8 ? "green" : scoreValue >= 6.5 ? "blue" : scoreValue >= 5 ? "orange" : "red"}>
          <strong>{scoreValue}</strong>
        </Tag>
      );
    },
  }));

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã HS",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 100,
    },
    {
      title: "Họ và tên",
      dataIndex: "studentName",
      key: "studentName",
      width: 180,
      fixed: "left" as const,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Điểm danh",
      children: [
        {
          title: "Tổng",
          dataIndex: "totalSessions",
          key: "totalSessions",
          width: 80,
          align: "center" as const,
        },
        {
          title: "Có mặt",
          dataIndex: "attendedSessions",
          key: "attendedSessions",
          width: 80,
          align: "center" as const,
          render: (val: number) => <Tag color="green">{val}</Tag>,
        },
        {
          title: "Vắng",
          dataIndex: "absentSessions",
          key: "absentSessions",
          width: 80,
          align: "center" as const,
          render: (val: number) => val > 0 ? <Tag color="red">{val}</Tag> : <span>0</span>,
        },
        {
          title: "Muộn",
          dataIndex: "lateSessions",
          key: "lateSessions",
          width: 80,
          align: "center" as const,
          render: (val: number) => val > 0 ? <Tag color="orange">{val}</Tag> : <span>0</span>,
        },
        {
          title: "Tỷ lệ (%)",
          dataIndex: "attendanceRate",
          key: "attendanceRate",
          width: 100,
          align: "center" as const,
          render: (val: number) => (
            <Tag color={val >= 80 ? "green" : val >= 60 ? "orange" : "red"}>
              {val.toFixed(1)}%
            </Tag>
          ),
        },
      ],
    },
    // Dynamic score columns
    ...(scoreColumns.length > 0 ? [{
      title: "Điểm các bài kiểm tra",
      children: scoreColumns,
    }] : []),
    {
      title: "Tổng kết",
      children: [
        {
          title: "Điểm TB",
          dataIndex: "averageScore",
          key: "averageScore",
          width: 100,
          align: "center" as const,
          render: (val: number, record: any) => {
            // Calculate average from Chi tiết điểm instead
            const classSessions = attendanceSessions.filter(
              (session) => session["Class ID"] === classData.id
            );
            let totalScore = 0;
            let count = 0;
            
            classSessions.forEach((session) => {
              const studentRecord = session["Điểm danh"]?.find(
                (r: any) => r["Student ID"] === record.studentId
              );
              if (studentRecord?.["Chi tiết điểm"]) {
                studentRecord["Chi tiết điểm"].forEach((score: any) => {
                  totalScore += score["Điểm"];
                  count++;
                });
              }
            });
            
            if (count === 0) return <span>-</span>;
            const avg = totalScore / count;
            return (
              <Tag color={avg >= 8 ? "green" : avg >= 6.5 ? "blue" : avg >= 5 ? "orange" : "red"}>
                <strong>{avg.toFixed(1)}</strong>
              </Tag>
            );
          },
        },
        {
          title: "Số bài",
          key: "totalScores",
          width: 80,
          align: "center" as const,
          render: (_: any, record: any) => {
            const classSessions = attendanceSessions.filter(
              (session) => session["Class ID"] === classData.id
            );
            let count = 0;
            classSessions.forEach((session) => {
              const studentRecord = session["Điểm danh"]?.find(
                (r: any) => r["Student ID"] === record.studentId
              );
              if (studentRecord?.["Chi tiết điểm"]) {
                count += studentRecord["Chi tiết điểm"].length;
              }
            });
            return count > 0 ? <Tag color="blue">{count}</Tag> : <span>-</span>;
          },
        },
      ],
    },

  ];

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          {`Bảng điểm lớp ${classData["Tên lớp"]} (${classData["Mã lớp"]})`}
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1400}
      footer={[
        <Button key="export" type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
          Xuất Excel
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      {/* Class Info */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div>
              <strong>Môn học:</strong> {subjectMap[classData["Môn học"]] || classData["Môn học"]}
            </div>
          </Col>
          <Col span={6}>
            <div>
              <strong>Khối:</strong> {classData["Khối"]}
            </div>
          </Col>
          <Col span={6}>
            <div>
              <strong>Giáo viên:</strong> {classData["Giáo viên chủ nhiệm"]}
            </div>
          </Col>
          <Col span={6}>
            <div>
              <strong>Số học sinh:</strong> {gradeData.length}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      {classStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số buổi học"
                value={classStats.totalSessions}
                suffix="buổi"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tỷ lệ tham gia TB"
                value={classStats.avgAttendance}
                precision={1}
                suffix="%"
                valueStyle={{ color: classStats.avgAttendance >= 80 ? "#3f8600" : "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Điểm TB lớp"
                value={classStats.avgScore}
                precision={1}
                valueStyle={{ color: classStats.avgScore >= 8 ? "#3f8600" : classStats.avgScore >= 6.5 ? "#1890ff" : "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tỷ lệ hoàn thành BTVN"
                value={classStats.avgHomework}
                precision={1}
                suffix="%"
                valueStyle={{ color: classStats.avgHomework >= 80 ? "#3f8600" : "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Grade Table */}
      <Table
        columns={columns}
        dataSource={gradeData}
        rowKey="studentId"
        pagination={false}
        scroll={{ x: 1200, y: 400 }}
        size="small"
        bordered
        expandable={{
          expandedRowRender: (record) => {
            // Get all score details for this student
            const classSessions = attendanceSessions.filter(
              (session) => session["Class ID"] === classData.id
            );
            
            const allScores: any[] = [];
            classSessions.forEach((session) => {
              const studentRecord = session["Điểm danh"]?.find(
                (r: any) => r["Student ID"] === record.studentId
              );
              if (studentRecord?.["Chi tiết điểm"]) {
                studentRecord["Chi tiết điểm"].forEach((score: any) => {
                  allScores.push({
                    ...score,
                    sessionDate: session["Ngày"],
                    className: session["Tên lớp"],
                  });
                });
              }
            });

            // Sort by date descending
            allScores.sort((a, b) => new Date(b["Ngày"]).getTime() - new Date(a["Ngày"]).getTime());

            if (allScores.length === 0) {
              return <div style={{ padding: "16px", textAlign: "center", color: "#999" }}>Chưa có điểm chi tiết</div>;
            }

            const scoreColumns = [
              {
                title: "Ngày",
                dataIndex: "Ngày",
                key: "date",
                width: 120,
                render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
              },
              {
                title: "Tên bài",
                dataIndex: "Tên điểm",
                key: "scoreName",
                width: 250,
              },
              {
                title: "Điểm",
                dataIndex: "Điểm",
                key: "score",
                width: 100,
                align: "center" as const,
                render: (score: number) => (
                  <Tag color={score >= 8 ? "green" : score >= 6.5 ? "blue" : score >= 5 ? "orange" : "red"}>
                    <strong>{score}</strong>
                  </Tag>
                ),
              },
              {
                title: "Ghi chú",
                dataIndex: "Ghi chú",
                key: "note",
              },
            ];

            return (
              <div style={{ margin: "0 48px" }}>
                <Table
                  columns={scoreColumns}
                  dataSource={allScores}
                  rowKey={(record) => `${record["Ngày"]}-${record["Tên điểm"]}`}
                  pagination={false}
                  size="small"
                  bordered
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <strong>Tổng cộng</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align="center">
                          <Tag color="blue">
                            <strong>{allScores.length} điểm</strong>
                          </Tag>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <strong>Điểm TB: {(allScores.reduce((sum, s) => sum + s["Điểm"], 0) / allScores.length).toFixed(1)}</strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </div>
            );
          },
          rowExpandable: (record) => {
            // Check if student has any score details
            const classSessions = attendanceSessions.filter(
              (session) => session["Class ID"] === classData.id
            );
            return classSessions.some((session) => {
              const studentRecord = session["Điểm danh"]?.find(
                (r: any) => r["Student ID"] === record.studentId
              );
              return studentRecord?.["Chi tiết điểm"]?.length > 0;
            });
          },
        }}
      />
      
    </Modal>
  );
};

export default ClassManagement;
