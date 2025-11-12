import { Button, Card, Typography } from "antd";
import { Image } from "antd/lib";

const { Text, Paragraph } = Typography;

interface TestimonialCardProps {
  name: string;
  image: string;
  content: string;
}

const TestimonialCard = ({ name, image, content }: TestimonialCardProps) => {
  return (
    <div
      className="px-3 h-full"
      style={{ minWidth: "500px", maxWidth: "500px" }}
    >
      <Card
        className="h-full flex flex-col rounded-2xl bg-white shadow-lg"
        bodyStyle={{ padding: 0, height: "100%" }}
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <div className="flex-1 flex flex-col min-h-0">
            <div
              className="mb-4 text-6xl text-gray-300 h-12 flex items-start"
              aria-hidden
            >
              &ldquo;
            </div>
            <div className="flex-1 min-h-0">
              <Paragraph className="m-0 text-base leading-relaxed text-gray-700 h-full overflow-auto">
                {content}
              </Paragraph>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Image
                height={100}
                src={`/teacher/${image}`}
                alt={name}
                preview={{
                  toolbarRender: () => null,
                }}
              />
              <div>
                <Text strong className="block text-gray-800">
                  {name}
                </Text>
              </div>
            </div>

            <Button
              type="primary"
              className="rounded-full bg-teal-300 px-6 py-3 text-white"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestimonialCard;
