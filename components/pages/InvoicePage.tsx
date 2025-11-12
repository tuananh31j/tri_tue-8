import Receipts from "@/components/Receipts";
import WrapperContent from "@/components/WrapperContent";
import { message } from "antd";
import React from "react";

const InvoicePage = () => {
  return (
    <>
      <WrapperContent title="Hóa đơn & Biên nhận">
        <Receipts />
      </WrapperContent>
    </>
  );
};

export default InvoicePage;
