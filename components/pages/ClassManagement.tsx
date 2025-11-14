import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { Class } from "../../types";
import ClassFormModal from "../../components/ClassFormModal";
import AddStudentModal from "../../components/AddStudentModal";
import WrapperContent from "@/components/WrapperContent";

const ClassManagement = () => {
  const { classes, loading, deleteClass } = useClasses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

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

  const filteredClasses = classes.filter(
    (c) => filterStatus === "all" || c["Trạng thái"] === filterStatus
  );

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
        <Space>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngừng</Select.Option>
          </Select>
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
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredClasses}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
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
                {viewingClass["Môn học"]}
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
    </WrapperContent>
  );
};

export default ClassManagement;
