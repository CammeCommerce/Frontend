import { AxiosError } from "axios";
import api from "../baseUrl/baseUrl";

export interface DepositList {
  id: number;
  mediumName: string;
  depositDate: string;
  accountAlias: string;
  depositAmount: number;
  accountDescription: string;
  transactionMethod1: string;
  transactionMethod2: string;
  accountMemo: string;
  counterpartyName: string;
  purpose: string;
  clientName: string;
  isMediumMatched: boolean;
}

export interface FetchDepositListAllResponse {
  items: DepositList[];
}

export interface UpdateDepositListRequest {
  mediumName: string;
  depositDate: string;
  accountAlias: string;
  depositAmount: number;
  accountDescription: string;
  transactionMethod1: string;
  transactionMethod2: string;
  accountMemo: string;
  counterpartyName: string;
  purpose: string;
  clientName: string;
}

export interface UploadDepositListExcelRequest {
  file: File;
  depositDateIndex: string;
  accountAliasIndex: string;
  depositAmountIndex: string;
  accountDescriptionIndex: string;
  transactionMethod1Index: string;
  transactionMethod2Index: string;
  accountMemoIndex: string;
  counterpartyNameIndex: string;
  purposeIndex: string;
  clientNameIndex: string;
}

export interface FetchDepositListSearchRequest {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  isMediumMatched: string;
  searchQuery: string;
}

export interface RegisterDepositMatchingRequest {
  mediumName: string;
  accountAlias: string;
  purpose: string;
}

export interface DepositMatchingList {
  id: number;
  mediumName: string;
  accountAlias: string;
  purpose: string;
}

export interface FetchDepositMatchingListAllResponse {
  items: DepositMatchingList[];
}

export interface FetchDepositMatchingListSearchRequest {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  searchQuery: string;
}

export interface FetchDepositExcelColumnIndexResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  depositDateIdx: string;
  accountAliasIdx: string;
  depositAmountIdx: string;
  accountDescriptionIdx: string;
  transactionMethod1Idx: string;
  transactionMethod2Idx: string;
  accountMemoIdx: string;
  counterpartyNameIdx: string;
  purposeIdx: string;
  clientNameIdx: string;
}

// 입금값 조회 API
export const fetchDepositListAll = async () => {
  try {
    const response = await api.get<FetchDepositListAllResponse>("/deposit");

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 상세 조회 API
export const fetchDepositListOne = async (id: number) => {
  try {
    const response = await api.get<DepositList>(`/deposit/${id}`);

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입급값 검색 API
export const fetchDepositListSearch = async (
  fetchDepositListSearchRequest: FetchDepositListSearchRequest,
) => {
  try {
    const response = await api.get<FetchDepositListAllResponse>(
      "/deposit/search",
      {
        params: fetchDepositListSearchRequest,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 엑셀 파일 업로드 API
export const uploadDepositListExcel = async (
  uploadDepositListExcelRequest: UploadDepositListExcelRequest,
) => {
  // 입력값 겁증
  const {
    depositDateIndex,
    accountAliasIndex,
    depositAmountIndex,
    accountDescriptionIndex,
    transactionMethod1Index,
    transactionMethod2Index,
    accountMemoIndex,
    counterpartyNameIndex,
    purposeIndex,
    clientNameIndex,
  } = uploadDepositListExcelRequest;

  if (
    !depositDateIndex ||
    !accountAliasIndex ||
    !depositAmountIndex ||
    !accountDescriptionIndex ||
    !transactionMethod1Index ||
    !transactionMethod2Index ||
    !accountMemoIndex ||
    !counterpartyNameIndex ||
    !purposeIndex ||
    !clientNameIndex
  ) {
    alert("모든 엑셀 열 인덱스를 입력해주세요.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", uploadDepositListExcelRequest.file);
    formData.append(
      "depositDateIndex",
      uploadDepositListExcelRequest.depositDateIndex,
    );
    formData.append(
      "accountAliasIndex",
      uploadDepositListExcelRequest.accountAliasIndex,
    );
    formData.append(
      "depositAmountIndex",
      uploadDepositListExcelRequest.depositAmountIndex,
    );
    formData.append(
      "accountDescriptionIndex",
      uploadDepositListExcelRequest.accountDescriptionIndex,
    );
    formData.append(
      "transactionMethod1Index",
      uploadDepositListExcelRequest.transactionMethod1Index,
    );
    formData.append(
      "transactionMethod2Index",
      uploadDepositListExcelRequest.transactionMethod2Index,
    );
    formData.append(
      "accountMemoIndex",
      uploadDepositListExcelRequest.accountMemoIndex,
    );
    formData.append(
      "counterpartyNameIndex",
      uploadDepositListExcelRequest.counterpartyNameIndex,
    );
    formData.append("purposeIndex", uploadDepositListExcelRequest.purposeIndex);
    formData.append(
      "clientNameIndex",
      uploadDepositListExcelRequest.clientNameIndex,
    );

    const response = await api.post("/deposit/excel/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 수정 API
export const updateDepositListOne = async (
  id: number,
  updateDeposit: UpdateDepositListRequest,
) => {
  try {
    const response = await api.patch(`/deposit/${id}`, updateDeposit);

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 엑셀 파일 다운로드 API
export const downloadDepositListExcel = async (
  params: FetchDepositListSearchRequest,
) => {
  try {
    const response = await api.get("/deposit/excel/download", {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "입금리스트.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 삭제 API
export const deleteDepositListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/deposit", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금 매칭 등록 API
export const registerDepositMatching = async (
  registerDepositMatchingRequest: RegisterDepositMatchingRequest,
) => {
  try {
    // 입력값 검증
    const { mediumName, accountAlias, purpose } =
      registerDepositMatchingRequest;

    if (!mediumName || !accountAlias || !purpose) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const response = await api.post(
      "/deposit-matching",
      registerDepositMatchingRequest,
    );

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금 매칭 조회 API
export const fetchDepositMatchingListAll = async () => {
  try {
    const response =
      await api.get<FetchDepositMatchingListAllResponse>("/deposit-matching");

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금 매칭 검색 API
export const fetchDepositMatchingListSearch = async (
  fetchDepositMatchingListSearchRequest: FetchDepositMatchingListSearchRequest,
) => {
  try {
    const response = await api.get<FetchDepositMatchingListAllResponse>(
      "/deposit-matching/search",
      {
        params: fetchDepositMatchingListSearchRequest,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금 매칭 삭제 API
export const deleteDepositMatchingListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/deposit-matching", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 입금값 엑셀 저장된 열 인덱스 조회 API
export const fetchDepositExcelColumnIndex = async () => {
  try {
    const response = await api.get<FetchDepositExcelColumnIndexResponse>(
      "/deposit/column-index",
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
