import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ref, onValue, push, update, remove, set } from "firebase/database";
import { database } from "../../firebase";
import { subjectOptions, gradeOptions } from "../../utils/selectOptions";

interface Course {
  id: string;
  Khối: number;
  "Môn học": string;
  Giá: number;
  "Lương GV Part-time": number;
  "Lương GV Full-time": number;
  "Ngày tạo": string;
  "Ngày cập nhật"?: string;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  // Fetch courses from Firebase
  useEffect(() => {
    setLoading(true);
    const coursesRef = ref(database, "datasheet/Khóa_học");

    const unsubscribe = onValue(
      coursesRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("🔥 Firebase courses data updated:", data);
        if (data) {
          const coursesList = Object.entries(data).map(
            ([key, value]: [string, any]) => ({
              id: key,
              ...value,
            })
          );
          console.log("📚 Courses list:", coursesList);
          setCourses(coursesList);
        } else {
          setCourses([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching courses:", error);
        message.error("Lỗi khi tải danh sách khóa học");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue({
      Khối: record["Khối"],
      "Môn học": record["Môn học"],
      Giá: record["Giá"],
      "Lương GV Part-time": record["Lương GV Part-time"],
      "Lương GV Full-time": record["Lương GV Full-time"],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      const courseRef = ref(database, `datasheet/Khóa_học/${courseId}`);
      await remove(courseRef);
      message.success("Xóa khóa học thành công");
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Lỗi khi xóa khóa học");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const timestamp = new Date().toISOString();

      // Validate trùng lặp: kiểm tra xem đã có khóa học với cùng khối và môn học chưa
      const existingCourse = courses.find(
        (course) =>
          course["Khối"] === values["Khối"] &&
          course["Môn học"] === values["Môn học"] &&
          course.id !== (editingCourse?.id || "")
      );

      if (existingCourse) {
        const gradeLabel = gradeOptions.find(opt => opt.value === values["Khối"])?.label || `Lớp ${values["Khối"]}`;
        const subjectLabel = subjectOptions.find(opt => opt.value === values["Môn học"])?.label || values["Môn học"];
        message.error(`Đã tồn tại khóa học ${subjectLabel} cho ${gradeLabel}!`);
        return;
      }

      if (editingCourse) {
        // Update existing course
        const courseRef = ref(
          database,
          `datasheet/Khóa_học/${editingCourse.id}`
        );
        await update(courseRef, {
          Khối: values["Khối"],
          "Môn học": values["Môn học"],
          Giá: values["Giá"],
          "Lương GV Part-time": values["Lương GV Part-time"],
          "Lương GV Full-time": values["Lương GV Full-time"],
          "Ngày cập nhật": timestamp,
        });
        message.success("Cập nhật khóa học thành công");
      } else {
        // Add new course
        const coursesRef = ref(database, "datasheet/Khóa_học");
        const newCourseRef = push(coursesRef);
        const courseData = {
          Khối: values["Khối"],
          "Môn học": values["Môn học"],
          Giá: values["Giá"],
          "Lương GV Part-time": values["Lương GV Part-time"],
          "Lương GV Full-time": values["Lương GV Full-time"],
          "Ngày tạo": timestamp,
        };
        console.log("➕ Adding new course:", courseData);
        await set(newCourseRef, courseData);
        console.log("✅ Course added with ID:", newCourseRef.key);
        message.success("Thêm khóa học thành công");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingCourse(null);
    } catch (error) {
      console.error("Error saving course:", error);
      message.error("Lỗi khi lưu khóa học");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCourse(null);
  };

  const columns = [
    {
      title: "Khối",
      dataIndex: "Khối",
      key: "grade",
      width: 120,
      sorter: (a: Course, b: Course) => a["Khối"] - b["Khối"],
      render: (grade: number) => {
        const gradeOption = gradeOptions.find((opt) => opt.value === grade);
        return gradeOption ? gradeOption.label : `Lớp ${grade}`;
      },
    },
    {
      title: "Môn học",
      dataIndex: "Môn học",
      key: "subject",
      width: 200,
      filters: subjectOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value: any, record: Course) => record["Môn học"] === value,
      render: (subject: string) => {
        const subjectOption = subjectOptions.find(
          (opt) => opt.value === subject
        );
        return subjectOption ? subjectOption.label : subject;
      },
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "Giá",
      key: "price",
      width: 150,
      sorter: (a: Course, b: Course) => a["Giá"] - b["Giá"],
      render: (price: number) => (
        <Tag color="blue">{price?.toLocaleString("vi-VN")} đ</Tag>
      ),
    },
    {
      title: "Lương GV PT/buổi",
      dataIndex: "Lương GV Part-time",
      key: "salaryPartTime",
      width: 150,
      sorter: (a: Course, b: Course) =>
        a["Lương GV Part-time"] - b["Lương GV Part-time"],
      render: (salary: number) => (
        <Tag color="green">{salary?.toLocaleString("vi-VN")} đ</Tag>
      ),
    },
    {
      title: "Lương GV FT/buổi",
      dataIndex: "Lương GV Full-time",
      key: "salaryFullTime",
      width: 150,
      sorter: (a: Course, b: Course) =>
        a["Lương GV Full-time"] - b["Lương GV Full-time"],
      render: (salary: number) => (
        <Tag color="orange">{salary?.toLocaleString("vi-VN")} đ</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "Ngày tạo",
      key: "createdAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "Ngày cập nhật",
      key: "updatedAt",
      width: 180,
      render: (date?: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: Course) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa khóa học"
            description="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Quản lý khóa học</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm khóa học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng số: ${total} khóa học`,
          showSizeChanger: true,
        }}
      />

      <Modal
        title={editingCourse ? "Sửa khóa học" : "Thêm khóa học mới"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingCourse ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
          <Form.Item
            label="Khối"
            name="Khối"
            rules={[{ required: true, message: "Vui lòng chọn khối!" }]}
          >
            <Select
              placeholder="Chọn khối"
              options={gradeOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="Môn học"
            name="Môn học"
            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjectOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="Giá (VNĐ)"
            name="Giá"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              {
                type: "number",
                min: 0,
                message: "Giá phải lớn hơn hoặc bằng 0!",
              },
            ]}
          >
            <InputNumber<number>
              placeholder="Nhập giá khóa học"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                Number((value ?? "").replace(/\$\s?|(,*)/g, ""))
              }
              min={0}
              step={10000}
            />
          </Form.Item>

          <Form.Item
            label="Lương GV Part-time/buổi (VNĐ)"
            name="Lương GV Part-time"
            rules={[
              { required: true, message: "Vui lòng nhập lương GV Part-time!" },
              {
                type: "number",
                min: 0,
                message: "Lương phải lớn hơn hoặc bằng 0!",
              },
            ]}
          >
            <InputNumber<number>
              placeholder="Nhập lương giáo viên Part-time"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                Number((value ?? "").replace(/\$\s?|(,*)/g, ""))
              }
              min={0}
              step={10000}
            />
          </Form.Item>

          <Form.Item
            label="Lương GV Full-time/buổi (VNĐ)"
            name="Lương GV Full-time"
            rules={[
              { required: true, message: "Vui lòng nhập lương GV Full-time!" },
              {
                type: "number",
                min: 0,
                message: "Lương phải lớn hơn hoặc bằng 0!",
              },
            ]}
          >
            <InputNumber<number>
              placeholder="Nhập lương giáo viên Full-time"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                Number((value ?? "").replace(/\$\s?|(,*)/g, ""))
              }
              min={0}
              step={10000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
