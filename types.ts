export type ScheduleEvent = {
    id: string;
    "Tên công việc": string;
    "Loại"?: 'LichHoc' | 'LichThi' | 'LichLamViec' | 'CV';
    "Ngày": string;
    "Giờ bắt đầu": string;
    "Giờ kết thúc": string;
    "Địa điểm"?: string;
    "Giáo viên phụ trách": string; // Teacher name for backward compatibility
    "Teacher ID"?: string; // Teacher ID to prevent duplicate creation
    "Email giáo viên"?: string; // NEW - Track teacher by email
    "Học sinh"?: string[]; // Student names for backward compatibility
    "Student IDs"?: string[]; // Student IDs to prevent duplicate creation
    "Phụ cấp di chuyển"?: string;
    "Nhận xét"?: string;
};

export type FilterType = 'all' | 'study' | 'work';

export type UserRole = 'admin' | 'teacher';

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    teacherName?: string; // Optional display name used in legacy schedule/attendance matching
    role: UserRole;
    teacherId?: string; // Link to Giáo_viên record
    position?: string; // Position from Giáo_viên table (Admin, Giáo viên, etc.)
    isAdmin?: boolean; // True if position === "Admin"
    createdAt: string;
    updatedAt?: string;
}
