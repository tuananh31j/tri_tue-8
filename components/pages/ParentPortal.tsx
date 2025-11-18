import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DATABASE_URL_BASE } from "@/firebase";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Spin,
  Empty,
  Tabs,
  Timeline,
  Progress,
  List,
  Badge,
  Descriptions,
  Button,
  Space,
  Calendar,
  Modal,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HomeOutlined,
  EditOutlined,
  DollarOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const ParentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, currentUser, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || !userProfile) {
        navigate("/login");
        return;
      }
      
      if (userProfile.role !== "parent") {
        navigate("/workspace");
        return;
      }
    }
  }, [authLoading, currentUser, userProfile, navigate]);

  // Load student data
  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.studentId) return;

      try {
        setLoading(true);

        // Fetch student info
        const studentRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Danh_sách_học_sinh/${userProfile.studentId}.json`
        );
        const studentData = await studentRes.json();
        setStudent(studentData);

        // Fetch all classes
        const classesRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Lớp_học.json`
        );
        const classesData = await classesRes.json();
        if (classesData) {
          const studentClasses = Object.entries(classesData)
            .filter(([id, cls]: [string, any]) =>
              cls["Student IDs"]?.includes(userProfile.studentId)
            )
            .map(([id, cls]: [string, any]) => ({ id, ...cls }));
          setClasses(studentClasses);
        }

        // Fetch attendance sessions
        const sessionsRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Điểm_danh_sessions.json`
        );
        const sessionsData = await sessionsRes.json();
        if (sessionsData) {
          const studentSessions = Object.entries(sessionsData)
            .filter(([id, session]: [string, any]) =>
              session["Điểm danh"]?.some(
                (r: any) => r["Student ID"] === userProfile.studentId
              )
            )
            .map(([id, session]: [string, any]) => ({ id, ...session }));
          setAttendanceSessions(studentSessions);
        }

        // Fetch invoices
        const invoicesRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Phiếu_thu_học_phí.json`
        );
        const invoicesData = await invoicesRes.json();
        if (invoicesData) {
          const studentInvoices = Object.entries(invoicesData)
            .filter(([key, invoice]: [string, any]) =>
              key.startsWith(`${userProfile.studentId}-`)
            )
            .map(([id, invoice]: [string, any]) => ({ id, ...invoice }))
            .sort((a, b) => b.year - a.year || b.month - a.month);
          setInvoices(studentInvoices);
        }

        // Fetch schedule events
        const scheduleRes = await fetch(
          `${DATABASE_URL_BASE}/datasheet/Thời_khoá_biểu.json`
        );
        const scheduleData = await scheduleRes.json();
        if (scheduleData) {
          const studentSchedule = Object.entries(scheduleData)
            .filter(([id, event]: [string, any]) =>
              event["Student IDs"]?.includes(userProfile.studentId)
            )
            .map(([id, event]: [string, any]) => ({ id, ...event }));
          setScheduleEvents(studentSchedule);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = attendanceSessions.length;
    let attendedSessions = 0;
    let lateSessions = 0;
    let totalScore = 0;
    let scoredSessions = 0;

    attendanceSessions.forEach((session) => {
      const record = session["Điểm danh"]?.find(
        (r: any) => r["Student ID"] === userProfile?.studentId
      );

      if (record) {
        if (record["Có mặt"]) attendedSessions++;
        if (record["Đi muộn"]) lateSessions++;
        if (record["Điểm"] !== null && record["Điểm"] !== undefined) {
          totalScore += record["Điểm"];
          scoredSessions++;
        }
      }
    });

    const attendanceRate =
      totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
    const averageScore = scoredSessions > 0 ? totalScore / scoredSessions : 0;

    return {
      totalSessions,
      attendedSessions,
      lateSessions,
      absentSessions: totalSessions - attendedSessions,
      attendanceRate,
      averageScore,
      scoredSessions,
    };
  }, [attendanceSessions, userProfile]);

  // Recent sessions
  const recentSessions = useMemo(() => {
    return attendanceSessions
      .sort((a, b) => new Date(b["Ngày"]).getTime() - new Date(a["Ngày"]).getTime())
      .slice(0, 10);
  }, [attendanceSessions]);

  // Prepare calendar data
  const calendarData = useMemo(() => {
    const data: Record<string, any[]> = {};

    // Add regular class schedules
    classes.forEach((cls) => {
      cls["Lịch học"]?.forEach((schedule: any) => {
        const dayOfWeek = schedule["Thứ"];
        if (!data[dayOfWeek]) {
          data[dayOfWeek] = [];
        }
        data[dayOfWeek].push({
          type: "class",
          className: cls["Tên lớp"],
          subject: cls["Môn học"],
          startTime: schedule["Giờ bắt đầu"],
          endTime: schedule["Giờ kết thúc"],
          location: schedule["Địa điểm"],
          teacher: cls["Giáo viên chủ nhiệm"],
        });
      });
    });

    // Add schedule events
    scheduleEvents.forEach((event) => {
      const date = dayjs(event["Ngày"]).format("YYYY-MM-DD");
      if (!data[date]) {
        data[date] = [];
      }
      data[date].push({
        type: "event",
        title: event["Tên công việc"],
        eventType: event["Loại"],
        startTime: event["Giờ bắt đầu"],
        endTime: event["Giờ kết thúc"],
        location: event["Địa điểm"],
        note: event["Nhận xét"],
      });
    });

    return data;
  }, [classes, scheduleEvents]);

  // Get list data for calendar
  const getListData = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayOfWeek = value.day() === 0 ? 8 : value.day() + 1; // Convert to Vietnamese format (2-8)

    const events = calendarData[dateStr] || [];
    const regularClasses = calendarData[dayOfWeek] || [];

    return [...events, ...regularClasses];
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!currentUser || !userProfile || userProfile.role !== "parent") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <Row align="middle" gutter={16}>
            <Col>
              <div className="w-16 h-16 bg-[#36797f] rounded-full flex items-center justify-center">
                <UserOutlined style={{ fontSize: 32, color: "white" }} />
              </div>
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0 }}>
                Xin chào, {userProfile?.studentName}
              </Title>
              <Text type="secondary">Mã học sinh: {userProfile?.studentCode}</Text>
            </Col>
            <Col>
              <Button
                type="primary"
                danger
                onClick={async () => {
                  await signOut();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số buổi học"
                value={stats.totalSessions}
                prefix={<BookOutlined />}
                suffix="buổi"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tỷ lệ tham gia"
                value={stats.attendanceRate}
                precision={1}
                suffix="%"
                valueStyle={{
                  color: stats.attendanceRate >= 80 ? "#3f8600" : "#cf1322",
                }}
                prefix={<CheckCircleOutlined />}
              />
              <Progress
                percent={stats.attendanceRate}
                showInfo={false}
                strokeColor={stats.attendanceRate >= 80 ? "#3f8600" : "#cf1322"}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={stats.averageScore}
                precision={1}
                valueStyle={{
                  color:
                    stats.averageScore >= 8
                      ? "#3f8600"
                      : stats.averageScore >= 6.5
                        ? "#1890ff"
                        : "#cf1322",
                }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Số lớp đang học"
                value={classes.length}
                prefix={<CalendarOutlined />}
                suffix="lớp"
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card>
          <Tabs
            items={[
              {
                key: "schedule",
                label: (
                  <span>
                    <CalendarOutlined /> Lịch học
                  </span>
                ),
                children: (
                  <div>
                    <Card style={{ marginBottom: 16 }}>
                      <Calendar
                        fullCellRender={(value) => {
                          const listData = getListData(value);
                          const hasClass = listData.some((item) => item.type === "class");
                          const hasEvent = listData.some((item) => item.type === "event");
                          
                          // Determine background color
                          let bgColor = "transparent";
                          if (hasEvent) {
                            bgColor = "#fff1f0"; // Light red for events
                          } else if (hasClass) {
                            bgColor = "#e6f7ff"; // Light blue for classes
                          }

                          return (
                            <div
                              style={{
                                height: "100%",
                                backgroundColor: bgColor,
                                border: listData.length > 0 ? "1px solid #d9d9d9" : "none",
                                borderRadius: 4,
                                padding: 4,
                              }}
                            >
                              <div style={{ textAlign: "right", marginBottom: 4 }}>
                                <Text strong>{value.date()}</Text>
                              </div>
                              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {listData.slice(0, 3).map((item, index) => (
                                  <li key={index} style={{ marginBottom: 2 }}>
                                    {item.type === "class" ? (
                                      <Badge
                                        status="processing"
                                        text={
                                          <Text
                                            style={{ fontSize: 11 }}
                                            ellipsis={{ tooltip: true }}
                                          >
                                            {item.startTime} - {item.subject}
                                          </Text>
                                        }
                                      />
                                    ) : (
                                      <Badge
                                        status="error"
                                        text={
                                          <Text
                                            style={{ fontSize: 11 }}
                                            ellipsis={{ tooltip: true }}
                                          >
                                            {item.startTime} - {item.title}
                                          </Text>
                                        }
                                      />
                                    )}
                                  </li>
                                ))}
                                {listData.length > 3 && (
                                  <li>
                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                      +{listData.length - 3} thêm...
                                    </Text>
                                  </li>
                                )}
                              </ul>
                            </div>
                          );
                        }}
                        onSelect={(date) => {
                          const listData = getListData(date);
                          if (listData.length > 0) {
                            Modal.info({
                              title: `Lịch học ngày ${date.format("DD/MM/YYYY")}`,
                              width: 600,
                              content: (
                                <div>
                                  <List
                                    dataSource={listData}
                                    renderItem={(item) => (
                                      <List.Item>
                                        <Card
                                          size="small"
                                          style={{ width: "100%" }}
                                          type={item.type === "event" ? "inner" : undefined}
                                        >
                                          {item.type === "class" ? (
                                            <div>
                                              <Space direction="vertical" style={{ width: "100%" }}>
                                                <div>
                                                  <Tag color="blue">{item.subject}</Tag>
                                                  <Text strong>{item.className}</Text>
                                                </div>
                                                <div>
                                                  <ClockCircleOutlined />{" "}
                                                  <Text>
                                                    {item.startTime} - {item.endTime}
                                                  </Text>
                                                </div>
                                                {item.location && (
                                                  <div>
                                                    <HomeOutlined /> <Text>{item.location}</Text>
                                                  </div>
                                                )}
                                                <div>
                                                  <UserOutlined /> <Text>{item.teacher}</Text>
                                                </div>
                                              </Space>
                                            </div>
                                          ) : (
                                            <div>
                                              <Space direction="vertical" style={{ width: "100%" }}>
                                                <div>
                                                  <Tag color="red">{item.eventType}</Tag>
                                                  <Text strong>{item.title}</Text>
                                                </div>
                                                <div>
                                                  <ClockCircleOutlined />{" "}
                                                  <Text>
                                                    {item.startTime} - {item.endTime}
                                                  </Text>
                                                </div>
                                                {item.location && (
                                                  <div>
                                                    <HomeOutlined /> <Text>{item.location}</Text>
                                                  </div>
                                                )}
                                                {item.note && (
                                                  <div>
                                                    <Text type="secondary">{item.note}</Text>
                                                  </div>
                                                )}
                                              </Space>
                                            </div>
                                          )}
                                        </Card>
                                      </List.Item>
                                    )}
                                  />
                                </div>
                              ),
                            });
                          }
                        }}
                      />
                    </Card>

                    <Title level={4}>Lịch học cố định trong tuần</Title>
                    {classes.length === 0 ? (
                      <Empty description="Chưa có lớp học nào" />
                    ) : (
                      <Row gutter={[16, 16]}>
                        {classes.map((cls) => (
                          <Col xs={24} md={12} key={cls.id}>
                            <Card
                              title={
                                <Space>
                                  <BookOutlined />
                                  {cls["Tên lớp"]}
                                </Space>
                              }
                              extra={
                                <Tag color={cls["Trạng thái"] === "active" ? "green" : "red"}>
                                  {cls["Trạng thái"] === "active" ? "Đang học" : "Đã kết thúc"}
                                </Tag>
                              }
                            >
                              <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Môn học">
                                  {cls["Môn học"]}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giáo viên">
                                  {cls["Giáo viên chủ nhiệm"]}
                                </Descriptions.Item>
                              </Descriptions>
                              <div style={{ marginTop: 12 }}>
                                <Text strong>Lịch học:</Text>
                                <List
                                  size="small"
                                  dataSource={cls["Lịch học"] || []}
                                  renderItem={(schedule: any) => (
                                    <List.Item>
                                      <Space style={{ width: "100%" }}>
                                        <Badge status="processing" />
                                        <Text strong>Thứ {schedule["Thứ"]}</Text>
                                        <Text>
                                          {schedule["Giờ bắt đầu"]} - {schedule["Giờ kết thúc"]}
                                        </Text>
                                        {schedule["Địa điểm"] && (
                                          <Tag icon={<HomeOutlined />}>{schedule["Địa điểm"]}</Tag>
                                        )}
                                      </Space>
                                    </List.Item>
                                  )}
                                />
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                ),
              },
              {
                key: "classes",
                label: (
                  <span>
                    <BookOutlined /> Lớp học
                  </span>
                ),
                children: (
                  <div>
                    {classes.length === 0 ? (
                      <Empty description="Chưa có lớp học nào" />
                    ) : (
                      <Row gutter={[16, 16]}>
                        {classes.map((cls) => (
                          <Col xs={24} md={12} key={cls.id}>
                            <Card
                              title={cls["Tên lớp"]}
                              extra={
                                <Tag color={cls["Trạng thái"] === "active" ? "green" : "red"}>
                                  {cls["Trạng thái"] === "active" ? "Đang học" : "Đã kết thúc"}
                                </Tag>
                              }
                            >
                              <Descriptions column={1} size="small">
                                <Descriptions.Item label="Môn học">
                                  {cls["Môn học"]}
                                </Descriptions.Item>
                                <Descriptions.Item label="Khối">{cls["Khối"]}</Descriptions.Item>
                                <Descriptions.Item label="Giáo viên">
                                  {cls["Giáo viên chủ nhiệm"]}
                                </Descriptions.Item>
                                <Descriptions.Item label="Mã lớp">
                                  {cls["Mã lớp"]}
                                </Descriptions.Item>
                              </Descriptions>
                              <div style={{ marginTop: 12 }}>
                                <Text strong>Lịch học:</Text>
                                {cls["Lịch học"]?.map((schedule: any, idx: number) => (
                                  <div key={idx} style={{ marginLeft: 16, marginTop: 4 }}>
                                    <ClockCircleOutlined /> Thứ {schedule["Thứ"]}:{" "}
                                    {schedule["Giờ bắt đầu"]} - {schedule["Giờ kết thúc"]}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                ),
              },
              {
                key: "homework",
                label: (
                  <span>
                    <EditOutlined /> Bài tập về nhà
                  </span>
                ),
                children: (
                  <div>
                    <List
                      dataSource={recentSessions.filter((s) => s["Bài tập"])}
                      renderItem={(session) => {
                        const record = session["Điểm danh"]?.find(
                          (r: any) => r["Student ID"] === userProfile?.studentId
                        );
                        const homework = session["Bài tập"];
                        const completed = record?.["Bài tập hoàn thành"] || 0;
                        const total = homework?.["Tổng số bài"] || 0;
                        const percentage = total > 0 ? (completed / total) * 100 : 0;

                        return (
                          <List.Item>
                            <Card style={{ width: "100%" }}>
                              <Row gutter={16}>
                                <Col span={16}>
                                  <Space direction="vertical" style={{ width: "100%" }}>
                                    <div>
                                      <Tag color="blue">{session["Tên lớp"]}</Tag>
                                      <Text type="secondary">
                                        {dayjs(session["Ngày"]).format("DD/MM/YYYY")}
                                      </Text>
                                    </div>
                                    <Paragraph>
                                      <strong>Mô tả:</strong> {homework["Mô tả"]}
                                    </Paragraph>
                                    <div>
                                      <Text type="secondary">
                                        Giao bởi: {homework["Người giao"]} -{" "}
                                        {dayjs(homework["Thời gian giao"]).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </Text>
                                    </div>
                                  </Space>
                                </Col>
                                <Col span={8}>
                                  <Space direction="vertical" style={{ width: "100%" }}>
                                    <Statistic
                                      title="Hoàn thành"
                                      value={completed}
                                      suffix={`/ ${total}`}
                                    />
                                    <Progress
                                      percent={percentage}
                                      status={percentage === 100 ? "success" : "active"}
                                    />
                                  </Space>
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        );
                      }}
                      locale={{ emptyText: "Chưa có bài tập nào" }}
                    />
                  </div>
                ),
              },
              {
                key: "attendance",
                label: (
                  <span>
                    <CheckCircleOutlined /> Điểm danh
                  </span>
                ),
                children: (
                  <Timeline
                    items={recentSessions.map((session) => {
                      const record = session["Điểm danh"]?.find(
                        (r: any) => r["Student ID"] === userProfile?.studentId
                      );

                      return {
                        color: record?.["Có mặt"]
                          ? "green"
                          : record?.["Vắng có phép"]
                            ? "orange"
                            : "red",
                        children: (
                          <div>
                            <div>
                              <strong>{dayjs(session["Ngày"]).format("DD/MM/YYYY")}</strong> -{" "}
                              {session["Tên lớp"]}
                            </div>
                            <div>
                              {session["Giờ bắt đầu"]} - {session["Giờ kết thúc"]}
                            </div>
                            <div>
                              {record?.["Có mặt"] ? (
                                <Tag color="success">Có mặt</Tag>
                              ) : record?.["Vắng có phép"] ? (
                                <Tag color="warning">Vắng có phép</Tag>
                              ) : (
                                <Tag color="error">Vắng</Tag>
                              )}
                              {record?.["Đi muộn"] && <Tag color="orange">Đi muộn</Tag>}
                            </div>
                            {record?.["Ghi chú"] && (
                              <div style={{ marginTop: 4, color: "#666" }}>
                                Ghi chú: {record["Ghi chú"]}
                              </div>
                            )}
                          </div>
                        ),
                      };
                    })}
                  />
                ),
              },
              {
                key: "scores",
                label: (
                  <span>
                    <TrophyOutlined /> Điểm kiểm tra
                  </span>
                ),
                children: (
                  <div>
                    <Table
                      dataSource={recentSessions
                        .map((session) => {
                          const record = session["Điểm danh"]?.find(
                            (r: any) => r["Student ID"] === userProfile?.studentId
                          );
                          if (
                            !record ||
                            record["Điểm"] === null ||
                            record["Điểm"] === undefined
                          )
                            return null;
                          return {
                            ...session,
                            score: record["Điểm"],
                            note: record["Ghi chú"],
                          };
                        })
                        .filter(Boolean)}
                      columns={[
                        {
                          title: "Ngày",
                          dataIndex: "Ngày",
                          key: "date",
                          render: (date) => dayjs(date).format("DD/MM/YYYY"),
                        },
                        {
                          title: "Lớp học",
                          dataIndex: "Tên lớp",
                          key: "class",
                        },
                        {
                          title: "Điểm",
                          dataIndex: "score",
                          key: "score",
                          align: "center",
                          render: (score) => (
                            <Tag
                              color={
                                score >= 8 ? "green" : score >= 6.5 ? "blue" : score >= 5 ? "orange" : "red"
                              }
                              style={{ fontSize: 16, padding: "4px 12px" }}
                            >
                              {score}
                            </Tag>
                          ),
                        },
                        {
                          title: "Ghi chú",
                          dataIndex: "note",
                          key: "note",
                          render: (note) => note || "-",
                        },
                      ]}
                      pagination={{ pageSize: 10 }}
                      locale={{ emptyText: "Chưa có điểm kiểm tra nào" }}
                    />
                  </div>
                ),
              },
              {
                key: "report",
                label: (
                  <span>
                    <BarChartOutlined /> Báo cáo & Đánh giá
                  </span>
                ),
                children: (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Card title="Tổng quan học tập">
                          <Row gutter={16}>
                            <Col xs={24} md={8}>
                              <Card>
                                <Statistic
                                  title="Tổng số buổi học"
                                  value={stats.totalSessions}
                                  suffix="buổi"
                                />
                              </Card>
                            </Col>
                            <Col xs={24} md={8}>
                              <Card>
                                <Statistic
                                  title="Số buổi có mặt"
                                  value={stats.attendedSessions}
                                  suffix="buổi"
                                  valueStyle={{ color: "#3f8600" }}
                                />
                              </Card>
                            </Col>
                            <Col xs={24} md={8}>
                              <Card>
                                <Statistic
                                  title="Số buổi vắng"
                                  value={stats.absentSessions}
                                  suffix="buổi"
                                  valueStyle={{ color: "#cf1322" }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Card>
                      </Col>

                      <Col span={24}>
                        <Card title="Kết quả học tập">
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 16 }}>
                                <Text strong>Tỷ lệ tham gia:</Text>
                                <Progress
                                  percent={stats.attendanceRate}
                                  status={stats.attendanceRate >= 80 ? "success" : "exception"}
                                  format={(percent) => `${percent?.toFixed(1)}%`}
                                />
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <Statistic
                                title="Điểm trung bình"
                                value={stats.averageScore}
                                precision={1}
                                suffix={`/ 10 (${stats.scoredSessions} bài)`}
                                valueStyle={{
                                  color:
                                    stats.averageScore >= 8
                                      ? "#3f8600"
                                      : stats.averageScore >= 6.5
                                        ? "#1890ff"
                                        : "#cf1322",
                                }}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </Col>

                      <Col span={24}>
                        <Card title="Nhận xét chung">
                          <Paragraph>
                            {stats.attendanceRate >= 90 && stats.averageScore >= 8 ? (
                              <Text type="success">
                                ✅ Học sinh có thái độ học tập rất tốt, chuyên cần và đạt kết quả
                                cao. Tiếp tục phát huy!
                              </Text>
                            ) : stats.attendanceRate >= 80 && stats.averageScore >= 6.5 ? (
                              <Text style={{ color: "#1890ff" }}>
                                📘 Học sinh có thái độ học tập tốt. Cần cố gắng thêm để đạt kết
                                quả cao hơn.
                              </Text>
                            ) : stats.attendanceRate < 80 ? (
                              <Text type="warning">
                                ⚠️ Tỷ lệ tham gia chưa đạt yêu cầu. Phụ huynh cần quan tâm hơn
                                đến việc đưa con đến lớp đầy đủ.
                              </Text>
                            ) : (
                              <Text type="danger">
                                ❌ Kết quả học tập chưa đạt. Cần trao đổi với giáo viên để tìm
                                phương pháp học tập phù hợp hơn.
                              </Text>
                            )}
                          </Paragraph>
                          <Paragraph>
                            <Text strong>Số buổi đi muộn:</Text> {stats.lateSessions} buổi
                          </Paragraph>
                          {stats.lateSessions > 3 && (
                            <Paragraph>
                              <Text type="warning">
                                Lưu ý: Học sinh đi muộn nhiều lần. Phụ huynh cần chú ý giúp con
                                đến lớp đúng giờ.
                              </Text>
                            </Paragraph>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: "invoices",
                label: (
                  <span>
                    <DollarOutlined /> Học phí
                  </span>
                ),
                children: (
                  <div>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="Tổng học phí"
                            value={invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)}
                            suffix="đ"
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="Đã thanh toán"
                            value={invoices
                              .filter((inv) => inv.status === "paid")
                              .reduce((sum, inv) => sum + (inv.finalAmount || 0), 0)}
                            suffix="đ"
                            valueStyle={{ color: "#3f8600" }}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card>
                          <Statistic
                            title="Chưa thanh toán"
                            value={invoices
                              .filter((inv) => inv.status === "unpaid")
                              .reduce((sum, inv) => sum + (inv.finalAmount || 0), 0)}
                            suffix="đ"
                            valueStyle={{ color: "#cf1322" }}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          />
                        </Card>
                      </Col>
                    </Row>

                    <Table
                      dataSource={invoices}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      columns={[
                        {
                          title: "Tháng",
                          key: "month",
                          render: (_, record) => `Tháng ${record.month + 1}/${record.year}`,
                        },
                        {
                          title: "Số buổi",
                          dataIndex: "totalSessions",
                          align: "center",
                        },
                        {
                          title: "Học phí",
                          dataIndex: "totalAmount",
                          align: "right",
                          render: (val) => `${val?.toLocaleString("vi-VN")} đ`,
                        },
                        {
                          title: "Giảm giá",
                          dataIndex: "discount",
                          align: "right",
                          render: (val) =>
                            val > 0 ? (
                              <Text type="warning">-{val?.toLocaleString("vi-VN")} đ</Text>
                            ) : (
                              "-"
                            ),
                        },
                        {
                          title: "Phải thu",
                          dataIndex: "finalAmount",
                          align: "right",
                          render: (val) => (
                            <Text strong style={{ fontSize: 16 }}>
                              {val?.toLocaleString("vi-VN")} đ
                            </Text>
                          ),
                        },
                        {
                          title: "Trạng thái",
                          dataIndex: "status",
                          align: "center",
                          render: (status) =>
                            status === "paid" ? (
                              <Tag color="success" icon={<CheckCircleOutlined />}>
                                Đã thanh toán
                              </Tag>
                            ) : (
                              <Tag color="error" icon={<ClockCircleOutlined />}>
                                Chưa thanh toán
                              </Tag>
                            ),
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default ParentPortal;
