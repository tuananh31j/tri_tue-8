import React, { useState, useEffect, useRef } from "react";
import type { KanbanTask, ScheduleEvent } from "../types";

const DATABASE_URL_BASE =
  "https://morata-a9eba-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet";
const KANBAN_URL = `${DATABASE_URL_BASE}/Kanban.json`;

const initialTasks: KanbanTask[] = [
  {
    id: "k-1",
    title: "Xem lại bài giảng video",
    subtitle: "Môn: Lập trình Web",
    status: "todo",
    type: "study",
    attachment: {
      type: "video",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  },
  {
    id: "k-2",
    title: "Tải và đọc đề cương ôn tập",
    subtitle: "Thi: Vật lý 1",
    status: "todo",
    type: "exam",
    attachment: { type: "file", url: "#", name: "de-cuong-vat-ly-1.pdf" },
  },
  {
    id: "k-3",
    title: "Làm bài tập lớn",
    subtitle: "Môn: Toán cao cấp A2",
    status: "inprogress",
    type: "study",
    attachment: {
      type: "image",
      url: "https://picsum.photos/seed/code/400/200",
    },
  },
  {
    id: "k-4",
    title: "Đọc giáo trình chương 1",
    subtitle: "Môn: Kinh tế vi mô",
    status: "done",
    type: "study",
  },
];

const KanbanCard: React.FC<{
  task: KanbanTask;
  onDoubleClick: (task: KanbanTask) => void;
  isEditing: boolean;
  onSave: (id: string, data: Partial<KanbanTask>) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}> = ({ task, onDoubleClick, isEditing, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [subtitle, setSubtitle] = useState(task.subtitle);
  const [assignee, setAssignee] = useState(task.assignee || "");
  const [video, setVideo] = useState(task.video || "");
  const [file, setFile] = useState(task.file || "");
  const [text, setText] = useState(task.text || "");
  const [day, setDay] = useState(task.day?.toString() || "");
  const [month, setMonth] = useState(task.month?.toString() || "");
  const [hour, setHour] = useState(task.hour?.toString() || "");

  const handleSave = () => {
    onSave(task.id, {
      title,
      subtitle,
      assignee,
      video,
      file,
      text,
      day: day ? parseInt(day) : undefined,
      month: month ? parseInt(month) : undefined,
      hour: hour ? parseInt(hour) : undefined,
    });
  };

  useEffect(() => {
    if (isEditing) {
      // Auto-fill current date and time
      const now = new Date();
      setDay(now.getDate().toString());
      setMonth((now.getMonth() + 1).toString());
      setHour(now.getHours().toString());
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-soft mb-2 sm:mb-3 border-l-4 border-study ring-2 ring-study cursor-default">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
          className="w-full border border-line rounded-md p-1.5 text-sm sm:text-base font-semibold mb-1.5"
        />
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Mô tả"
          className="w-full border border-line rounded-md p-1.5 text-xs sm:text-sm text-muted mb-1.5"
        />
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Người thực hiện"
          className="w-full border border-line rounded-md p-1.5 text-xs sm:text-sm mb-1.5"
        />
        <input
          type="text"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          placeholder="Video URL (YouTube)"
          className="w-full border border-line rounded-md p-1.5 text-xs sm:text-sm mb-1.5"
        />
        <label className="block text-xs font-semibold mb-1">
          File đính kèm:
        </label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // Convert file to base64 for storage
              const reader = new FileReader();
              reader.onload = (event) => {
                setFile(event.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full border border-line rounded-md p-1.5 text-xs sm:text-sm mb-1.5"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nội dung chi tiết"
          className="w-full border border-line rounded-md p-1.5 text-xs sm:text-sm mb-1.5"
          rows={2}
        />
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2">
          <div>
            <label className="text-xs text-muted">Ngày</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full border border-line rounded-md p-1 sm:p-1.5 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Tháng</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-line rounded-md p-1 sm:p-1.5 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Giờ</label>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full border border-line rounded-md p-1 sm:p-1.5 text-xs sm:text-sm"
            />
          </div>
        </div>
        <div className="flex gap-1.5 sm:gap-2 mt-2">
          <button
            onClick={handleSave}
            className="border-none px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer bg-green-500 text-white"
          >
            Lưu
          </button>
          <button
            onClick={onCancel}
            className="border-none px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer bg-[#f1f3f5] text-ink"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (task.status === "done")
      return "bg-green-100 border-green-500 text-green-800";
    if (task.status === "inprogress")
      return "bg-yellow-100 border-yellow-500 text-yellow-800";
    return "bg-blue-100 border-blue-500 text-blue-800";
  };

  return (
    <div
      id={task.id}
      draggable
      onDoubleClick={() => onDoubleClick(task)}
      className={`kanban-card bg-white p-2 sm:p-3 rounded-lg shadow-soft cursor-grab active:cursor-grabbing border-l-4 ${
        task.type === "study" ? "border-study" : "border-brand"
      } relative group`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
        title="Xóa task"
      >
        ×
      </button>

      <div className="flex items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        <div className={`flex-1`}>
          <p className="text-sm sm:text-base font-semibold m-0 pr-5 sm:pr-6">
            {task.title}
          </p>
          <small className="text-muted mt-0.5 sm:mt-1 block text-xs sm:text-sm">
            {task.subtitle}
          </small>
        </div>
        <span
          className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor()} shrink-0`}
        >
          {task.status === "done"
            ? "✓"
            : task.status === "inprogress"
            ? "⋯"
            : "○"}
        </span>
      </div>

      {/* Display video */}
      {task.video && (
        <div className="mt-1.5 sm:mt-2">
          <iframe
            src={task.video.replace("watch?v=", "embed/").split("&")[0]}
            className="w-full h-24 sm:h-32 rounded-lg"
            allowFullScreen
            title="Video"
          />
        </div>
      )}

      {/* Display file */}
      {task.file && (
        <div className="mt-1.5 sm:mt-2">
          {task.file.startsWith("data:") ? (
            <a
              href={task.file}
              download
              className="block p-1.5 sm:p-2 bg-gray-100 border border-line rounded-lg text-ink text-xs sm:text-sm font-medium truncate no-underline hover:bg-gray-200"
            >
              📎 Tải file
            </a>
          ) : (
            <a
              href={task.file}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-1.5 sm:p-2 bg-gray-100 border border-line rounded-lg text-ink text-xs sm:text-sm font-medium truncate no-underline hover:bg-gray-200"
            >
              📎 File
            </a>
          )}
        </div>
      )}

      {/* Display text on hover */}
      {task.text && (
        <div className="mt-1.5 sm:mt-2 group/item relative">
          <div className="text-xs text-muted cursor-pointer hover:text-brand">
            📄 Xem nội dung...
          </div>
          <div className="absolute z-50 left-0 top-full mt-1 w-48 sm:w-64 bg-white p-2 sm:p-3 rounded-lg shadow-large border border-line opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all">
            <p className="text-xs sm:text-sm text-ink whitespace-pre-wrap">
              {task.text}
            </p>
          </div>
        </div>
      )}

      {/* Display assignee */}
      {task.assignee && (
        <div className="mt-1.5 sm:mt-2 text-xs text-muted truncate">
          👤 {task.assignee}
        </div>
      )}

      {/* Display date info */}
      {(task.day || task.month || task.hour) && (
        <div className="mt-1.5 sm:mt-2 text-xs text-muted">
          📅 {task.day}/{task.month} - {task.hour}:00
        </div>
      )}

      {task.attachment && (
        <div className="mt-3">
          {task.attachment.type === "image" && (
            <img
              src={task.attachment.url}
              alt="attachment"
              className="max-w-full rounded-lg"
            />
          )}
          {task.attachment.type === "video" && (
            <div className="relative w-full pb-[56.25%] h-0">
              <iframe
                src={task.attachment.url}
                title="YouTube video"
                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          )}
          {task.attachment.type === "file" && (
            <a
              href={task.attachment.url}
              className="block p-2 bg-gray-100 border border-line rounded-lg text-ink font-medium break-all no-underline hover:bg-gray-200"
            >
              🔗 {task.attachment.name}
            </a>
          )}
        </div>
      )}
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
    <div
      className="bg-[#f1f3f5] p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl flex flex-col h-full overflow-hidden transition-colors"
      data-status={status}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <h3 className="mt-0 text-sm sm:text-base font-bold pb-2 sm:pb-3 mb-2 sm:mb-4 border-b-2 border-line shrink-0">
        {title} <span className="font-normal text-muted">({taskCount})</span>
      </h3>
      <div className="overflow-y-auto flex-grow pr-1 space-y-2 sm:space-y-3">
        {children}
      </div>
    </div>
  );
};

export const KanbanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  event: ScheduleEvent | null;
  onUpdate?: () => void;
}> = ({ isOpen, onClose, event, onUpdate }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
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
              // Convert from Firebase format to KanbanTask format
              const convertedTasks: KanbanTask[] = data.Tasks.map(
                (task: any) => ({
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
                })
              );
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

  // Helper function to convert KanbanTask to Firebase format
  const convertTaskToFirebase = (task: KanbanTask) => ({
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

  const handleDoubleClick = (task: KanbanTask) => {
    setEditingTaskId(task.id);
  };

  const handleSave = async (id: string, data: Partial<KanbanTask>) => {
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

  const renderTaskCards = (taskList: KanbanTask[]) => {
    return taskList.map((task) => (
      <div
        key={task.id}
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={(e) => handleDragEnd(e, task.id)}
      >
        <KanbanCard
          task={task}
          onDoubleClick={handleDoubleClick}
          isEditing={editingTaskId === task.id}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-2 sm:p-4 animate-modalFadeIn overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white p-3 sm:p-6 md:p-8 rounded-xl shadow-large w-full max-w-5xl relative animate-modalContentSlideIn max-h-[95vh] sm:max-h-[90vh] flex flex-col my-auto modal-content-70"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-transparent border-none w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xl sm:text-2xl leading-none cursor-pointer text-muted transition-all hover:bg-[#f1f3f5] hover:text-ink hover:rotate-90"
        >
          &times;
        </button>
        <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0 pr-8">
          <h2 className="mt-0 text-lg sm:text-xl md:text-2xl border-l-4 border-brand pl-3 sm:pl-4 truncate">
            Kanban: {event ? event["Tên công việc"] : "Board"}
          </h2>
          <button
            onClick={async () => {
              const newTask: KanbanTask = {
                id: `k-${Date.now()}`,
                title: "Task mới",
                subtitle: "Mô tả task",
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
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-brand bg-brand text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-sm sm:text-base whitespace-nowrap"
          >
            + Thêm
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 flex-grow overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};
