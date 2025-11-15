import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Col, Row, Typography } from "antd";
import React from "react";
const { Title } = Typography;
interface Testimonial {
  name: string;
  image: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Lê Quang Đại",
    image: "Lê Quang Đại.png",
    content:
      "Tôi luôn cảm thấy tự hào khi thấy học sinh tiến bộ từng ngày. Các em rất chăm chỉ và chủ động trong học tập.",
  },
  {
    name: "Lê Đặng Bảo Khanh",
    image: "Lê Đặng Bảo Khanh (1).png",
    content:
      "Điều khiến tôi ấn tượng nhất là tinh thần ham học hỏi của các em. Mỗi buổi học đều là một hành trình khám phá mới.",
  },
  {
    name: "Nguyễn Duy Nam",
    image: "Nguyễn Duy Nam (4).png",
    content:
      "Các em tiếp thu nhanh và luôn nỗ lực hết mình. Tôi rất vui khi được đồng hành và chứng kiến sự tiến bộ rõ rệt của từng học sinh.",
  },
  {
    name: "Nguyễn Sĩ Hoàng",
    image: "Nguyễn Sĩ Hoàng.png",
    content:
      "Giảng dạy ở đây giúp tôi cảm nhận được niềm vui thật sự trong nghề. Học sinh năng động, lớp học luôn tràn đầy năng lượng.",
  },
  {
    name: "Nguyễn Thị Hòa",
    image: "Nguyễn Thị Hòa (1).png",
    content:
      "Tôi đánh giá cao tinh thần hợp tác và sự nỗ lực của học sinh. Mỗi buổi học đều là cơ hội để cùng nhau trưởng thành.",
  },
  {
    name: "Nguyễn Trúc Linh",
    image: "Nguyễn Trúc Linh (1).png",
    content:
      "Tôi rất hạnh phúc khi thấy học sinh của mình ngày càng tự tin hơn, đặc biệt là trong các hoạt động thảo luận và thực hành.",
  },
  {
    name: "Nguyễn Trần Hương Ly",
    image: "Nguyễn Trần Hương Ly.png",
    content:
      "Là giảng viên, tôi luôn cố gắng tạo môi trường học tập thoải mái để học sinh phát huy tối đa khả năng của mình.",
  },
  {
    name: "Trần Hải Yến",
    image: "Trần Hải Yến.png",
    content:
      "Niềm vui lớn nhất của tôi là được chứng kiến học sinh yêu thích môn học và đạt được những kết quả xứng đáng.",
  },
];

const teachers: Testimonial[] = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

interface Course {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonColor: string;
  gradientColors: string;
}

const courses: Course[] = [
  {
    title: "Toán Học",
    description: "Chương trình Chuẩn Chuẩn",
    icon: <span className="text-5xl">x = +/c</span>,
    buttonText: "Xem Khóa Học",
    buttonColor: "bg-green-500 hover:bg-green-600",
    gradientColors:
      "bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300",
  },
  {
    title: "Khoa Học",
    description: "Tư duy Khoa học thông qua thí nghiệm",
    icon: <span className="text-6xl">🏆</span>,
    buttonText: "Xem Khóa Học",
    buttonColor: "bg-green-500 hover:bg-green-600",
    gradientColors:
      "bg-gradient-to-br from-green-200 via-emerald-200 to-green-300",
  },
  {
    title: "Tiếng Anh",
    description: "Đội ngũ giáo viên bản ngữ Tăng cường kỹ năng giao tiếp",
    icon: (
      <div className="flex items-center justify-center gap-2 text-5xl">
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </div>
    ),
    buttonText: "Tư vấn miễn phí",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    gradientColors: "bg-gradient-to-br from-blue-200 via-cyan-200 to-blue-300",
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <div>
        <img
          src="/img/banner.png"
          alt="Hero Banner"
          className="mx-auto w-auto"
        />
      </div>

      {/* Chương trình Học */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Title level={2} className="mb-12 text-center">
            Chương trình Học
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {courses.map((course, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <CourseCard {...course} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <Title level={2} className="mb-12 text-center text-gray-800">
            Đội ngũ giảng viên
          </Title>
          <style>{`
                        @keyframes scroll-horizontal {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-50%);
                            }
                        }
                        .testimonial-track {
                            display: flex;
                            align-items: stretch; /* Đảm bảo tất cả cards có cùng height */
                            animation: scroll-horizontal 80s linear infinite;
                            width: fit-content;
                            height: 320px; /* Set height cố định cho track */
                        }
                        .testimonial-track:hover {
                            animation-play-state: paused;
                        }
                        .testimonial-wrapper {
                            overflow: hidden;
                            position: relative;
                            height: 320px; /* Match với track height */
                        }
                        .testimonial-track > * {
                            height: 100%; /* Đảm bảo mỗi card chiếm hết height của track */
                        }
                    `}</style>
          <div className="testimonial-wrapper">
            <div className="testimonial-track">
              {/* First set */}
              {teachers.map((testimonial, index) => (
                <TestimonialCard key={`first-${index}`} {...testimonial} />
              ))}

              {/* Duplicate set for seamless loop */}
              {/* {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`second-${index}`} {...testimonial} />
              ))} */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
