import { AxiosError } from "axios";
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

export interface FetchSettlementCompanyAllResponse {
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

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 정산업체명 조회 API
export const fetchSettlementCompanyAll = async () => {
  try {
    const response = await api.get<FetchSettlementCompanyAllResponse>(
      "/settlement-company",
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 정산업체명 검색 조회 API
export const fetchSettlementCompanySearch = async (
  name: string = "",
  startDate: string = "",
  endDate: string = "",
  periodType: string = "",
) => {
  try {
    // 빈 문자열인 경우 해당 필드를 params에서 제외
    const params: { [key: string]: string } = {};

    if (name) params.name = name;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (periodType) params.periodType = periodType;

    const response = await api.get<FetchSettlementCompanyAllResponse>(
      "/settlement-company/search",
      {
        params: params,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
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

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 정산업체명 삭제 API
export const deleteSettlementCompanyOne = async (id: number) => {
  try {
    const response = await api.delete(`/settlement-company/${id}`);

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
