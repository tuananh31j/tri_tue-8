import React, { useState, useEffect, useRef } from "react";
import type { ScheduleEvent } from "../types";
import { DATABASE_URL_BASE } from "@/firebase";
import {
  Modal,
  Card,
  Input,
  Button,
  Form,
  Upload,
  Tag,
  Popconfirm,
  Space,
  Typography,
  DatePicker,
  Row,
  Col,
  Tooltip,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PaperClipOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title, Text } = Typography;

const KANBAN_URL = `${DATABASE_URL_BASE}/datasheet/Kanban.json`;

const KanbanCard: React.FC<{
  task: any;
  onDoubleClick: (task: any) => void;
  isEditing: boolean;
  onSave: (id: string, data: Partial<any>) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent, taskId: string) => void;
}> = ({
  task,
  onDoubleClick,
  isEditing,
  onSave,
  onCancel,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing) {
      // Auto-fill current date and time
      const now = new Date();
      form.setFieldsValue({
        title: task.title,
        subtitle: task.subtitle,
        assignee: task.assignee || "",
        video: task.video || "",
        text: task.text || "",
        day: task.day || now.getDate(),
        month: task.month || now.getMonth() + 1,
        hour: task.hour || now.getHours(),
      });
      // Keep file in state separately as it might be base64
      if (task.file) {
        form.setFieldsValue({ file: task.file });
      }
    }
  }, [isEditing, task, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(task.id, {
        title: values.title,
        subtitle: values.subtitle,
        assignee: values.assignee,
        video: values.video,
        file: values.file || task.file,
        text: values.text,
        day: values.day ? parseInt(values.day) : undefined,
        month: values.month ? parseInt(values.month) : undefined,
        hour: values.hour ? parseInt(values.hour) : undefined,
      });
    });
  };

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        form.setFieldsValue({ file: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <Card
        size="small"
        style={{
          borderLeft: "4px solid #1890ff",
          boxShadow: "0 0 0 2px #1890ff33",
        }}
      >
        <Form form={form} layout="vertical" size="small">
          <Form.Item name="title" label="Tiêu đề" style={{ marginBottom: 8 }}>
            <Input placeholder="Tiêu đề" />
          </Form.Item>
          <Form.Item name="subtitle" label="Mô tả" style={{ marginBottom: 8 }}>
            <Input placeholder="Mô tả" />
          </Form.Item>
          <Form.Item
            name="assignee"
            label="Người thực hiện"
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Người thực hiện" />
          </Form.Item>
          <Form.Item name="video" label="Video URL" style={{ marginBottom: 8 }}>
            <Input
              placeholder="Video URL (YouTube)"
              prefix={<VideoCameraOutlined />}
            />
          </Form.Item>
          <Form.Item label="File đính kèm" style={{ marginBottom: 8 }}>
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<PaperClipOutlined />} size="small">
                Chọn file
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="text"
            label="Nội dung chi tiết"
            style={{ marginBottom: 8 }}
          >
            <TextArea rows={2} placeholder="Nội dung chi tiết" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item name="day" label="Ngày" style={{ marginBottom: 8 }}>
                <Input type="number" placeholder="Ngày" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="month" label="Tháng" style={{ marginBottom: 8 }}>
                <Input type="number" placeholder="Tháng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hour" label="Giờ" style={{ marginBottom: 8 }}>
                <Input type="number" placeholder="Giờ" />
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              size="small"
            >
              Lưu
            </Button>
            <Button icon={<CloseOutlined />} onClick={onCancel} size="small">
              Hủy
            </Button>
          </Space>
        </Form>
      </Card>
    );
  }

  const getStatusConfig = () => {
    if (task.status === "done")
      return {
        color: "success",
        text: "Hoàn thành",
        icon: <CheckCircleOutlined />,
      };
    if (task.status === "inprogress")
      return {
        color: "processing",
        text: "Đang làm",
        icon: <SyncOutlined spin />,
      };
    return { color: "default", text: "Cần làm", icon: <ClockCircleOutlined /> };
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      id={task.id}
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={(e) => onDragEnd?.(e, task.id)}
      style={{ cursor: "grab" }}
    >
      <Card
        size="small"
        hoverable
        onDoubleClick={() => onDoubleClick(task)}
        style={{
          borderLeft: `4px solid ${task.type === "study" ? "#1890ff" : "#36797f"}`,
          position: "relative",
        }}
        styles={{
          body: { paddingRight: 32 },
        }}
        extra={
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa task này?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(task.id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, paddingRight: 8 }}>
              <Text strong>{task.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {task.subtitle}
              </Text>
            </div>
            <Tag icon={statusConfig.icon} color={statusConfig.color}>
              {statusConfig.text}
            </Tag>
          </div>

          {/* Display video */}
          {task.video && (
            <div style={{ marginTop: 8 }}>
              <iframe
                src={task.video.replace("watch?v=", "embed/").split("&")[0]}
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  border: "none",
                }}
                allowFullScreen
                title="Video"
              />
            </div>
          )}

          {/* Display file */}
          {task.file && (
            <Button
              type="link"
              icon={<PaperClipOutlined />}
              size="small"
              href={task.file}
              download={task.file.startsWith("data:")}
              target={task.file.startsWith("data:") ? undefined : "_blank"}
              style={{ padding: 0 }}
            >
              {task.file.startsWith("data:") ? "Tải file" : "Xem file"}
            </Button>
          )}

          {/* Display text */}
          {task.text && (
            <Collapse
              size="small"
              items={[
                {
                  key: "1",
                  label: (
                    <Space size="small">
                      <FileTextOutlined />
                      <Text style={{ fontSize: 12 }}>Nội dung chi tiết</Text>
                    </Space>
                  ),
                  children: (
                    <Text style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
                      {task.text}
                    </Text>
                  ),
                },
              ]}
            />
          )}

          {/* Display assignee */}
          {task.assignee && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              👤 {task.assignee}
            </Text>
          )}

          {/* Display date info */}
          {(task.day || task.month || task.hour) && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              📅 {task.day}/{task.month} - {task.hour}:00
            </Text>
          )}

          {/* Display old attachment format (backward compatibility) */}
          {task.attachment && (
            <div style={{ marginTop: 8 }}>
              {task.attachment.type === "image" && (
                <img
                  src={task.attachment.url}
                  alt="attachment"
                  style={{ maxWidth: "100%", borderRadius: 8 }}
                />
              )}
              {task.attachment.type === "video" && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={task.attachment.url}
                    title="YouTube video"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                      borderRadius: 8,
                    }}
                    allowFullScreen
                  />
                </div>
              )}
              {task.attachment.type === "file" && (
                <Button
                  type="link"
                  icon={<PaperClipOutlined />}
                  href={task.attachment.url}
                  target="_blank"
                  size="small"
                  style={{ padding: 0 }}
                >
                  {task.attachment.name}
                </Button>
              )}
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

