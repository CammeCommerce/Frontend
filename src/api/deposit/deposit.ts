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

// 입금값 조회 API
export const fetchDepositListAll = async () => {
  try {
    const response = await api.get<FetchDepositListAllResponse>("/deposit");
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
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
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 입금값 엑셀 파일 업로드 API
export const uploadDepositListExcel = async (
  uploadDepositListExcelRequest: UploadDepositListExcelRequest,
) => {
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

    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};

// 입금값 수정 API
export const updateDepositListOne = async (
  id: number,
  updateDeposit: UpdateDepositListRequest,
) => {
  try {
    const response = await api.patch(`/deposit/${id}`, updateDeposit);
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
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
    console.error(e);
  }
};

// 입금 매칭 등록 API
export const registerDepositMatching = async (
  registerDepositMatchingRequest: RegisterDepositMatchingRequest,
) => {
  try {
    const response = await api.post(
      "/deposit-matching",
      registerDepositMatchingRequest,
    );
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};
