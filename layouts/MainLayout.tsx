import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "@/routes/lazy";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col bg-white px-4 lg:px-0">
      {/* Header/Navigation */}
      <Header />
      <Suspense>
        <Outlet />
      </Suspense>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
