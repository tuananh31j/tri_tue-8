import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Input,
  InputNumber,
  Checkbox,
  Popconfirm,
  message,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../../firebase";
import { AttendanceSession, AttendanceRecord } from "../../types";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const ClassSessionHistory = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSession | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecords, setEditingRecords] = useState<AttendanceRecord[]>([]);
  const [editingHomework, setEditingHomework] = useState({
    description: "",
    total: 0,
  });

  useEffect(() => {
    const sessionsRef = ref(database, "datasheet/Điểm_danh_sessions");
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allSessions = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<AttendanceSession, "id">),
        }));

        // Filter sessions for this class
        const classSessions = allSessions
          .filter((s) => s["Class ID"] === classId)
          .sort(
            (a, b) =>
              new Date(b["Ngày"]).getTime() - new Date(a["Ngày"]).getTime()
          );

        setSessions(classSessions);
      } else {
        setSessions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classId]);

  const handleView = (session: AttendanceSession) => {
    setSelectedSession(session);
    setIsViewModalOpen(true);
  };

  const handleEdit = (session: AttendanceSession) => {
    setSelectedSession(session);
    setEditingRecords(session["Điểm danh"] || []);
    setEditingHomework({
      description: session["Bài tập"]?.["Mô tả"] || "",
      total: session["Bài tập"]?.["Tổng số bài"] || 0,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSession) return;

    try {
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

      const updateData = {
        "Điểm danh": editingRecords,
        "Bài tập":
          editingHomework.description || editingHomework.total
            ? {
                "Mô tả": editingHomework.description,
                "Tổng số bài": editingHomework.total,
                "Người giao": selectedSession["Bài tập"]?.["Người giao"] || "",
                "Thời gian giao":
                  selectedSession["Bài tập"]?.["Thời gian giao"] ||
                  new Date().toISOString(),
              }
            : undefined,
      };

      const cleanedData = cleanData(updateData);
      const sessionRef = ref(
        database,
        `datasheet/Điểm_danh_sessions/${selectedSession.id}`
      );
      await update(sessionRef, cleanedData);

      message.success("Đã cập nhật buổi học");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating session:", error);
      message.error("Không thể cập nhật buổi học");
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      const sessionRef = ref(
        database,
        `datasheet/Điểm_danh_sessions/${sessionId}`
      );
      await remove(sessionRef);
      message.success("Đã xóa buổi học");
    } catch (error) {
      console.error("Error deleting session:", error);
      message.error("Không thể xóa buổi học");
    }
  };

  const handleRecordChange = (
    studentId: string,
    field: keyof AttendanceRecord,
    value: any
  ) => {
    setEditingRecords((prev) =>
      prev.map((record) => {
        if (record["Student ID"] === studentId) {
          const updated = { ...record };
          if (value !== null && value !== undefined && value !== "") {
            (updated as any)[field] = value;
          } else if (field === "Điểm" || field === "Bài tập hoàn thành") {
            delete (updated as any)[field];
          }

          // No need to update based on Trạng thái anymore

          return updated;
        }
        return record;
      })
    );
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "Ngày",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      width: 120,
    },
    {
      title: "Giờ học",
      key: "time",
      render: (_: any, record: AttendanceSession) =>
        `${record["Giờ bắt đầu"]} - ${record["Giờ kết thúc"]}`,
      width: 120,
    },
    {
      title: "Giáo viên",
      dataIndex: "Giáo viên",
      key: "teacher",
      width: 150,
    },
    {
      title: "Có mặt",
      key: "present",
      render: (_: any, record: AttendanceSession) => {
        const presentCount =
          record["Điểm danh"]?.filter((r) => r["Có mặt"]).length || 0;
        const total = record["Điểm danh"]?.length || 0;
        return (
          <Tag color="green">
            {presentCount}/{total}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "Trạng thái",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          not_started: <Tag color="default">Chưa bắt đầu</Tag>,
          in_progress: <Tag color="blue">Đang diễn ra</Tag>,
          completed: <Tag color="green">Hoàn thành</Tag>,
        };
        return statusMap[status as keyof typeof statusMap];
      },
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 200,
      render: (_: any, record: AttendanceSession) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa buổi học"
            description="Bạn có chắc chắn muốn xóa buổi học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const editColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên học sinh",
      dataIndex: "Tên học sinh",
      key: "name",
      width: 150,
    },
    {
      title: "Có mặt",
      key: "present",
      width: 90,
      render: (_: any, record: AttendanceRecord) => (
        <Checkbox
          checked={record["Có mặt"]}
          onChange={(e) =>
            handleRecordChange(record["Student ID"], "Có mặt", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Đi muộn",
      key: "late",
      width: 90,
      render: (_: any, record: AttendanceRecord) => (
        <Checkbox
          checked={record["Đi muộn"] || false}
          onChange={(e) =>
            handleRecordChange(
              record["Student ID"],
              "Đi muộn",
              e.target.checked
            )
          }
          disabled={!record["Có mặt"]}
        />
      ),
    },
    {
      title: "Vắng có phép",
      key: "permission",
      width: 110,
      render: (_: any, record: AttendanceRecord) => (
        <Checkbox
          checked={record["Vắng có phép"] || false}
          onChange={(e) =>
            handleRecordChange(
              record["Student ID"],
              "Vắng có phép",
              e.target.checked
            )
          }
          disabled={record["Có mặt"]}
        />
      ),
    },
    {
      title: "Bài tập",
      key: "exercises",
      width: 100,
      render: (_: any, record: AttendanceRecord) => (
        <InputNumber
          min={0}
          max={editingHomework.total || 100}
          value={record["Bài tập hoàn thành"] ?? null}
          onChange={(value) =>
            handleRecordChange(
              record["Student ID"],
              "Bài tập hoàn thành",
              value
            )
          }
          disabled={!record["Có mặt"]}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Điểm",
      key: "score",
      width: 100,
      render: (_: any, record: AttendanceRecord) => (
        <InputNumber
          min={0}
          max={10}
          step={0.5}
          value={record["Điểm"] ?? null}
          onChange={(value) =>
            handleRecordChange(record["Student ID"], "Điểm", value)
          }
          disabled={!record["Có mặt"]}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Ghi chú",
      key: "note",
      width: 150,
      render: (_: any, record: AttendanceRecord) => (
        <Input
          value={record["Ghi chú"]}
          onChange={(e) =>
            handleRecordChange(record["Student ID"], "Ghi chú", e.target.value)
          }
        />
      ),
    },
  ];

  const getStatusTags = (record: AttendanceRecord) => {
    const tags = [];
    if (record["Có mặt"]) {
      tags.push(
        <Tag key="present" color="green">
          Có mặt
        </Tag>
      );
      if (record["Đi muộn"]) {
        tags.push(
          <Tag key="late" color="orange">
            Đi muộn
          </Tag>
        );
      }
    } else {
      tags.push(
        <Tag key="absent" color="red">
          Vắng
        </Tag>
      );
      if (record["Vắng có phép"]) {
        tags.push(
          <Tag key="permission" color="blue">
            Có phép
          </Tag>
        );
      }
    }
    return tags;
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Lịch sử buổi học</h2>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>

      <Table
        columns={columns}
        dataSource={sessions}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
      />

      {/* View Modal */}
      <Modal
        title={`Chi tiết buổi học - ${selectedSession?.["Ngày"] ? dayjs(selectedSession["Ngày"]).format("DD/MM/YYYY") : ""}`}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        {selectedSession && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Lớp học">
                {selectedSession["Tên lớp"]}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày">
                {dayjs(selectedSession["Ngày"]).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ học">
                {selectedSession["Giờ bắt đầu"]} -{" "}
                {selectedSession["Giờ kết thúc"]}
              </Descriptions.Item>
              <Descriptions.Item label="Giáo viên">
                {selectedSession["Giáo viên"]}
              </Descriptions.Item>
              {selectedSession["Thời gian điểm danh"] && (
                <Descriptions.Item label="Thời gian điểm danh" span={2}>
                  {dayjs(selectedSession["Thời gian điểm danh"]).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                  {selectedSession["Người điểm danh"] &&
                    ` - ${selectedSession["Người điểm danh"]}`}
                </Descriptions.Item>
              )}
              {selectedSession["Thời gian hoàn thành"] && (
                <Descriptions.Item label="Thời gian hoàn thành" span={2}>
                  {dayjs(selectedSession["Thời gian hoàn thành"]).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                  {selectedSession["Người hoàn thành"] &&
                    ` - ${selectedSession["Người hoàn thành"]}`}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedSession["Bài tập"] && (
              <Card title="Bài tập" size="small" style={{ marginBottom: 16 }}>
                <p>
                  <strong>Mô tả:</strong> {selectedSession["Bài tập"]["Mô tả"]}
                </p>
                <p>
                  <strong>Tổng số bài:</strong>{" "}
                  {selectedSession["Bài tập"]["Tổng số bài"]}
                </p>
              </Card>
            )}

            <Table
              columns={[
                {
                  title: "STT",
                  key: "index",
                  width: 60,
                  render: (_: any, __: any, i: number) => i + 1,
                },
                {
                  title: "Tên học sinh",
                  dataIndex: "Tên học sinh",
                  key: "name",
                },
                {
                  title: "Trạng thái",
                  key: "status",
                  render: (_: any, record: AttendanceRecord) =>
                    getStatusTags(record),
                },
                {
                  title: "Bài tập",
                  dataIndex: "Bài tập hoàn thành",
                  key: "exercises",
                  render: (v: any) => v ?? "-",
                },
                {
                  title: "Điểm",
                  dataIndex: "Điểm",
                  key: "score",
                  render: (v: any) => v ?? "-",
                },
                {
                  title: "Ghi chú",
                  dataIndex: "Ghi chú",
                  key: "note",
                  render: (v: any) => v || "-",
                },
              ]}
              dataSource={selectedSession["Điểm danh"]}
              rowKey="Student ID"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={`Chỉnh sửa buổi học - ${selectedSession?.["Ngày"] ? dayjs(selectedSession["Ngày"]).format("DD/MM/YYYY") : ""}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleSaveEdit}
        okText="Lưu"
        cancelText="Hủy"
        width={1200}
      >
        {selectedSession && (
          <div>
            <Card title="Bài tập" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <label>Mô tả bài tập:</label>
                  <Input.TextArea
                    rows={2}
                    value={editingHomework.description}
                    onChange={(e) =>
                      setEditingHomework((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label>Tổng số bài:</label>
                  <InputNumber
                    min={0}
                    value={editingHomework.total}
                    onChange={(value) =>
                      setEditingHomework((prev) => ({
                        ...prev,
                        total: value || 0,
                      }))
                    }
                    style={{ width: 200 }}
                  />
                </div>
              </Space>
            </Card>

            <Table
              columns={editColumns}
              dataSource={editingRecords}
              rowKey="Student ID"
              pagination={false}
              scroll={{ x: 900 }}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClassSessionHistory;
