import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  message,
  DatePicker,
  Popconfirm,
  Card,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import { AttendanceSession, ScoreDetail } from "../types";
import dayjs from "dayjs";

interface ScoreDetailModalProps {
  visible: boolean;
  onClose: () => void;
  session: AttendanceSession | null;
  studentId: string;
  studentName: string;
}

const ScoreDetailModal = ({
  visible,
  onClose,
  session,
  studentId,
  studentName,
}: ScoreDetailModalProps) => {
  const [form] = Form.useForm();
  const [scores, setScores] = useState<ScoreDetail[]>([]);
  const [editingScore, setEditingScore] = useState<ScoreDetail | null>(null);

  useEffect(() => {
    if (session && studentId) {
      const studentRecord = session["Điểm danh"]?.find(
        (r) => r["Student ID"] === studentId
      );
      setScores(studentRecord?.["Chi tiết điểm"] || []);
    }
  }, [session, studentId]);

  const handleAddScore = async (values: any) => {
    try {
      const newScore: ScoreDetail = {
        "Tên điểm": values.scoreName,
        "Điểm": values.score,
        "Ngày": values.date.format("YYYY-MM-DD"),
        "Ghi chú": values.note || "",
      };

      const updatedScores = editingScore
        ? scores.map((s) =>
            s["Tên điểm"] === editingScore["Tên điểm"] &&
            s["Ngày"] === editingScore["Ngày"]
              ? newScore
              : s
          )
        : [...scores, newScore];

      // Update in Firebase
      if (session) {
        const updatedAttendance = session["Điểm danh"]?.map((record) => {
          if (record["Student ID"] === studentId) {
            return {
              ...record,
              "Chi tiết điểm": updatedScores,
            };
          }
          return record;
        });

        const sessionRef = ref(
          database,
          `datasheet/Điểm_danh_sessions/${session.id}`
        );
        await update(sessionRef, {
          "Điểm danh": updatedAttendance,
        });

        setScores(updatedScores);
        form.resetFields();
        setEditingScore(null);
        message.success(editingScore ? "Đã cập nhật điểm" : "Đã thêm điểm");
      }
    } catch (error) {
      console.error("Error saving score:", error);
      message.error("Lỗi khi lưu điểm");
    }
  };

  const handleDeleteScore = async (score: ScoreDetail) => {
    try {
      const updatedScores = scores.filter(
        (s) =>
          !(
            s["Tên điểm"] === score["Tên điểm"] && s["Ngày"] === score["Ngày"]
          )
      );

      if (session) {
        const updatedAttendance = session["Điểm danh"]?.map((record) => {
          if (record["Student ID"] === studentId) {
            return {
              ...record,
              "Chi tiết điểm": updatedScores,
            };
          }
          return record;
        });

        const sessionRef = ref(
          database,
          `datasheet/Điểm_danh_sessions/${session.id}`
        );
        await update(sessionRef, {
          "Điểm danh": updatedAttendance,
        });

        setScores(updatedScores);
        message.success("Đã xóa điểm");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
      message.error("Lỗi khi xóa điểm");
    }
  };

  const handleEditScore = (score: ScoreDetail) => {
    setEditingScore(score);
    form.setFieldsValue({
      scoreName: score["Tên điểm"],
      score: score["Điểm"],
      date: dayjs(score["Ngày"]),
      note: score["Ghi chú"],
    });
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
      title: "Tên điểm",
      dataIndex: "Tên điểm",
      key: "scoreName",
      width: 200,
    },
    {
      title: "Điểm",
      dataIndex: "Điểm",
      key: "score",
      width: 80,
      render: (score: number) => <strong>{score}</strong>,
    },
    {
      title: "Ghi chú",
      dataIndex: "Ghi chú",
      key: "note",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: ScoreDetail) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditScore(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteScore(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={`Bảng điểm - ${studentName}`}
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
        setEditingScore(null);
      }}
      width={900}
      footer={null}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Add/Edit Form */}
        <Card title={editingScore ? "Sửa điểm" : "Thêm điểm mới"} size="small">
          <Form
            form={form}
            layout="inline"
            onFinish={handleAddScore}
            initialValues={{
              date: dayjs(),
            }}
          >
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: "Chọn ngày" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              name="scoreName"
              label="Tên điểm"
              rules={[{ required: true, message: "Nhập tên điểm" }]}
            >
              <Input placeholder="VD: Kiểm tra 15 phút" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item
              name="score"
              label="Điểm"
              rules={[
                { required: true, message: "Nhập điểm" },
                { type: "number", min: 0, max: 10, message: "Điểm từ 0-10" },
              ]}
            >
              <InputNumber
                min={0}
                max={10}
                step={0.5}
                style={{ width: 100 }}
              />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <Input placeholder="Ghi chú" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                {editingScore ? "Cập nhật" : "Thêm"}
              </Button>
              {editingScore && (
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    form.resetFields();
                    setEditingScore(null);
                  }}
                >
                  Hủy
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>

        {/* Scores Table */}
        <Table
          columns={columns}
          dataSource={scores}
          rowKey={(record) => `${record["Ngày"]}-${record["Tên điểm"]}`}
          pagination={false}
          size="small"
          locale={{ emptyText: "Chưa có điểm nào" }}
        />
      </Space>
    </Modal>
  );
};

export default ScoreDetailModal;
