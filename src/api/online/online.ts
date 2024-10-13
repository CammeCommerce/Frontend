import api from "../baseUrl/baseUrl";

export interface CreateOnlineListOneRequest {
  salesMonth: string; // "YYYY-MM" 형식
  mediumName: string;
  onlineCompanyName: string;
  salesAmount: number;
  purchaseAmount: number;
  marginAmount: number;
  memo: string;
}

export interface OnlineList {
  id: number;
  salesMonth: string; // "YYYY-MM" 형식
  mediumName: string;
  onlineCompanyName: string;
  salesAmount: number;
  purchaseAmount: number;
  marginAmount: number;
  memo: string;
}

export interface OnlineListResponse {
  items: OnlineList[];
}

export interface FetchOnlineListSearchParams {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  searchQuery: string;
}

// 온라인리스트 행 추가 API
export const createOnlineListOne = async (
  createOnlineListOneRequest: CreateOnlineListOneRequest,
) => {
  try {
    const response = await api.post<OnlineList>(
      "/online",
      createOnlineListOneRequest,
    );
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};

// 온라인리스트 조회 API
export const fetchOnlineListAll = async () => {
  try {
    const response = await api.get<OnlineListResponse>("/online");
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 온라인리스트 검색 API
export const fetchOnlineListSearch = async (
  fetchOnlineListSearchParams: FetchOnlineListSearchParams,
) => {
  try {
    console.log("request", fetchOnlineListSearchParams);

    const response = await api.get<OnlineListResponse>("/online/search", {
      params: {
        fetchOnlineListSearchParams,
      },
    });
    console.log("검색", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 온라인리스트 수정 API
export const updateOnlineListOne = async (
  id: number,
  updateOnlineListRequest: CreateOnlineListOneRequest,
) => {
  try {
    const response = await api.patch(`/online/${id}`, updateOnlineListRequest);
    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};
