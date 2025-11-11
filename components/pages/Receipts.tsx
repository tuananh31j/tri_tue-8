import React, { useState, useRef } from "react";
// Import statically so Vite pre-bundles this dependency and dynamic-import fetch failures
// ("Outdated Optimize Dep" / 504) are avoided during development.
import domtoimage from "dom-to-image-more";

const COLORS = {
  default: "#36797f",
  dark: "#36797f",
  light: "#a2e1e6",
};

interface TuitionData {
  studentName: string;
  month: string;
  totalSessions: number;
  pricePerSession: string;
  totalAmount: string;
  note: string;
}

interface SalaryData {
  teacherName: string;
  month: string;
  subject: string;
  caTH: string;
  luongTH: string;
  caTHCS: string;
  luongTHCS: string;
  caTHPT: string;
  luongTHPT: string;
  tongLuong: string;
  note: string;
  // VietQR config
  bankId?: string;
  accountNo?: string;
  accountName?: string;
}

// Generate VietQR URL with hardcoded bank info
const generateVietQR = (
  amount: string,
  studentName: string,
  month: string
): string => {
  const bankId = "VPB"; // VPBank
  const accountNo = "4319888";
  const accountName = "NGUYEN THI HOA";
  const numericAmount = amount.replace(/[^0-9]/g, "");
  const description = `HP T${month} ${studentName}`;
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${numericAmount}&addInfo=${encodeURIComponent(
    description
  )}&accountName=${encodeURIComponent(accountName)}`;
};

// Helper function to export as image
const exportAsImage = async (element: HTMLElement, filename: string) => {
  try {
    console.log("Starting export...");

    // Use the statically imported domtoimage (pre-bundled by Vite).
    // If for some reason it's not available, attempt a dynamic import as a fallback.
    const impl =
      (domtoimage as any) || (await import("dom-to-image-more")).default;

    if (!impl || typeof impl.toBlob !== "function") {
      throw new Error("dom-to-image-more is not available in this environment");
    }

    // Convert to blob. Measure element and apply scale so the full area is captured
    const rect = element.getBoundingClientRect();
    const scale = 2; // increase for higher-resolution output
    const width = Math.round(rect.width * scale);
    const height = Math.round(rect.height * scale);

    const blob = await impl.toBlob(element, {
      bgcolor: "#ffffff",
      quality: 1,
      // supply scaled pixel dimensions to the library
      width,
      height,
      // keep the visual size the same while scaling the rendering
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${Math.round(rect.width)}px`,
        height: `${Math.round(rect.height)}px`,
      },
      // make the canvas used by dom-to-image-more high-DPI aware
      // (some versions support 'canvas' or 'canvasWidth' options; leaving defaults)
    });

    console.log("Image created successfully");

    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("Image downloaded successfully");
  } catch (error) {
    console.error("Error exporting image:", error);
    alert(
      `Lỗi khi xuất ảnh: ${
        error instanceof Error ? error.message : "Unknown error"
      }\n\nThử refresh lại trang, xóa cache dev server (node_modules/.vite) và khởi động lại dev server!`
    );
  }
};

