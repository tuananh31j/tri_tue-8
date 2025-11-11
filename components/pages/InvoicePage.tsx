import Receipts from "@/components/pages/Receipts";
import WrapperContent from "@/components/WrapperContent";
import React from "react";

const InvoicePage = () => {
  return (
    <>
      <WrapperContent title="Hóa đơn & Biên nhận">
        <section className="container">
          <div id="receipts-root" className="mt-6">
            <Receipts />
          </div>
        </section>
      </WrapperContent>
    </>
  );
};

export default InvoicePage;
