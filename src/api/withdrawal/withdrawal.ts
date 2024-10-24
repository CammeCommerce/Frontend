import { AxiosError } from "axios";
import api from "../baseUrl/baseUrl";

export interface UploadWithdrawalRequest {
  file: File;
  withdrawalDateIndex: string;
  accountAliasIndex: string;
  withdrawalAmountIndex: string;
  accountDescriptionIndex: string;
  transactionMethod1Index: string;
  transactionMethod2Index: string;
  accountMemoIndex: string;
  purposeIndex: string;
  clientNameIndex: string;
}

export interface WithdrawalList {
  id: number;
  mediumName: string;
  withdrawalDate: string;
  accountAlias: string;
  withdrawalAmount: number;
  accountDescription: string;
  transactionMethod1: string;
  transactionMethod2: string;
  accountMemo: string;
  purpose: string;
  clientName: string;
  isMediumMatched: boolean;
}

export interface FetchWithdrawalListAllResponse {
  items: WithdrawalList[];
}

export interface UpdateWithdrawalRequest {
  mediumName: string;
  withdrawalDate: string;
  accountAlias: string;
  withdrawalAmount: number;
  accountDescription: string;
  transactionMethod1: string;
  transactionMethod2: string;
  accountMemo: string;
  purpose: string;
  clientName: string;
}

export interface WithdrawalListSearchQueryParams {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  isMediumMatched: string;
  searchQuery: string;
}

export interface RegisterWithdrawalMatchingRequest {
  mediumName: string;
  accountAlias: string;
  purpose: string;
}

export interface WithdrawalMatching {
  id: number;
  mediumName: string;
  accountAlias: string;
  purpose: string;
}

export interface WithdrawalMatchingList {
  items: WithdrawalMatching[];
}

export interface WithdrawalMatchingListSearchQueryParams {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  searchQuery: string;
}

export interface FetchWithdrawalExcelColumnIndexResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  withdrawalDateIdx: string;
  accountAliasIdx: string;
  withdrawalAmountIdx: string;
  accountDescriptionIdx: string;
  transactionMethod1Idx: string;
  transactionMethod2Idx: string;
  accountMemoIdx: string;
  purposeIdx: string;
  clientNameIdx: string;
}

// 출금값 엑셀 파일 업로드 API
export const uploadWithdrawal = async (
  uploadWithdrawalRequest: UploadWithdrawalRequest,
) => {
  try {
    const formData = new FormData();
    formData.append("file", uploadWithdrawalRequest.file);
    formData.append(
      "withdrawalDateIndex",
      uploadWithdrawalRequest.withdrawalDateIndex,
    );
    formData.append(
      "accountAliasIndex",
      uploadWithdrawalRequest.accountAliasIndex,
    );
    formData.append(
      "withdrawalAmountIndex",
      uploadWithdrawalRequest.withdrawalAmountIndex,
    );
    formData.append(
      "accountDescriptionIndex",
      uploadWithdrawalRequest.accountDescriptionIndex,
    );
    formData.append(
      "transactionMethod1Index",
      uploadWithdrawalRequest.transactionMethod1Index,
    );
    formData.append(
      "transactionMethod2Index",
      uploadWithdrawalRequest.transactionMethod2Index,
    );
    formData.append(
      "accountMemoIndex",
      uploadWithdrawalRequest.accountMemoIndex,
    );
    formData.append("purposeIndex", uploadWithdrawalRequest.purposeIndex);
    formData.append("clientNameIndex", uploadWithdrawalRequest.clientNameIndex);

    const response = await api.post("/withdrawal/excel/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 조회 API
export const fetchWithdrawalListAll = async () => {
  try {
    const response =
      await api.get<FetchWithdrawalListAllResponse>("/withdrawal");

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 상제 조회 API
export const fetchWithdrawalOne = async (id: number) => {
  try {
    const response = await api.get<WithdrawalList>(`/withdrawal/${id}`);

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 검색 API
export const fetchWithdrawalListSearch = async (
  searchQueryParams: WithdrawalListSearchQueryParams,
) => {
  try {
    const response = await api.get<FetchWithdrawalListAllResponse>(
      "/withdrawal/search",
      {
        params: searchQueryParams,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 수정 API
export const updateWithdrawalOne = async (
  id: number,
  updateWithdrawalRequest: UpdateWithdrawalRequest,
) => {
  try {
    const response = await api.patch(
      `/withdrawal/${id}`,
      updateWithdrawalRequest,
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 엑셀 파일 다운로드 API
export const downloadWithdrawalListExcel = async (
  params: WithdrawalListSearchQueryParams,
) => {
  try {
    const response = await api.get("/withdrawal/excel/download", {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "출금리스트.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 삭제 API
export const deleteWithdrawalListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/withdrawal", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금 매칭 등록 API
export const registerWithdrawalMatching = async (
  registerWithdrawalMatchingRequest: RegisterWithdrawalMatchingRequest,
) => {
  try {
    const response = await api.post(
      "/withdrawal-matching",
      registerWithdrawalMatchingRequest,
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금 매칭 조회 API
export const fetchWithdrawalMatchingListAll = async () => {
  try {
    const response = await api.get<WithdrawalMatchingList>(
      "/withdrawal-matching",
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금 매칭 검색 API
export const fetchWithdrawalMatchingListSearch = async (
  searchQueryParams: WithdrawalMatchingListSearchQueryParams,
) => {
  try {
    const response = await api.get<WithdrawalMatchingList>(
      "/withdrawal-matching/search",
      {
        params: searchQueryParams,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금 매칭 삭제 API
export const deleteWithdrawalMatchingListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/withdrawal-matching", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 출금값 엑셀 저장된 열 인덱스 조회 API
export const fetchWithdrawalExcelColumnIndex = async () => {
  try {
    const response = await api.get<FetchWithdrawalExcelColumnIndexResponse>(
      "/withdrawal/column-index",
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
