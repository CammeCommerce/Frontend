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

export interface fetchOrderListAllResponse {
  items: OrderList[];
}

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
