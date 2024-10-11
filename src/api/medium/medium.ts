import api from "../baseUrl/baseUrl";

export interface CompanyCreatedAt {
  id: number;
  name: string;
  createdAt: string;
}

export interface CompanyUpdatedAt {
  id: number;
  name: string;
  updatedAt: string;
}

export interface FetchCompanyAllResponse {
  items: CompanyCreatedAt[];
}

// 매체명 등록 API
export const createCompanyOne = async (name: string) => {
  try {
    const response = await api.post<CompanyCreatedAt>("/medium", {
      name: name,
    });
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 매체명 조회 API
export const fetchCompanyAll = async () => {
  try {
    const response = await api.get<FetchCompanyAllResponse>("/medium");
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 매체명 수정 API
export const updateCompanyOne = async (id: number, name: string) => {
  try {
    const response = await api.patch<CompanyUpdatedAt>(`/medium/${id}`, {
      name: name,
    });
    console.log("수정", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 매체명 삭제 API
export const deleteCompanyOne = async (id: number) => {
  try {
    const response = await api.delete(`/medium/${id}`);
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};
