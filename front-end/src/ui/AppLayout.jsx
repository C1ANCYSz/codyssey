import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "./Sidebar";
function AppLayout() {
  const { isLoggedIn, user } = useAuth();
  if (isLoggedIn) {
    return (
      <div className="font-body from-primary-900 flex h-screen overflow-hidden bg-gradient-to-br to-black">
        <Sidebar user={user} />
        <div className="from-primary-900 flex-1 overflow-y-auto bg-gradient-to-br to-black">
          <Outlet />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-footer-800 font-body grid min-h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
