import { AxiosError } from "axios";
import api from "../baseUrl/baseUrl";

export interface LoginResponse {
  id: number;
  message: string;
}

// 로그인 API
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>(
      "/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    const response = await api.post(
      "/user/logout",
      {},
      { withCredentials: true },
    );

    return response;
  } catch (e) {
    alert("로그아웃에 실패했습니다.");
  }
};

// 로그인 상태 확인 API
export const checkLogin = async () => {
  try {
    const response = await api.get("/user/status", {
      withCredentials: true,
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 이메일 발송 API
export const sendEmail = async (email: string) => {
  try {
    const response = await api.post(
      "/user/send",
      {
        email,
      },
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 이메일 검증 API
export const verifyPassword = async (email: string, code: string) => {
  try {
    const response = await api.post(
      "/user/verify",
      {
        email,
        code,
      },
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 비밀번호 재설정 API
export const updatePassword = async (email: string, newPassword: string) => {
  try {
    const response = await api.patch(
      "/user/reset-password",
      {
        email,
        newPassword,
      },
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
