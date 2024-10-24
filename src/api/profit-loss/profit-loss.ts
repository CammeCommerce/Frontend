import { AxiosError } from "axios";
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
  depositByPurpose: Record<string, number>;
  onlineSalesByMedia: Record<string, number>;
  wholesalePurchase: number;
  wholesalePurchaseShippingFee: number;
  withdrawalByPurpose: Record<string, number>;
  onlinePurchaseByMedia: Record<string, number>;
  netProfitOrLoss: number;
}

// 손익계산서 검색 API
export const fetchProfitLossSearch = async (
  fetchProfitLossSearchRequest: FetchProfitLossSearchRequest,
) => {
  try {
    const response = await api.get<ProfitLoss>("/profit-loss", {
      params: fetchProfitLossSearchRequest,
    });

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