const KanbanColumn: React.FC<{
  title: string;
  status: "todo" | "inprogress" | "done";
  children: React.ReactNode;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  taskCount: number;
}> = ({
  title,
  status,
  children,
  onDragOver,
  onDrop,
  onDragLeave,
  taskCount,
}) => {
  return (
    <Card
      title={
        <Space>
          <Text strong>{title}</Text>
          <Tag color="default">{taskCount}</Tag>
        </Space>
      }
      data-status={status}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        },
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        {children}
      </Space>
    </Card>
  );
};

export const KanbanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  onUpdate?: () => void;
}> = ({ isOpen, onClose, event, onUpdate }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load tasks from Firebase when event changes
  useEffect(() => {
    const loadKanbanData = async () => {
      if (event) {
        try {
          const response = await fetch(
            `${KANBAN_URL.split(".json")[0]}/${event.id}.json`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.Tasks) {
              // Convert from Firebase format to any format
              const convertedTasks: any[] = data.Tasks.map((task: any) => ({
                id: task.Id,
                title: task.Title,
                subtitle: task.Subtitle,
                status: task.Status,
                type: task.Type,
                assignee: task.Assignee,
                video: task.Video,
                file: task.File,
                text: task.Text,
                day: task.Day,
                month: task.Month,
                hour: task.Hour,
                attachment: task.Attachment,
              }));
              setTasks(convertedTasks);
            } else {
              setTasks([]);
            }
          } else {
            setTasks([]);
          }
        } catch (error) {
          console.error("Error loading Kanban data:", error);
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    };

    loadKanbanData();
  }, [event]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingTaskId &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        // Save changes when clicking outside
        const task = tasks.find((t) => t.id === editingTaskId);
        if (task) {
          const cardElement = document.getElementById(task.id);
          if (cardElement && !cardElement.contains(e.target as Node)) {
            setEditingTaskId(null);
          }
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editingTaskId, tasks]);

  if (!isOpen) return null;

  // Helper function to convert any to Firebase format
  const convertTaskToFirebase = (task: any) => ({
    Id: task.id,
    Title: task.title,
    Subtitle: task.subtitle,
    Status: task.status,
    Type: task.type,
    Assignee: task.assignee || null,
    Video: task.video || null,
    File: task.file || null,
    Text: task.text || null,
    Day: task.day || null,
    Month: task.month || null,
    Hour: task.hour || null,
    Attachment: task.attachment || null,
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    setTimeout(() => {
      const el = document.getElementById(taskId);
      if (el) el.classList.add("opacity-50", "shadow-large");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, taskId: string) => {
    const el = document.getElementById(taskId);
    if (el) el.classList.remove("opacity-50", "shadow-large");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const column = (e.target as HTMLElement).closest("[data-status]");
    if (column) {
      document
        .querySelectorAll("[data-status]")
        .forEach((col) => col.classList.remove("bg-brand-light"));
      column.classList.add("bg-brand-light");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const column = (e.target as HTMLElement).closest("[data-status]");
    if (column) {
      column.classList.remove("bg-brand-light");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const column = (e.target as HTMLElement).closest("[data-status]");
    if (column && event) {
      column.classList.remove("bg-brand-light");
      const taskId = e.dataTransfer.getData("taskId");
      const newStatus = column.getAttribute("data-status") as
        | "todo"
        | "inprogress"
        | "done";

      // Update local state
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      // Save to Firebase /Kanban
      try {
        const kanbanData = {
          Id: event.id,
          Task: event["Tên công việc"],
          Tasks: updatedTasks.map(convertTaskToFirebase),
        };

        const response = await fetch(
          `${KANBAN_URL.split(".json")[0]}/${event.id}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kanbanData),
          }
        );
        if (!response.ok) throw new Error("Failed to update task status");

        // Refresh events in parent
        if (onUpdate) {
          onUpdate();
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const handleDoubleClick = (task: any) => {
    setEditingTaskId(task.id);
  };

  const handleSave = async (id: string, data: Partial<any>) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);

    // Save to Firebase /Kanban
    if (event) {
      try {
        const kanbanData = {
          Id: event.id,
          Task: event["Tên công việc"],
          Tasks: updatedTasks.map(convertTaskToFirebase),
        };

        const response = await fetch(
          `${KANBAN_URL.split(".json")[0]}/${event.id}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kanbanData),
          }
        );
        if (!response.ok) throw new Error("Failed to save task");
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error saving task:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
  };

  const handleDelete = async (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);

    // Save to Firebase /Kanban
    if (event) {
      try {
        const kanbanData = {
          Id: event.id,
          Task: event["Tên công việc"],
          Tasks: updatedTasks.map(convertTaskToFirebase),
        };

        const response = await fetch(
          `${KANBAN_URL.split(".json")[0]}/${event.id}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kanbanData),
          }
        );
        if (!response.ok) throw new Error("Failed to delete task");
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const renderTaskCards = (taskList: any[]) => {
    return taskList.map((task) => (
      <KanbanCard
        key={task.id}
        task={task}
        onDoubleClick={handleDoubleClick}
        isEditing={editingTaskId === task.id}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    ));
  };

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Kanban: {event ? event["Tên công việc"] : "Board"}
          </Title>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 1400, top: 20 }}
      styles={{
        body: {
          height: "calc(90vh - 110px)",
          overflow: "hidden",
          padding: "16px",
        },
      }}
    >
      <div
        ref={modalRef}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              const newTask: any = {
                id: `k-${new Date().getTime()}`,
                title: "",
                subtitle: "",
                status: "todo",
                type:
                  event?.["Loại"] === "LichThi"
                    ? "exam"
                    : event?.["Loại"] === "LichLamViec"
                      ? "work"
                      : "study",
              };
              const updatedTasks = [...tasks, newTask];
              setTasks(updatedTasks);

              // Save to Firebase /Kanban
              if (event) {
                try {
                  const kanbanData = {
                    Id: event.id,
                    Task: event["Tên công việc"],
                    Tasks: updatedTasks.map(convertTaskToFirebase),
                  };

                  const response = await fetch(
                    `${KANBAN_URL.split(".json")[0]}/${event.id}.json`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(kanbanData),
                    }
                  );
                  if (!response.ok) throw new Error("Failed to add task");
                  if (onUpdate) onUpdate();
                } catch (error) {
                  console.error("Error adding task:", error);
                }
              }
            }}
            style={{ backgroundColor: "#36797f" }}
          >
            Thêm Task
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ flex: 1, overflow: "hidden" }}>
          <Col xs={24} md={8} style={{ height: "100%" }}>
            <KanbanColumn
              title="Cần làm"
              status="todo"
              taskCount={tasksByStatus.todo.length}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
            >
              {renderTaskCards(tasksByStatus.todo)}
            </KanbanColumn>
          </Col>
          <Col xs={24} md={8} style={{ height: "100%" }}>
            <KanbanColumn
              title="Đang thực hiện"
              status="inprogress"
              taskCount={tasksByStatus.inprogress.length}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
            >
              {renderTaskCards(tasksByStatus.inprogress)}
            </KanbanColumn>
          </Col>
          <Col xs={24} md={8} style={{ height: "100%" }}>
            <KanbanColumn
              title="Hoàn thành"
              status="done"
              taskCount={tasksByStatus.done.length}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
            >
              {renderTaskCards(tasksByStatus.done)}
            </KanbanColumn>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
