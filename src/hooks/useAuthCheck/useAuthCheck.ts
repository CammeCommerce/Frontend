import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../api/auth/auth";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin().catch((e) => {
      if (e.status === 403) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    });
  }, [navigate]);
};

export default useAuthCheck;
