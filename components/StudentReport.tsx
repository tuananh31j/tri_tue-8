import { useRef, useState } from "react";
import {
  Modal,
  Button,
  Descriptions,
  Table,
  Tag,
  Divider,
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Spin,
  Input,
} from "antd";
import {
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useAttendanceStats } from "../hooks/useAttendanceStats";
import { AttendanceSession } from "../types";
import {
  generateStudentComment,
  StudentReportData,
} from "../utils/geminiService";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

interface StudentReportProps {
  open: boolean;
  onClose: () => void;
  student: {
    id: string;
    "Họ và tên": string;
    "Mã học sinh"?: string;
    "Ngày sinh"?: string;
    "Số điện thoại"?: string;
    Email?: string;
    "Địa chỉ"?: string;
    [key: string]: any;
  };
  sessions: AttendanceSession[];
}

const StudentReport = ({
  open,
  onClose,
  student,
  sessions,
}: StudentReportProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { getStudentStats } = useAttendanceStats();
  const [aiComment, setAiComment] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentError, setCommentError] = useState<string>("");

  // Reset state when modal closes
  const handleClose = () => {
    setAiComment("");
    setCommentError("");
    setIsGenerating(false);
    onClose();
  };

  const stats = getStudentStats(student.id);

  // Filter sessions for this student
  const studentSessions = sessions
    .filter((session) =>
      session["Điểm danh"]?.some(
        (record) => record["Student ID"] === student.id
      )
    )
    .sort(
      (a, b) => new Date(b["Ngày"]).getTime() - new Date(a["Ngày"]).getTime()
    );

  // Calculate attendance rate
  const attendanceRate =
    stats.totalSessions > 0
      ? Math.round((stats.presentSessions / stats.totalSessions) * 100)
      : 0;

  // Get status tag
  const getStatusTag = (record: any) => {
    if (record["Có mặt"]) {
      if (record["Đi muộn"]) {
        return <Tag color="orange">Đi muộn</Tag>;
      }
      return <Tag color="green">Có mặt</Tag>;
    } else {
      if (record["Vắng có phép"]) {
        return <Tag color="blue">Vắng có phép</Tag>;
      }
      return <Tag color="red">Vắng không phép</Tag>;
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "Ngày",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      width: 100,
    },
    {
      title: "Lớp học",
      dataIndex: "Tên lớp",
      key: "class",
      width: 150,
    },
    {
      title: "Giờ học",
      key: "time",
      render: (_: any, record: AttendanceSession) =>
        `${record["Giờ bắt đầu"]} - ${record["Giờ kết thúc"]}`,
      width: 100,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: AttendanceSession) => {
        const studentRecord = record["Điểm danh"]?.find(
          (r) => r["Student ID"] === student.id
        );
        return studentRecord ? getStatusTag(studentRecord) : "-";
      },
      width: 120,
    },
    {
      title: "Điểm",
      key: "score",
      render: (_: any, record: AttendanceSession) => {
        const studentRecord = record["Điểm danh"]?.find(
          (r) => r["Student ID"] === student.id
        );
        return studentRecord?.["Điểm"] ?? "-";
      },
      width: 80,
    },
    {
      title: "Bài tập",
      key: "homework",
      render: (_: any, record: AttendanceSession) => {
        const studentRecord = record["Điểm danh"]?.find(
          (r) => r["Student ID"] === student.id
        );
        const completed = studentRecord?.["Bài tập hoàn thành"];
        const total = record["Bài tập"]?.["Tổng số bài"];
        if (completed !== undefined && total) {
          return `${completed}/${total}`;
        }
        return "-";
      },
      width: 100,
    },
    {
      title: "Ghi chú",
      key: "note",
      render: (_: any, record: AttendanceSession) => {
        const studentRecord = record["Điểm danh"]?.find(
          (r) => r["Student ID"] === student.id
        );
        return studentRecord?.["Ghi chú"] || "-";
      },
    },
  ];

  const generateBasicComment = (averageScore: number) => {
    let comment = `Nhận xét về học sinh ${student["Họ và tên"]}:\n\n`;

    // Attendance evaluation
    if (attendanceRate >= 90) {
      comment += `✅ Chuyên cần: Xuất sắc với tỷ lệ tham gia ${attendanceRate}%. Em rất chăm chỉ và đều đặn đến lớp.\n\n`;
    } else if (attendanceRate >= 75) {
      comment += `✅ Chuyên cần: Tốt với tỷ lệ tham gia ${attendanceRate}%. Em cần duy trì sự đều đặn này.\n\n`;
    } else if (attendanceRate >= 50) {
      comment += `⚠️ Chuyên cần: Trung bình với tỷ lệ tham gia ${attendanceRate}%. Em cần cải thiện việc đi học đều đặn hơn.\n\n`;
    } else {
      comment += `❌ Chuyên cần: Cần cải thiện với tỷ lệ tham gia ${attendanceRate}%. Phụ huynh cần theo dõi sát sao hơn.\n\n`;
    }

    // Academic performance
    if (averageScore >= 8) {
      comment += `🌟 Kết quả học tập: Xuất sắc với điểm trung bình ${averageScore}/10. Em có năng lực học tập tốt.\n\n`;
    } else if (averageScore >= 6.5) {
      comment += `✅ Kết quả học tập: Khá với điểm trung bình ${averageScore}/10. Em đang tiến bộ tốt.\n\n`;
    } else if (averageScore >= 5) {
      comment += `⚠️ Kết quả học tập: Trung bình với điểm trung bình ${averageScore}/10. Em cần nỗ lực hơn nữa.\n\n`;
    } else if (averageScore > 0) {
      comment += `❌ Kết quả học tập: Yếu với điểm trung bình ${averageScore}/10. Em cần sự hỗ trợ thêm từ giáo viên và phụ huynh.\n\n`;
    }

    // General advice
    comment += `💡 Lời khuyên: `;
    if (attendanceRate < 75) {
      comment += `Hãy đảm bảo em đi học đều đặn để không bỏ lỡ kiến thức. `;
    }
    if (averageScore < 6.5 && averageScore > 0) {
      comment += `Dành thêm thời gian ôn tập và làm bài tập về nhà. `;
    }
    comment += `Tiếp tục cố gắng và giữ vững tinh thần học tập!\n\n`;

    // Encouragement
    comment += `🎯 Kỳ vọng: Với ${stats.totalHours} giờ học và ${stats.totalSessions} buổi học, em đã có nền tảng tốt. Hãy tiếp tục phát huy và hoàn thiện bản thân mỗi ngày!`;

    return comment;
  };

  const handleGenerateComment = async () => {
    setIsGenerating(true);
    setCommentError("");

    try {
      // Calculate average score
      const scores = studentSessions
        .map(
          (s) =>
            s["Điểm danh"]?.find((r) => r["Student ID"] === student.id)?.[
              "Điểm"
            ]
        )
        .filter((score) => score !== undefined && score !== null) as number[];
      const averageScore =
        scores.length > 0
          ? Number(
              (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
            )
          : 0;

      // Get status text
      const getStatusText = (record: any) => {
        if (record["Có mặt"]) {
          return record["Đi muộn"] ? "Đi muộn" : "Có mặt";
        } else {
          return record["Vắng có phép"] ? "Vắng có phép" : "Vắng không phép";
        }
      };

      // Prepare recent sessions (last 10)
      const recentSessions = studentSessions.slice(0, 10).map((session) => {
        const studentRecord = session["Điểm danh"]?.find(
          (r) => r["Student ID"] === student.id
        );
        const completed = studentRecord?.["Bài tập hoàn thành"];
        const total = session["Bài tập"]?.["Tổng số bài"];

        return {
          date: dayjs(session["Ngày"]).format("DD/MM/YYYY"),
          className: session["Tên lớp"],
          status: studentRecord ? getStatusText(studentRecord) : "Không rõ",
          score: studentRecord?.["Điểm"],
          homework:
            completed !== undefined && total
              ? `${completed}/${total}`
              : undefined,
          note: studentRecord?.["Ghi chú"],
        };
      });

      const reportData: StudentReportData = {
        studentName: student["Họ và tên"],
        studentCode: student["Mã học sinh"],
        totalSessions: stats.totalSessions,
        presentSessions: stats.presentSessions,
        absentSessions: stats.absentSessions,
        attendanceRate,
        totalHours: stats.totalHours,
        averageScore,
        recentSessions,
      };

      try {
        console.log("🤖 Calling Gemini API...");
        const comment = await generateStudentComment(reportData);
        console.log("✅ AI Comment received:", comment);
        console.log("✅ Comment type:", typeof comment);
        console.log("✅ Comment length:", comment?.length);
        console.log(
          "✅ Comment is empty?",
          !comment || comment.trim().length === 0
        );

        if (!comment || comment.trim().length === 0) {
          console.warn("⚠️ Comment is empty, using fallback");
          const basicComment = generateBasicComment(averageScore);
          setAiComment(basicComment);
        } else {
          setAiComment(comment);
        }
      } catch (apiError: any) {
        console.log("❌ API Error:", apiError);
        // If API fails, use basic comment as fallback
        if (
          apiError?.message?.includes("quota") ||
          apiError?.message?.includes("giới hạn")
        ) {
          console.log("⚠️ Quota exceeded, using fallback...");
          setCommentError(apiError.message);
          // Generate basic comment as fallback
          const basicComment = generateBasicComment(averageScore);
          console.log("📝 Basic comment generated:", basicComment);
          setAiComment(basicComment);
        } else {
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("Error generating comment:", error);
      setCommentError(
        error?.message || "Không thể tạo nhận xét. Vui lòng thử lại sau."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open("", "", "width=1000,height=800");
    if (!printWindow) return;

    const content = printRef.current.innerHTML;

    printWindow.document.write(`
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Báo cáo học tập - ${student["Họ và tên"]}</title>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        color: #333;
                        line-height: 1.6;
                        background: #fff;
                    }

                    h1, h2, h3 {
                        margin: 0;
                        color: #004aad;
                    }

                    .report-header {
                        text-align: center;
                        border-bottom: 3px solid #004aad;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }

                    .report-header h1 {
                        font-size: 24px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .report-header p {
                        font-size: 13px;
                        color: #666;
                    }

                    .section {
                        margin-bottom: 25px;
                    }

                    .section-title {
                        font-weight: bold;
                        color: #004aad;
                        border-left: 4px solid #004aad;
                        padding-left: 10px;
                        margin-bottom: 10px;
                        font-size: 16px;
                        text-transform: uppercase;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 8px;
                        font-size: 13px;
                    }

                    th, td {
                        border: 1px solid #ccc;
                        padding: 6px 8px;
                        text-align: left;
                        vertical-align: middle;
                    }

                    th {
                        background-color: #004aad;
                        color: #fff;
                        text-align: center;
                    }

                    tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);

                        gap: 12px;
                    }

                    .stat-card {
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 10px;
                        background: #f9f9f9;
                        text-align: center;
                    }

                    .stat-value {
                        font-size: 20px;
                        font-weight: bold;
                        color: #004aad;
                    }

                    .stat-label {
                        font-size: 13px;
                        color: #555;
                    }

                    .comment-box {
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 12px;
                        background: #fefefe;
                        white-space: pre-wrap;
                        font-size: 14px;
                        line-height: 1.7;
                    }

                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                        border-top: 1px solid #ccc;
                        padding-top: 10px;
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 8px;
                        margin-top: 10px;
                    }

                    .stat-card {
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 6px 8px;
                        background: #fafafa;
                        text-align: center;
                    }

                    .stat-value {
                        font-size: 16px;
                        font-weight: 600;
                        color: #004aad;
                    }

                    .stat-label {
                        font-size: 12px;
                        color: #666;
                    }

                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>BÁO CÁO HỌC TẬP</h1>
                    <p>Ngày xuất: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
                </div>

                <div class="section">
                    <div class="section-title">Thông tin học sinh</div>
                    <table>
                        <tr><th>Họ và tên</th><td>${student["Họ và tên"]}</td></tr>
                        <tr><th>Mã học sinh</th><td>${student["Mã học sinh"] || "-"}</td></tr>
                        <tr><th>Ngày sinh</th><td>${student["Ngày sinh"] ? dayjs(student["Ngày sinh"]).format("DD/MM/YYYY") : "-"}</td></tr>
                        <tr><th>Số điện thoại</th><td>${student["Số điện thoại"] || "-"}</td></tr>
                        <tr><th>Email</th><td>${student["Email"] || "-"}</td></tr>
                        <tr><th>Địa chỉ</th><td>${student["Địa chỉ"] || "-"}</td></tr>
                    </table>
                </div>

                <div class="section">
                    <div class="section-title">Thống kê chuyên cần</div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${stats.totalSessions}</div>
                            <div class="stat-label">Tổng số buổi</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.presentSessions}</div>
                            <div class="stat-label">Số buổi có mặt</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.absentSessions}</div>
                            <div class="stat-label">Số buổi vắng</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${attendanceRate}%</div>
                            <div class="stat-label">Tỷ lệ tham gia</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.totalHours}</div>
                            <div class="stat-label">Tổng số giờ học</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${(() => {
                              const scores = studentSessions
                                .map(
                                  (s) =>
                                    s["Điểm danh"]?.find(
                                      (r) => r["Student ID"] === student.id
                                    )?.["Điểm"]
                                )
                                .filter(
                                  (score) =>
                                    score !== undefined && score !== null
                                ) as number[];
                              if (scores.length === 0) return 0;
                              return (
                                scores.reduce((a, b) => a + b, 0) /
                                scores.length
                              ).toFixed(1);
                            })()} / 10</div>
                            <div class="stat-label">Điểm trung bình</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Nhận xét học sinh</div>
                    <div class="comment-box">${aiComment ? aiComment.replace(/\n/g, "<br/>") : "Chưa có nhận xét."}</div>
                </div>

                <div class="section">
                    <div class="section-title">Lịch sử học tập</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Lớp học</th>
                                <th>Giờ học</th>
                                <th>Trạng thái</th>
                                <th>Điểm</th>
                                <th>Bài tập</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentSessions
                              .map((s) => {
                                const record = s["Điểm danh"]?.find(
                                  (r) => r["Student ID"] === student.id
                                );
                                const completed =
                                  record?.["Bài tập hoàn thành"];
                                const total = s["Bài tập"]?.["Tổng số bài"];
                                const homework =
                                  completed !== undefined && total
                                    ? `${completed}/${total}`
                                    : "-";
                                const status = record
                                  ? record["Có mặt"]
                                    ? record["Đi muộn"]
                                      ? "Đi muộn"
                                      : "Có mặt"
                                    : record["Vắng có phép"]
                                      ? "Vắng có phép"
                                      : "Vắng không phép"
                                  : "-";
                                return `
                                    <tr>
                                        <td>${dayjs(s["Ngày"]).format("DD/MM/YYYY")}</td>
                                        <td>${s["Tên lớp"]}</td>
                                        <td>${s["Giờ bắt đầu"]} - ${s["Giờ kết thúc"]}</td>
                                        <td>${status}</td>
                                        <td>${record?.["Điểm"] ?? "-"}</td>
                                        <td>${homework}</td>
                                        <td>${record?.["Ghi chú"] || "-"}</td>
                                    </tr>
                                `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    <p>Báo cáo được tạo tự động từ hệ thống quản lý học sinh.</p>
                    <p>Mọi thắc mắc xin liên hệ giáo viên phụ trách.</p>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <Modal
      title="Báo cáo học tập"
      open={open}
      onCancel={handleClose}
      width={1000}
      footer={[
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>,
        <Button
          key="ai-comment"
          icon={<RobotOutlined />}
          onClick={handleGenerateComment}
          loading={isGenerating}
          style={{
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
            color: "white",
          }}
        >
          Tạo nhận xét AI
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          In báo cáo
        </Button>,
      ]}
    >
      <div ref={printRef}>
        {/* Header */}
        <div
          className="header"
          style={{
            textAlign: "center",
            marginBottom: 24,
            borderBottom: "2px solid #1890ff",
            paddingBottom: 16,
          }}
        >
          <h1 style={{ color: "#1890ff", margin: 0 }}>BÁO CÁO HỌC TẬP</h1>
          <p style={{ margin: "8px 0 0 0", color: "#666" }}>
            Ngày xuất: {dayjs().format("DD/MM/YYYY HH:mm")}
          </p>
        </div>

        {/* Student Info */}
        <Card
          title="Thông tin học sinh"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Họ và tên">
              <strong>{student["Họ và tên"]}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Mã học sinh">
              {student["Mã học sinh"] || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {student["Ngày sinh"]
                ? dayjs(student["Ngày sinh"]).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {student["Số điện thoại"] || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {student["Email"] || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {student["Địa chỉ"] || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Statistics */}
        <Card
          title="Thống kê chuyên cần"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tổng số buổi"
                value={stats.totalSessions}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số buổi có mặt"
                value={stats.presentSessions}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số buổi vắng"
                value={stats.absentSessions}
                valueStyle={{ color: "#cf1322" }}
                prefix={<CloseCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ tham gia"
                value={attendanceRate}
                suffix="%"
                valueStyle={{
                  color: attendanceRate >= 80 ? "#3f8600" : "#cf1322",
                }}
              />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Tổng số giờ học"
                value={stats.totalHours}
                suffix="giờ"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Điểm trung bình"
                value={(() => {
                  const scores = studentSessions
                    .map(
                      (s) =>
                        s["Điểm danh"]?.find(
                          (r) => r["Student ID"] === student.id
                        )?.["Điểm"]
                    )
                    .filter(
                      (score) => score !== undefined && score !== null
                    ) as number[];
                  if (scores.length === 0) return 0;
                  return (
                    scores.reduce((a, b) => a + b, 0) / scores.length
                  ).toFixed(1);
                })()}
                suffix="/ 10"
              />
            </Col>
          </Row>
        </Card>

        {/* AI Comment Section - Editable Textarea */}
        <Card
          title={
            <span>
              <RobotOutlined style={{ marginRight: 8, color: "#52c41a" }} />
              Nhận xét học sinh
            </span>
          }
          size="small"
          style={{ marginBottom: 16 }}
        >
          {isGenerating && (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                marginBottom: 16,
              }}
            >
              <Spin />
              <p style={{ marginTop: 16, color: "#666" }}>
                Đang phân tích dữ liệu và tạo nhận xét...
              </p>
            </div>
          )}

          {/* Show error message */}
          {commentError && (
            <Alert
              message="Lỗi tạo nhận xét AI"
              description={commentError}
              type="warning"
              showIcon
              closable
              onClose={() => setCommentError("")}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Editable Textarea */}
          <Input.TextArea
            value={aiComment}
            onChange={(e) => setAiComment(e.target.value)}
            placeholder="Nhập nhận xét về học sinh hoặc nhấn nút 'Tạo nhận xét AI' để tự động tạo..."
            rows={8}
            style={{
              fontSize: "14px",
              lineHeight: "1.8",
            }}
            showCount
            maxLength={2000}
          />
        </Card>

        {/* Session History */}
        <Card title="Lịch sử học tập" size="small">
          <Table
            columns={columns}
            dataSource={studentSessions}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            size="small"
          />
        </Card>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "#999",
          }}
        >
          <Divider />
          <p>Báo cáo này được tạo tự động từ hệ thống quản lý học sinh</p>
          <p>Mọi thắc mắc xin liên hệ với giáo viên hoặc ban quản lý</p>
        </div>
      </div>
    </Modal>
  );
};

export default StudentReport;
