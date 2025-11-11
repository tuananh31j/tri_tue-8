import { Button, Card, Typography } from 'antd';

const { Text, Paragraph } = Typography;

interface TestimonialCardProps {
    name: string;
    image: string;
    content: string;
}

// Make the card a column flex layout and ensure consistent min-height so all cards are equal.
const TestimonialCard = ({ name, image, content }: TestimonialCardProps) => {
    return (
        <div className='px-3' style={{ minWidth: '500px', maxWidth: '500px' }}>
            <Card className='h-full min-h-[200px] rounded-2xl bg-white shadow-lg'>
                <div className='flex h-full flex-col p-6'>
                    <div className='flex-1'>
                        <div className='mb-4 text-6xl text-gray-300' aria-hidden>
                            &ldquo;
                        </div>
                        <Paragraph className='text-base leading-relaxed text-gray-700'>{content}</Paragraph>
                    </div>

                    <div className='mt-6 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <img src={`/teacher/${image}`} alt={name} className='h-16 w-16 rounded-full object-cover' />
                            <div>
                                <Text strong className='block text-gray-800'>
                                    {name}
                                </Text>
                            </div>
                        </div>

                        <Button type='primary' className='rounded-full bg-teal-300 px-6 py-3 text-white'>
                            Tìm hiểu thêm
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TestimonialCard;
