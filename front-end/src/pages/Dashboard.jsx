import StudentDashboard from "../features/user/StudentDashboard";
import { useAuth } from "../context/AuthProvider";
import Loader from "../ui/Loader";
import ContentManagerDashboard from "../features/user/ContentManagerDashboard";
import AdminDashboard from "../features/user/AdminDashboard";
import AcademyDashboard from "../features/user/AcademyDashboard";
function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }
  if (user.role === "student") {
    return <StudentDashboard />;
  }
  if (user.role === "admin") {
    return <AdminDashboard />;
  }
  if (user.role === "content manager") {
    return <ContentManagerDashboard />;
  }
  if (user.role === "academy") {
    return <AcademyDashboard />;
  }
}

export default Dashboard;
