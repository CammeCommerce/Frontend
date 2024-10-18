import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkLogin, login } from "../../api/auth/auth";

function Login() {
  const navigation = useNavigate();
  const [idInput, setIdInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // 로그인 버튼 핸들러
  function handleLoginButtonClick() {
    login(idInput, passwordInput)
      .then((response) => {
        if (response?.status === 201) {
          navigation("/");
        }
      })
      .catch((e) => {
        console.error(e);
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      });
  }

  // useEffect(() => {
  //   // 로그인 상태일 경우 메인 페이지로 이동
  //   checkLogin().then((response) => {
  //     if (response?.status === 200 && response.data.isLoggedIn === true) {
  //       navigation("/");
  //     } else {
  //       return;
  //     }
  //   });
  // }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">캄므커머스 손익사이트</h1>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex h-10 w-96 rounded-md border border-solid border-black bg-white px-3">
            <input
              type="text"
              placeholder="이메일을 입력해주세요."
              className="h-full w-full"
              onChange={(e) => setIdInput(e.target.value)}
            />
          </div>
          <div className="flex h-10 w-96 rounded-md border border-solid border-black bg-white px-3">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="h-full w-full"
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-96 items-center justify-center rounded-md bg-gray-400"
            onClick={handleLoginButtonClick}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
