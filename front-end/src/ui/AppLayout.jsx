import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "./Sidebar";
function AppLayout() {
  const { isLoggedIn, user } = useAuth();
  if (isLoggedIn) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={user} />
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 to-black">
          <Outlet />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-footer-800 grid min-h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
