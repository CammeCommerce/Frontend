import api from "../baseUrl/baseUrl";

export interface SettlementCompanyCreatedAt {
  id: number;
  name: string;
  createdAt: string;
}

export interface SettlementCompanyUpdatedAt {
  id: number;
  name: string;
  updatedAt: string;
}

export interface fetchSettlementCompanyAllResponse {
  items: SettlementCompanyCreatedAt[];
}

// 정산업체명 등록 API
export const createSettlementCompanyOne = async (name: string) => {
  try {
    const response = await api.post<SettlementCompanyCreatedAt>(
      "/settlement-company",
      {
        name: name,
      },
    );
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 정산업체명 조회 API
export const fetchSettlementCompanyAll = async () => {
  try {
    const response = await api.get<fetchSettlementCompanyAllResponse>(
      "/settlement-company",
    );
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 정산업체명 수정 API
export const updateSettlementCompanyOne = async (id: number, name: string) => {
  try {
    const response = await api.patch<SettlementCompanyUpdatedAt>(
      `/settlement-company/${id}`,
      {
        name: name,
      },
    );
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 정산업체명 삭제 API
export const deleteSettlementCompanyOne = async (id: number) => {
  try {
    const response = await api.delete(`/settlement-company/${id}`);
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};
