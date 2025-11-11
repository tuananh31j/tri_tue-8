import { GlobalOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

const Footer = () => {
    return (
        <footer className='bg-gray-100 py-12'>
            <div className='container mx-auto px-6'>
                <Title level={3} className='mb-8 text-center'>
                    Đăn ký nhận
                </Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Title level={5}>Thông tin Liên Hệt</Title>
                        <Text>Sotdi divdo</Text>
                    </Col>
                    <Col xs={24} md={6}>
                        <Title level={5}>Liên kiết Nhanh</Title>
                        <Text>Dinh blogh</Text>
                    </Col>
                    <Col xs={24} md={6}>
                        <Title level={5}>Liên kiết Nhanh</Title>
                        <Text>Dinh blogh</Text>
                    </Col>
                    <Col xs={24} md={6}>
                        <Title level={5}>Mạng xã nhội</Title>
                        <div className='flex gap-2'>
                            <Button shape='circle' icon={<GlobalOutlined />} />
                            <Button shape='circle' icon={<StarOutlined />} />
                        </div>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
