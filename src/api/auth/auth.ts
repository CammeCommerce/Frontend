import api from "../baseUrl/baseUrl";

export interface LoginResponse {
  id: number;
  message: string;
}

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
