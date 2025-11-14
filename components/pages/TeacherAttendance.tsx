import { useState, useEffect } from "react";
import { Card, List, Tag, Button, Empty, Badge } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useClasses } from "../../hooks/useClasses";
import { useAuth } from "../../contexts/AuthContext";
import { Class } from "../../types";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import WrapperContent from "@/components/WrapperContent";
import { subjectMap } from "@/utils/selectOptions";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const TeacherAttendance = () => {
  const { userProfile } = useAuth();
  const { classes, loading } = useClasses();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<any>(null);

  const teacherId =
    teacherData?.id || userProfile?.teacherId || userProfile?.uid || "";

  // Get today's day of week (2-8)
  const today = dayjs();
  const todayDayOfWeek = today.day() === 0 ? 8 : today.day() + 1; // Convert 0-6 to 2-8
  const todayDate = today.format("YYYY-MM-DD");

  // Filter classes for this teacher
  const myClasses = classes.filter((c) => {
    const match = c["Teacher ID"] === teacherId;
    // Check if class is within date range
    const startDate = c["Ngày bắt đầu"] ? dayjs(c["Ngày bắt đầu"]) : null;
    const endDate = c["Ngày kết thúc"] ? dayjs(c["Ngày kết thúc"]) : null;

    const isWithinDateRange =
      (!startDate || today.isSameOrAfter(startDate, "day")) &&
      (!endDate || today.isSameOrBefore(endDate, "day"));

    return match && isWithinDateRange && c["Trạng thái"] === "active";
  });

  // Get today's classes (classes that have schedule for today)
  const todayClasses = myClasses
    .filter((c) => {
      return c["Lịch học"]?.some(
        (schedule) => schedule["Thứ"] === todayDayOfWeek
      );
    })
    .sort((a, b) => {
      // Sort by start time
      const aSchedule = a["Lịch học"]?.find((s) => s["Thứ"] === todayDayOfWeek);
      const bSchedule = b["Lịch học"]?.find((s) => s["Thứ"] === todayDayOfWeek);
      if (!aSchedule || !bSchedule) return 0;
      return aSchedule["Giờ bắt đầu"].localeCompare(bSchedule["Giờ bắt đầu"]);
    });

  // Get other classes
  const otherClasses = myClasses.filter((c) => {
    return !c["Lịch học"]?.some(
      (schedule) => schedule["Thứ"] === todayDayOfWeek
    );
  });

  const handleStartAttendance = (classData: Class) => {
    navigate(`/workspace/attendance/session/${classData.id}`, {
      state: { classData, date: todayDate },
    });
  };

  return (
    <WrapperContent title="Điểm danh" isLoading={loading}>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Hôm nay: {today.format("dddd, DD/MM/YYYY")}
      </p>

      {todayClasses.length > 0 && (
        <Card
          title={
            <span>
              <Badge status="processing" />
              Lớp học hôm nay ({todayClasses.length})
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <List
            dataSource={todayClasses}
            renderItem={(classData) => {
              const todaySchedule = classData["Lịch học"]?.find(
                (s) => s["Thứ"] === todayDayOfWeek
              );
              return (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleStartAttendance(classData)}
                    >
                      Điểm danh
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        {classData["Tên lớp"]}
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          {subjectMap[classData["Môn học"]] ||
                            classData["Môn học"]}
                        </Tag>
                      </span>
                    }
                    description={
                      <div>
                        <div>
                          <ClockCircleOutlined />{" "}
                          {todaySchedule?.["Giờ bắt đầu"]} -{" "}
                          {todaySchedule?.["Giờ kết thúc"]}
                          {todaySchedule?.["Địa điểm"] &&
                            ` • ${todaySchedule["Địa điểm"]}`}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          Số học sinh: {classData["Student IDs"]?.length || 0}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      )}

      {otherClasses.length > 0 && (
        <Card title={`Lớp học khác (${otherClasses.length})`}>
          <List
            dataSource={otherClasses}
            renderItem={(classData) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleStartAttendance(classData)}>
                    Điểm danh
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {classData["Tên lớp"]}
                      <Tag color="default" style={{ marginLeft: 8 }}>
                        {subjectMap[classData["Môn học"]] ||
                          classData["Môn học"]}
                      </Tag>
                    </span>
                  }
                  description={`Số học sinh: ${classData["Student IDs"]?.length || 0}`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {myClasses.length === 0 && (
        <Empty description="Bạn chưa được phân công lớp học nào" />
      )}
    </WrapperContent>
  );
};

export default TeacherAttendance;
