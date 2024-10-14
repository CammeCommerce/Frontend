import api from "../baseUrl/baseUrl";

export interface FetchProfitLossSearchRequest {
  startDate: string;
  endDate: string;
  mediumName: string;
}

export interface ProfitLoss {
  mediumName: string;
  period: string;
  wholesaleSales: number;
  wholesaleShippingFee: number;
  depositByPurpose: {
    [key: string]: number;
  };
  onlineSalesByMedia: {
    [key: string]: number;
  };
  wholesalePurchase: number; // 도매 매입
  wholesalePurchaseShippingFee: number;
  withdrawalByPurpose: {
    [key: string]: number;
  };
  onlinePurchaseByMedia: {
    [key: string]: number;
  };
}

// 손익계산서 검색 API
export const fetchProfitLossSearch = async (
  fetchProfitLossSearchRequest: FetchProfitLossSearchRequest,
) => {
  try {
    const response = await api.get<ProfitLoss>("/profit-loss", {
      params: fetchProfitLossSearchRequest,
    });
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};
