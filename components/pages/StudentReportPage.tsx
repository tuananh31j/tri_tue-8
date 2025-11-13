import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Table, Tag, Divider, Row, Col, Statistic, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import { useAttendanceStats } from '../../hooks/useAttendanceStats';
import { AttendanceSession } from '../../types';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

interface Student {
    id: string;
    'Họ và tên': string;
    'Mã học sinh'?: string;
    'Ngày sinh'?: string;
    'Số điện thoại'?: string;
    'Email'?: string;
    'Địa chỉ'?: string;
    [key: string]: any;
}

const StudentReportPage = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);
    
    const [student, setStudent] = useState<Student | null>(null);
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { getStudentStats } = useAttendanceStats();

    // Load student data
    useEffect(() => {
        if (!studentId) return;

        const studentRef = ref(database, `datasheet/Danh_sách_học_sinh/${studentId}`);
        const unsubscribe = onValue(studentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStudent({ id: studentId, ...data });
            }
        });

        return () => unsubscribe();
    }, [studentId]);

    // Load sessions
    useEffect(() => {
        const sessionsRef = ref(database, 'datasheet/Điểm_danh_sessions');
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessionsList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...(value as Omit<AttendanceSession, 'id'>)
                }));
                setSessions(sessionsList);
            } else {
                setSessions([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading || !student) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    const stats = getStudentStats(student.id);

    // Filter sessions for this student
    const studentSessions = sessions.filter(session =>
        session['Điểm danh']?.some(record => record['Student ID'] === student.id)
    ).sort((a, b) => new Date(b['Ngày']).getTime() - new Date(a['Ngày']).getTime());

    // Calculate attendance rate
    const attendanceRate = stats.totalSessions > 0 
        ? Math.round((stats.presentSessions / stats.totalSessions) * 100) 
        : 0;

    // Get status tag
    const getStatusTag = (record: any) => {
        if (record['Có mặt']) {
            if (record['Đi muộn']) {
                return <Tag color="orange">Đi muộn</Tag>;
            }
            return <Tag color="green">Có mặt</Tag>;
        } else {
            if (record['Vắng có phép']) {
                return <Tag color="blue">Vắng có phép</Tag>;
            }
            return <Tag color="red">Vắng không phép</Tag>;
        }
    };

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'Ngày',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            width: 100
        },
        {
            title: 'Lớp học',
            dataIndex: 'Tên lớp',
            key: 'class',
            width: 150
        },
        {
            title: 'Giờ học',
            key: 'time',
            render: (_: any, record: AttendanceSession) => 
                `${record['Giờ bắt đầu']} - ${record['Giờ kết thúc']}`,
            width: 100
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: AttendanceSession) => {
                const studentRecord = record['Điểm danh']?.find(r => r['Student ID'] === student.id);
                return studentRecord ? getStatusTag(studentRecord) : '-';
            },
            width: 120
        },
        {
            title: 'Điểm',
            key: 'score',
            render: (_: any, record: AttendanceSession) => {
                const studentRecord = record['Điểm danh']?.find(r => r['Student ID'] === student.id);
                return studentRecord?.['Điểm'] ?? '-';
            },
            width: 80
        },
        {
            title: 'Bài tập',
            key: 'homework',
            render: (_: any, record: AttendanceSession) => {
                const studentRecord = record['Điểm danh']?.find(r => r['Student ID'] === student.id);
                const completed = studentRecord?.['Bài tập hoàn thành'];
                const total = record['Bài tập']?.['Tổng số bài'];
                if (completed !== undefined && total) {
                    return `${completed}/${total}`;
                }
                return '-';
            },
            width: 100
        },
        {
            title: 'Ghi chú',
            key: 'note',
            render: (_: any, record: AttendanceSession) => {
                const studentRecord = record['Điểm danh']?.find(r => r['Student ID'] === student.id);
                return studentRecord?.['Ghi chú'] || '-';
            }
        }
    ];

    const handlePrint = () => {
        window.print();
    };

    if (studentSessions.length === 0) {
        return (
            <div style={{ padding: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                    Quay lại
                </Button>
                <Empty description="Học sinh chưa có lịch sử học tập" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Action Buttons */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                    In báo cáo
                </Button>
            </div>

            {/* Print Content */}
            <div ref={printRef} className="print-content">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #1890ff', paddingBottom: 16 }}>
                    <h1 style={{ color: '#1890ff', margin: 0 }}>BÁO CÁO HỌC TẬP</h1>
                    <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                        Ngày xuất: {dayjs().format('DD/MM/YYYY HH:mm')}
                    </p>
                </div>

                {/* Student Info */}
                <Card title="Thông tin học sinh" size="small" style={{ marginBottom: 16 }}>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="Họ và tên">
                            <strong>{student['Họ và tên']}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã học sinh">
                            {student['Mã học sinh'] || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {student['Ngày sinh'] ? dayjs(student['Ngày sinh']).format('DD/MM/YYYY') : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {student['Số điện thoại'] || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email" span={2}>
                            {student['Email'] || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {student['Địa chỉ'] || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Statistics */}
                <Card title="Thống kê chuyên cần" size="small" style={{ marginBottom: 16 }}>
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
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Số buổi vắng"
                                value={stats.absentSessions}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<CloseCircleOutlined />}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Tỷ lệ tham gia"
                                value={attendanceRate}
                                suffix="%"
                                valueStyle={{ color: attendanceRate >= 80 ? '#3f8600' : '#cf1322' }}
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
                                        .map(s => s['Điểm danh']?.find(r => r['Student ID'] === student.id)?.['Điểm'])
                                        .filter(score => score !== undefined && score !== null) as number[];
                                    if (scores.length === 0) return 0;
                                    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
                                })()}
                                suffix="/ 10"
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Session History */}
                <Card title="Lịch sử học tập" size="small">
                    <Table
                        columns={columns}
                        dataSource={studentSessions}
                        rowKey="id"
                        pagination={{ pageSize: 20 }}
                        size="small"
                    />
                </Card>

                {/* Footer */}
                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#999' }}>
                    <Divider />
                    <p>Báo cáo này được tạo tự động từ hệ thống quản lý học sinh</p>
                    <p>Mọi thắc mắc xin liên hệ với giáo viên hoặc ban quản lý</p>
                </div>
            </div>
        </div>
    );
};

export default StudentReportPage;
