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

    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};

// 출금값 조회 API
export const fetchWithdrawalListAll = async () => {
  try {
    const response =
      await api.get<FetchWithdrawalListAllResponse>("/withdrawal");
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
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
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
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
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
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
    console.error(e);
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
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};
