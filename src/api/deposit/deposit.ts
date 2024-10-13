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
