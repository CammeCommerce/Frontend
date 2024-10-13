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

export interface fetchOrderListAllResponse {
  items: OrderList[];
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

    console.log("response", response.data);
  } catch (e) {
    console.error(e);
  }
};

// 주문값 조회 API
export const fetchOrderListAll = async () => {
  try {
    const response = await api.get<fetchOrderListAllResponse>("/order");
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 주문값 검색 API
export const fetchOrderListSearch = async (
  searchQueryParams: OrderListSearchQueryParams,
) => {
  try {
    const response = await api.get<fetchOrderListAllResponse>("/order/search", {
      params: searchQueryParams,
    });
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// 주문값 정렬 API
export const sortOrderList = async (field: string, order: string) => {
  try {
    const response = await api.get<fetchOrderListAllResponse>("/order/sort", {
      params: {
        field,
        order,
      },
    });
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
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
    console.log("response", response.data);

    return response.data;
  } catch (e) {
    console.error(e);
  }
};
