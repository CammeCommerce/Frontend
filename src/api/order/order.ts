import { AxiosError } from "axios";
import api from "../baseUrl/baseUrl";

export interface OrderList {
  id: number;
  mediumName: string;
  settlementCompanyName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  purchasePlace: string;
  salesPlace: string;
  purchasePrice: number;
  salesPrice: number;
  purchaseShippingFee: number;
  salesShippingFee: number;
  taxType: string;
  marginAmount: number;
  shippingDifference: number;
}

interface UpdateOrderList {
  mediumName: string;
  settlementCompanyName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  purchasePlace: string;
  salesPlace: string;
  purchasePrice: number;
  salesPrice: number;
  purchaseShippingFee: number;
  salesShippingFee: number;
  taxType: number;
}

export interface OrderListSearchQueryParams {
  startDate: string;
  endDate: string;
  periodType: string;
  mediumName: string;
  isMediumMatched: string;
  settlementCompanyName: string;
  isSettlementCompanyMatched: string;
  searchQuery: string;
}

export interface RegisterOrderMatchingRequest {
  mediumName: string;
  settlementCompanyName: string;
  purchasePlace: string;
  salesPlace: string;
}

export interface OrderMatchingList {
  id: number;
  mediumName: string;
  settlementCompanyName: string;
  purchasePlace: string;
  salesPlace: string;
}

export interface FetchOrderListAllResponse {
  items: OrderList[];
  totalMarginAmount: number;
  totalPurchasePrice: number;
  totalPurchaseShippingFee: number;
  totalSalesPrice: number;
  totalSalesShippingFee: number;
  totalShippingDifference: number;
}

export interface FetchOrderMatchingListAllResponse {
  items: OrderMatchingList[];
}

export interface FetchOrderExcelColumnIndexResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  productNameIndex: string;
  quantityIndex: string;
  orderDateIndex: string;
  purchasePlaceIndex: string;
  salesPlaceIndex: string;
  purchasePriceIndex: string;
  salesPriceIndex: string;
  purchaseShippingFeeIndex: string;
  salesShippingFeeIndex: string;
  taxTypeIndex: string;
}

// 주문값 엑셀 파일 업로드 API
export const uploadOrder = async (
  excelFile: File,
  productNameIndex: string,
  quantityIndex: string,
  orderDateIndex: string,
  purchasePlaceIndex: string,
  salesPlaceIndex: string,
  purchasePriceIndex: string,
  salesPriceIndex: string,
  purchaseShippingFeeIndex: string,
  salesShippingFeeIndex: string,
  taxTypeIndex: string,
) => {
  // 입력값 검증
  if (
    !productNameIndex ||
    !quantityIndex ||
    !orderDateIndex ||
    !purchasePlaceIndex ||
    !salesPlaceIndex ||
    !purchasePriceIndex ||
    !salesPriceIndex ||
    !purchaseShippingFeeIndex ||
    !salesShippingFeeIndex ||
    !taxTypeIndex
  ) {
    alert("모든 엑셀 열 인덱스를 입력해주세요.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("productNameIndex", productNameIndex);
    formData.append("quantityIndex", quantityIndex);
    formData.append("orderDateIndex", orderDateIndex);
    formData.append("purchasePlaceIndex", purchasePlaceIndex);
    formData.append("salesPlaceIndex", salesPlaceIndex);
    formData.append("purchasePriceIndex", purchasePriceIndex);
    formData.append("salesPriceIndex", salesPriceIndex);
    formData.append("purchaseShippingFeeIndex", purchaseShippingFeeIndex);
    formData.append("salesShippingFeeIndex", salesShippingFeeIndex);
    formData.append("taxTypeIndex", taxTypeIndex);

    const response = await api.post("/order/excel/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 조회 API
export const fetchOrderListAll = async () => {
  try {
    const response = await api.get<FetchOrderListAllResponse>("/order");

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 상세 조회 API
export const fetchOrderListOne = async (id: number) => {
  try {
    const response = await api.get<OrderList>(`/order/${id}`);

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 검색 API
export const fetchOrderListSearch = async (
  searchQueryParams: OrderListSearchQueryParams,
) => {
  try {
    const response = await api.get<FetchOrderListAllResponse>("/order/search", {
      params: searchQueryParams,
    });

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 정렬 API
export const sortOrderList = async (field: string, order: string) => {
  try {
    const response = await api.get<FetchOrderListAllResponse>("/order/sort", {
      params: {
        field,
        order,
      },
    });

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 수정 API
export const updateOrderListOne = async (
  id: number,
  updateOrderList: UpdateOrderList,
) => {
  try {
    const response = await api.patch<OrderList>(
      `/order/${id}`,
      updateOrderList,
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 엑셀 파일 다운로드 API
export const downloadOrderListExcel = async (
  params: OrderListSearchQueryParams,
) => {
  try {
    const response = await api.get("/order/excel/download", {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "주문리스트.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 삭제 API
export const deleteOrderListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/order", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문 매칭 등록 API
export const registerOrderMatching = async (
  registerOrderMatchingRequest: RegisterOrderMatchingRequest,
) => {
  try {
    // 입력값 검증
    const { mediumName, settlementCompanyName, purchasePlace, salesPlace } =
      registerOrderMatchingRequest;

    if (
      !mediumName ||
      !settlementCompanyName ||
      !purchasePlace ||
      !salesPlace
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const response = await api.post(
      "/order-matching",
      registerOrderMatchingRequest,
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문 매칭 조회 API
export const fetchOrderMatchingListAll = async () => {
  try {
    const response =
      await api.get<FetchOrderMatchingListAllResponse>("/order-matching");

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문 매칭 검색 API
export const fetchOrderMatchingListSearch = async (
  startDate: string = "",
  endDate: string = "",
  periodType: string = "",
  mediumName: string = "",
  settlementCompanyName: string = "",
  searchQuery: string = "",
) => {
  try {
    // 빈 문자열인 경우 해당 필드를 params에서 제외
    const params: { [key: string]: string } = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (periodType) params.periodType = periodType;
    if (mediumName) params.mediumName = mediumName;
    if (settlementCompanyName)
      params.settlementCompanyName = settlementCompanyName;
    if (searchQuery) params.searchQuery = searchQuery;

    const response = await api.get<FetchOrderMatchingListAllResponse>(
      "/order-matching/search",
      {
        params: params,
      },
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문 매칭 삭제 API
export const deleteOrderMatchingListMany = async (ids: number[]) => {
  try {
    const response = await api.delete("/order-matching", {
      data: {
        ids,
      },
    });

    return response;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};

// 주문값 엑셀 저장된 열 인덱스 조회
export const fetchOrderExcelColumnIndex = async () => {
  try {
    const response = await api.get<FetchOrderExcelColumnIndexResponse>(
      "/order/column-index",
    );

    return response.data;
  } catch (e) {
    return Promise.reject(e as AxiosError);
  }
};
