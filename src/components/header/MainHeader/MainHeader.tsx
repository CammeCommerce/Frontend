import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../api/auth/auth";

function MainHeader() {
  const navigate = useNavigate();

  // 로그아웃 버튼 클릭 핸들러
  function handleLogoutButtonClick() {
    logout()
      .then((response) => {
        if (response?.status === 201) {
          navigate("/login");
        }
      })
      .catch(() => {
        alert("로그아웃에 실패했습니다.");
      });
  }

  return (
    <div className="flex h-16 w-full items-center justify-end px-5 py-3">
      <Link
        to="/login"
        className="flex items-center justify-center rounded-md bg-signOutButton px-5 py-2 transition duration-300 hover:bg-signOutButtonHover"
      >
        <span
          className="text-sm font-bold text-white"
          onClick={handleLogoutButtonClick}
        >
          로그아웃
        </span>
      </Link>
    </div>
  );
}

export default MainHeader;
