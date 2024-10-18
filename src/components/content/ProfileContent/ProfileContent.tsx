import { useState } from "react";
import {
  logout,
  sendEmail,
  updatePassword,
  verifyPassword,
} from "../../../api/auth/auth";
import { useNavigate } from "react-router-dom";

function ProfileContent() {
  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");

  // 인증번호 전송 버튼 클릭 핸들러
  function handleSendVerificationCodeButtonClick() {
    sendEmail(currentEmail)
      .then(() => {
        alert("인증번호가 전송되었습니다.");
        setIsEmailSent(true);
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert("이메일이 일치하지 않습니다.");
        }
      });
  }

  // 확인 버튼 클릭 핸들러
  function handleConfirmButtonClick() {
    verifyPassword(currentEmail, verificationCode)
      .then((response) => {
        if (response.status === 201) {
          alert("인증되었습니다.");
          setIsVerified(true);
        }
      })
      .catch((e) => {
        if (e.response.status === 403) {
          alert("인증번호가 일치하지 않습니다.");
        }
      });
  }

  // 저장 버튼 클릭 핸들러
  function handleSaveButtonClick() {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
    } else {
      updatePassword(currentEmail, newPassword)
        .then(() => {
          alert("비밀번호가 변경되었습니다.");
          logout()
            .then((response) => {
              if (response?.status === 201) {
                navigate("/login");
              }
            })
            .catch((e) => {
              console.error(e);
              alert("로그아웃에 실패했습니다.");
            });
        })
        .catch((e) => {
          if (e.response.status === 403) {
            alert("비밀번호 변경에 실패했습니다.");
          }
        });
    }
  }

  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex w-full flex-col">
        <h1 className="text-xl font-bold">비밀번호 재설정</h1>
        <div className="mt-5 flex w-fit flex-col gap-7 rounded-md bg-white p-5 shadow-md">
          <div className="flex w-fit items-center">
            <span className="w-32 text-lg font-semibold">현재 이메일</span>
            <div className="flex h-8 w-80 rounded-sm border border-solid border-black bg-white px-3">
              <input
                type="email"
                className="h-full w-full text-sm"
                placeholder="이메일을 입력하세요."
                onChange={(e) => setCurrentEmail(e.target.value)}
              />
            </div>
          </div>
          {isEmailSent && (
            <div className="flex w-fit items-center">
              <span className="w-32 text-lg font-semibold">인증번호</span>
              <div className="relative flex h-8 w-80 overflow-hidden rounded-sm border border-solid border-black bg-white px-3 disabled:bg-gray-400">
                <input
                  type="text"
                  className="h-full w-full text-sm"
                  placeholder="인증번호를 입력하세요."
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isVerified}
                />
                <button
                  className="absolute right-0 h-full bg-primaryButton px-4 text-sm font-semibold text-white transition duration-300 hover:bg-primaryButtonHover disabled:bg-slate-400"
                  onClick={handleConfirmButtonClick}
                  disabled={isVerified}
                >
                  확인
                </button>
              </div>
            </div>
          )}
          {!isVerified && (
            <div className="flex w-full justify-end">
              <button
                className="bg-primary h-9 rounded-md bg-primaryButton px-5 font-bold text-white transition duration-300 hover:bg-primaryButtonHover"
                onClick={handleSendVerificationCodeButtonClick}
              >
                {isEmailSent ? "인증번호 재전송" : "인증번호 전송"}
              </button>
            </div>
          )}
          {isVerified && (
            <>
              <div className="flex w-fit items-center">
                <span className="w-32 text-lg font-semibold">
                  변경할 비밀번호
                </span>
                <div className="flex h-8 w-80 rounded-sm border border-solid border-black bg-white px-3">
                  <input
                    type="password"
                    className="h-full w-full text-sm"
                    placeholder="비밀번호를 입력하세요."
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-fit items-center">
                <span className="w-32 text-lg font-semibold">
                  비밀번호 확인
                </span>
                <div className="flex h-8 w-80 rounded-sm border border-solid border-black bg-white px-3">
                  <input
                    type="password"
                    className="h-full w-full text-sm"
                    placeholder="비밀번호를 입력하세요."
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full justify-end">
                <button
                  className="bg-primary h-9 w-24 rounded-md bg-primaryButton font-bold text-white transition duration-300 hover:bg-primaryButtonHover"
                  onClick={handleSaveButtonClick}
                >
                  저장
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
