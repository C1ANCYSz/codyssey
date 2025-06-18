import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export function useVerifyEmail() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { mutate: verifyEmail, isLoading } = useMutation({
    mutationFn: async (code) => {
      const token = { verificationToken: code };
      console.log(token);
      const response = await fetch(
        `http://localhost:3000/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(token),
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify email");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Email verified successfully");
      setUser(data.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { verifyEmail, isLoading };
}
