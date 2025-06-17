import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Store the current location before checking login status
      localStorage.setItem("lastLocation", location.pathname);
      try {
        const res = await fetch("http://localhost:3000/api/auth/check", {
          method: "GET",
          credentials: "include", // Sends cookie
        });

        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user);
          console.log(data.user);
          // Redirect to the last location if available
          const lastLocation = localStorage.getItem("lastLocation");
          if (lastLocation) {
            navigate(lastLocation, { replace: true });
          }
        }
      } catch (error) {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
      }
    },
  });

  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      isLoading,
    }),
    [isLoggedIn, setIsLoggedIn, user, setUser, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);