export const TuitionReceipt: React.FC<{
  data: TuitionData;
  onExport: () => void;
}> = ({ data, onExport }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (receiptRef.current) {
      try {
        setIsExporting(true);
        await exportAsImage(
          receiptRef.current,
          `Hoc_Phi_${data.studentName.replace(/\s+/g, "_")}_Thang_${
            data.month
          }.png`
        );
        onExport();
      } catch (error) {
        console.error("Export failed:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2 bg-[#36797f] text-white rounded-lg font-semibold hover:bg-[#36797f] transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xuất...
            </>
          ) : (
            <>📸 Xuất ảnh</>
          )}
        </button>
      </div>

      <div
        ref={receiptRef}
        className="bg-white rounded-lg shadow-md border relative overflow-hidden"
        style={{ borderColor: COLORS.dark, minWidth: "700px" }}
      >
        {/* Background Logo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/img/logo.png"
            alt="Background Logo"
            onError={(e) => console.error("Logo load failed:", e)}
            onLoad={() => console.log("Logo loaded successfully")}
            style={{
              width: "auto",
              height: "400px",
              maxWidth: "400px",
              objectFit: "contain",
              opacity: 1,
              filter: "grayscale(20%) brightness(1.1)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          className="p-8 relative"
          style={{ zIndex: 10, position: "relative" }}
        >
          <h2 className="text-center text-3xl font-bold text-[#36797f]">
            PHIẾU THU HỌC PHÍ THÁNG {data.month}
          </h2>
          <div
            className="mt-6 border rounded overflow-hidden"
            style={{ borderColor: COLORS.default, background: "transparent" }}
          >
            <div
              className="bg-[${COLORS.default}]"
              style={{ background: "transparent" }}
            />
            <div
              className="bg-[#f7fafc] p-4"
              style={{ background: "rgba(255, 255, 255, 0.85)" }}
            >
              <div className="bg-[" style={{ background: "transparent" }} />
              <div
                className="bg-yellow-300 p-2 text-center font-semibold text-lg"
                style={{ background: COLORS.default, color: "#fff" }}
              >
                <span>{data.studentName}</span>
              </div>

              <table className="w-full text-sm mt-4 table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className="border p-4 text-sm">Tháng</th>
                    <th className="border p-4 text-sm">Tổng số buổi học</th>
                    <th className="border p-4 text-sm">Học phí/buổi</th>
                    <th className="border p-4 text-sm">Học phí hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-4 text-center">{data.month}</td>
                    <td className="border p-4 text-center">
                      {data.totalSessions}
                    </td>
                    <td className="border p-4 text-center">
                      {data.pricePerSession}
                    </td>
                    <td className="border p-4 text-center">
                      {data.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 p-4 flex items-start gap-6">
                <div className="flex-1 text-sm text-gray-700 space-y-2">
                  <p>🌼{data.note}</p>
                  <p>🌼Em cảm ơn Quý phụ huynh ạ!</p>
                </div>
                <div className="w-48 h-48 bg-white border flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={generateVietQR(
                      data.totalAmount,
                      data.studentName,
                      data.month
                    )}
                    alt="VietQR Code"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SalarySlip: React.FC<{
  data: SalaryData;
  onExport: () => void;
}> = ({ data, onExport }) => {
  const salaryRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (salaryRef.current) {
      try {
        setIsExporting(true);
        await exportAsImage(
          salaryRef.current,
          `Phieu_Luong_${data.teacherName.replace(/\s+/g, "_")}_Thang_${
            data.month
          }.png`
        );
        onExport();
      } catch (error) {
        console.error("Export failed:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2 bg-[#36797f] text-white rounded-lg font-semibold hover:bg-[#36797f] transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xuất...
            </>
          ) : (
            <>📸 Xuất ảnh</>
          )}
        </button>
      </div>

      <div
        ref={salaryRef}
        className="bg-white rounded-lg shadow-md border relative overflow-hidden"
        style={{ borderColor: COLORS.dark }}
      >
        {/* Background Logo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/public/logo.jpg"
            alt="Background Logo"
            style={{
              width: "auto",
              height: "300px",
              maxWidth: "300px",
              objectFit: "contain",
              opacity: 0.15,
              filter: "grayscale(20%) brightness(1.1)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          className="p-6 relative"
          style={{ zIndex: 10, position: "relative" }}
        >
          <h2 className="text-center text-2xl font-bold text-[#36797f]">
            PHIẾU LƯƠNG THÁNG {data.month}
          </h2>
          <p className="text-center font-semibold text-lg mt-2">
            Họ và tên: {data.teacherName}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div
              className="col-span-1 p-2 bg-["
              style={{ background: COLORS.light }}
            >
              <div className="font-semibold">Khối</div>
            </div>
            <div className="col-span-1 p-2 border">Ca dạy</div>
            <div className="col-span-1 p-2 border">Lương</div>

            <div className="p-2 font-bold text-center">TH</div>
            <div className="p-2 text-center">{data.caTH}</div>
            <div className="p-2 text-center">{data.luongTH}</div>

            <div className="p-2 font-bold text-center">THCS</div>
            <div className="p-2 text-center">{data.caTHCS}</div>
            <div className="p-2 text-center">{data.luongTHCS}</div>

            <div className="p-2 font-bold text-center">THPT</div>
            <div className="p-2 text-center">{data.caTHPT}</div>
            <div className="p-2 text-center">{data.luongTHPT}</div>

            <div className="col-span-2 p-2 font-semibold">TỔNG LƯƠNG</div>
            <div className="p-2 font-bold text-center">{data.tongLuong}</div>
          </div>

          <div className="mt-4 text-sm text-gray-700">Ghi chú: {data.note}</div>
          <div className="mt-2 text-sm font-medium">
            Thầy Cô kiểm tra kỹ thông tin và tiền lương. Nếu có sai sót báo lại
            với Trung Tâm
          </div>
        </div>
      </div>
    </div>
  );
};

const Receipts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tuition" | "salary">("tuition");

  // Tuition form state
  const [tuitionData, setTuitionData] = useState<TuitionData>({
    studentName: "Con Phạm Hữu Minh",
    month: "10",
    totalSessions: 9,
    pricePerSession: "150,000",
    totalAmount: "1,350,000",
    note: "Phụ huynh vui lòng hoàn thành học phí cho con bằng cách quét mã QR.",
  });

  // Salary form state
  const [salaryData, setSalaryData] = useState<SalaryData>({
    teacherName: "Nguyễn Văn A",
    month: "10",
    subject: "Tiếng Anh",
    caTH: "10",
    luongTH: "500,000",
    caTHCS: "8",
    luongTHCS: "400,000",
    caTHPT: "6",
    luongTHPT: "300,000",
    tongLuong: "1,200,000",
    note: "Thầy Cô kiểm tra kỹ thông tin và tiền lương.",
  });

  // Calculate total amount for tuition
  const calculateTuitionTotal = () => {
    const sessions = Number(tuitionData.totalSessions) || 0;
    const price =
      Number(tuitionData.pricePerSession.replace(/[^0-9]/g, "")) || 0;
    const total = sessions * price;
    setTuitionData({
      ...tuitionData,
      totalAmount: total.toLocaleString("vi-VN"),
    });
  };

  // Calculate total salary
  const calculateSalaryTotal = () => {
    const th = Number(salaryData.luongTH.replace(/[^0-9]/g, "")) || 0;
    const thcs = Number(salaryData.luongTHCS.replace(/[^0-9]/g, "")) || 0;
    const thpt = Number(salaryData.luongTHPT.replace(/[^0-9]/g, "")) || 0;
    const total = th + thcs + thpt;
    setSalaryData({
      ...salaryData,
      tongLuong: total.toLocaleString("vi-VN"),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("tuition")}
          className={`flex-1 py-4 px-6 font-semibold text-lg transition ${
            activeTab === "tuition"
              ? "border-b-4 border-[#36797f] text-[#36797f] bg-blue-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          💰 Phiếu Thu Học Phí
        </button>
        <button
          onClick={() => setActiveTab("salary")}
          className={`flex-1 py-4 px-6 font-semibold text-lg transition ${
            activeTab === "salary"
              ? "border-b-4 border-[#36797f] text-[#36797f] bg-blue-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          💵 Phiếu Lương Giáo Viên
        </button>
      </div>

      <div className="p-6">
        {activeTab === "tuition" ? (
          <div className="space-y-8">
            {/* Form */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#36797f] mb-4">
                📝 Nhập thông tin học phí
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên học sinh
                  </label>
                  <input
                    type="text"
                    value={tuitionData.studentName}
                    onChange={(e) =>
                      setTuitionData({
                        ...tuitionData,
                        studentName: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                    placeholder="VD: Con Phạm Hữu Minh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tháng
                  </label>
                  <input
                    type="text"
                    value={tuitionData.month}
                    onChange={(e) =>
                      setTuitionData({
                        ...tuitionData,
                        month: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                    placeholder="VD: 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tổng số buổi học
                  </label>
                  <input
                    type="number"
                    value={tuitionData.totalSessions}
                    onChange={(e) =>
                      setTuitionData({
                        ...tuitionData,
                        totalSessions: Number(e.target.value),
                      })
                    }
                    onBlur={calculateTuitionTotal}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                    placeholder="VD: 9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Học phí/buổi (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={tuitionData.pricePerSession}
                    onChange={(e) =>
                      setTuitionData({
                        ...tuitionData,
                        pricePerSession: e.target.value,
                      })
                    }
                    onBlur={calculateTuitionTotal}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                    placeholder="VD: 150,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tổng học phí (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={tuitionData.totalAmount}
                    readOnly
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-bold text-[#36797f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={tuitionData.note}
                  onChange={(e) =>
                    setTuitionData({ ...tuitionData, note: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  placeholder="Ghi chú cho phụ huynh..."
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-xl font-bold text-[#36797f] mb-4">
                👁️ Xem trước phiếu thu
              </h3>
              <TuitionReceipt
                data={{
                  ...tuitionData,
                  pricePerSession: `${tuitionData.pricePerSession} Đ`,
                  totalAmount: `${tuitionData.totalAmount} Đ`,
                }}
                onExport={() => {
                  alert("✅ Đã xuất ảnh thành công!");
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#36797f] mb-4">
                📝 Nhập thông tin lương
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên giáo viên
                </label>
                <input
                  type="text"
                  value={salaryData.teacherName}
                  onChange={(e) =>
                    setSalaryData({
                      ...salaryData,
                      teacherName: e.target.value,
                    })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tháng
                </label>
                <input
                  type="text"
                  value={salaryData.month}
                  onChange={(e) =>
                    setSalaryData({
                      ...salaryData,
                      month: e.target.value,
                    })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  placeholder="VD: 10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ca TH
                  </label>
                  <input
                    type="text"
                    value={salaryData.caTH}
                    onChange={(e) =>
                      setSalaryData({ ...salaryData, caTH: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lương TH (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={salaryData.luongTH}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        luongTH: e.target.value,
                      })
                    }
                    onBlur={calculateSalaryTotal}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ca THCS
                  </label>
                  <input
                    type="text"
                    value={salaryData.caTHCS}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        caTHCS: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lương THCS (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={salaryData.luongTHCS}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        luongTHCS: e.target.value,
                      })
                    }
                    onBlur={calculateSalaryTotal}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ca THPT
                  </label>
                  <input
                    type="text"
                    value={salaryData.caTHPT}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        caTHPT: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lương THPT (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={salaryData.luongTHPT}
                    onChange={(e) =>
                      setSalaryData({
                        ...salaryData,
                        luongTHPT: e.target.value,
                      })
                    }
                    onBlur={calculateSalaryTotal}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tổng lương (VNĐ)
                </label>
                <input
                  type="text"
                  value={salaryData.tongLuong}
                  readOnly
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-bold text-[#36797f]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={salaryData.note}
                  onChange={(e) =>
                    setSalaryData({ ...salaryData, note: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36797f] focus:border-[#36797f]"
                  placeholder="Ghi chú cho giáo viên..."
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-xl font-bold text-[#36797f] mb-4">
                👁️ Xem trước phiếu lương
              </h3>
              <SalarySlip
                data={salaryData}
                onExport={() => {
                  alert("✅ Đã xuất ảnh thành công!");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receipts;
