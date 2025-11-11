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
      "Hệ bị hành vận củi vớ cháp dơn tiện kếck Nhai hoc Hệ two tức tủng a no-soad thợ tình ogh",
  },
  {
    name: "Lê Đặng Bảo Khanh",
    image: "Lê Đặng Bảo Khanh (1).png",
    content:
      "Eing đệt kinh xờ Davể Hanh Có Nhay irzą vethet Hường a nện cực cồng độ cm danh hrểu da ca",
  },
  {
    name: "Nguyễn Duy Nam",
    image: "Nguyễn Duy Nam (4).png",
    content:
      "Chương trình học rất bổ ích và phù hợp với trẻ em. Con tôi rất thích học tại đây",
  },
  {
    name: "Nguyễn Sĩ Hoàng",
    image: "Nguyễn Sĩ Hoàng.png",
    content:
      "Giáo viên nhiệt tình, tận tâm với học sinh. Phương pháp giảng dạy hiệu quả",
  },
  {
    name: "Nguyễn Thị Hòa",
    image: "Nguyễn Thị Hòa (1).png",
    content:
      "Môi trường học tập thân thiện và chuyên nghiệp. Rất đáng để đầu tư cho con",
  },
  {
    name: "Nguyễn Trúc Linh",
    image: "Nguyễn Trúc Linh (1).png",
    content: "Học sinh được chăm sóc tận tình, tiến bộ rõ rệt sau mỗi khóa học",
  },
  {
    name: "Nguyễn Trần Hương Ly",
    image: "Nguyễn Trần Hương Ly.png",
    content:
      "Chất lượng giảng dạy tuyệt vời, con em học rất hiệu quả và vui vẻ",
  },
  {
    name: "Trần Hải Yến",
    image: "Trần Hải Yến.png",
    content:
      "Đội ngũ giáo viên giàu kinh nghiệm, tâm huyết với nghề. Rất hài lòng",
  },
  {
    name: "Lê Quang Đại",
    image: "Lê Quang Đại.png",
    content:
      "Hệ bị hành vận củi vớ cháp dơn tiện kếck Nhai hoc Hệ two tức tủng a no-soad thợ tình ogh",
  },
  {
    name: "Lê Đặng Bảo Khanh",
    image: "Lê Đặng Bảo Khanh (1).png",
    content:
      "Eing đệt kinh xờ Davể Hanh Có Nhay irzą vethet Hường a nện cực cồng độ cm danh hrểu da ca",
  },
  {
    name: "Nguyễn Duy Nam",
    image: "Nguyễn Duy Nam (4).png",
    content:
      "Chương trình học rất bổ ích và phù hợp với trẻ em. Con tôi rất thích học tại đây",
  },
  {
    name: "Nguyễn Sĩ Hoàng",
    image: "Nguyễn Sĩ Hoàng.png",
    content:
      "Giáo viên nhiệt tình, tận tâm với học sinh. Phương pháp giảng dạy hiệu quả",
  },
  {
    name: "Nguyễn Thị Hòa",
    image: "Nguyễn Thị Hòa (1).png",
    content:
      "Môi trường học tập thân thiện và chuyên nghiệp. Rất đáng để đầu tư cho con",
  },
  {
    name: "Nguyễn Trúc Linh",
    image: "Nguyễn Trúc Linh (1).png",
    content: "Học sinh được chăm sóc tận tình, tiến bộ rõ rệt sau mỗi khóa học",
  },
  {
    name: "Nguyễn Trần Hương Ly",
    image: "Nguyễn Trần Hương Ly.png",
    content:
      "Chất lượng giảng dạy tuyệt vời, con em học rất hiệu quả và vui vẻ",
  },
  {
    name: "Trần Hải Yến",
    image: "Trần Hải Yến.png",
    content:
      "Đội ngũ giáo viên giàu kinh nghiệm, tâm huyết với nghề. Rất hài lòng",
  },
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
    <div className="bg-gradient-to-b from-blue-50 to-white">
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
                            animation: scroll-horizontal 40s linear infinite;
                            width: fit-content;
                        }
                        .testimonial-track:hover {
                            animation-play-state: paused;
                        }
                        .testimonial-wrapper {
                            overflow: hidden;
                            position: relative;
                        }
                    `}</style>
          <div className="testimonial-wrapper">
            <div className="testimonial-track">
              {/* First set */}
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`first-${index}`} {...testimonial} />
              ))}

              {/* Duplicate set for seamless loop */}
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`second-${index}`} {...testimonial} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
