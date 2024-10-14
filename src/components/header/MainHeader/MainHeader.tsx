import { Link } from "react-router-dom";

function MainHeader() {
  return (
    <div className="flex h-16 w-full items-center justify-end px-5 py-3">
      <Link
        to="/login"
        className="bg-signOutButton hover:bg-signOutButtonHover flex items-center justify-center rounded-md px-5 py-2 transition duration-300"
      >
        <span className="text-sm font-bold text-white">로그아웃</span>
      </Link>
    </div>
  );
}

export default MainHeader;
