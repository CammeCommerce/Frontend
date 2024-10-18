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

    console.log(response.data);

    return response;
  } catch (e) {
    console.error(e);
    alert("로그인에 실패했습니다.");
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    const response = await api.post("/user/logout", {
      withCredentials: true,
    });

    console.log(response.data);

    return response;
  } catch (e) {
    console.error(e);
    alert("로그아웃에 실패했습니다.");
  }
};

// 로그인 상태 확인 API
export const checkLogin = async () => {
  try {
    const response = await api.get("/user/status", {
      withCredentials: true,
    });

    console.log(response.data);

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
