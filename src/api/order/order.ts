import api from "../baseUrl/baseUrl";

export interface OrderList {
  id: number;
  mediumName: string;
  settlementCompanyName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  purchasePlace: string;
  salesPrice: number;
  purchaseShippingFee: number;
  salesShippingFee: number;
  taxType: string;
  marginAmount: number;
  shippingDifference: number;
}

export interface fetchOrderListAllResponse {
  items: OrderList[];
}

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
