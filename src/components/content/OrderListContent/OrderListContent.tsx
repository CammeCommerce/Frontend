import { useCallback, useEffect, useState } from "react";
import {
  deleteOrderListMany,
  downloadOrderListExcel,
  fetchOrderExcelColumnIndex,
  fetchOrderListAll,
  FetchOrderListAllResponse,
  fetchOrderListOne,
  fetchOrderListSearch,
  // OrderList,
  registerOrderMatching,
  sortOrderList,
  updateOrderListOne,
  uploadOrder,
} from "../../../api/order/order";
import { useDropzone } from "react-dropzone";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";
import { fetchCompanyAll } from "../../../api/medium/medium";
import { fetchSettlementCompanyAll } from "../../../api/settlement-company/settlement-company";
import LoadingSpinner from "../../LoadingSpinner";

/* prettier-ignore */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // 알파벳 배열

const ORDERLIST_HEADER = [
  { No: "id" },
  { 매체명: "mediumName" },
  { 정산업체명: "settlementCompanyName" },
  { 상품명: "productName" },
  { 수량: "quantity" },
  { 발주일자: "orderDate" },
  { 매입처: "purchasePlace" },
  { 매출처: "salesPlace" },
  { 매입가: "purchasePrice" },
  { 판매가: "salesPrice" },
  { "매입 배송비": "purchaseShippingFee" },
  { "매출 배송비": "salesShippingFee" },
  { 과세여부: "taxType" },
  { 마진액: "marginAmount" },
  { 배송차액: "shippingDifference" },
  { 관리: "management" },
]; // 주문 리스트 테이블 헤더

function OrderListContent() {
  const [orderList, setOrderList] = useState<FetchOrderListAllResponse>({
    items: [],
    totalMarginAmount: 0,
    totalPurchasePrice: 0,
    totalPurchaseShippingFee: 0,
    totalSalesPrice: 0,
    totalSalesShippingFee: 0,
    totalShippingDifference: 0,
  }); // 주문 리스트
  const [companyList, setCompanyList] = useState<string[]>([""]); // 매체 리스트
  const [settlementCompanyList, setSettlementCompanyList] = useState<string[]>([
    "",
  ]); // 정산업체 리스트

  const [orderIdToUpdate, setOrderIdToUpdate] = useState<number>(-1); // 수정할 주문값의 ID
  const [mediumNameToMatch, setMediumNameToMatch] = useState<string>(""); // 매칭할 매체명
  const [settlementCompanyNameToMatch, setSettlementCompanyNameToMatch] =
    useState<string>(""); // 매칭할 정산업체명
  const [purchasePlaceToMatch, setPurchasePlaceToMatch] = useState<string>(""); // 매칭할 매입처
  const [salesPlaceToMatch, setSalesPlaceToMatch] = useState<string>(""); // 매칭할 매출처
  const [fieldToSort, setFieldToSort] = useState<string>(""); // 정렬할 필드
  const [isDescend, setIsDescend] = useState<string>(""); // 내림차순 여부
  const [isEditMode, setIsEditMode] = useState<number | null>(null); // 수정 가능 여부
  // const [editableOrderList, setEditableOrderList] = useState<OrderList[]>([]);
  const [isMatchingButtonClicked, setIsMatchingButtonClicked] =
    useState<boolean>(false); // 매칭 버튼 클릭 여부

  // 원본 데이터를 참조로 저장
  // const originalOrderList = useRef<OrderList[]>([]);

  const [isExcelResponseLoading, setIsExcelResponseLoading] =
    useState<boolean>(false); // 엑셀 응답 로딩 상태
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // 삭제 중 로딩 상태
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false); // 테이블 로딩 상태

  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] =
    useState<boolean>(false); // 주문값 등록 모달 오픈 상태
  const [isUpdateOrderModalOpen, setIsUpdateOrderModalOpen] =
    useState<boolean>(false); // 주문값 수정 모달 오픈 상태
  const [
    isRegisterOrderMatchingModalOpen,
    setIsRegisterOrderMatchingModalOpen,
  ] = useState<boolean>(false); // 주문 매칭 등록 모달 오픈 상태

  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [isMediumMatched, setIsMediumMatched] = useState<string>(""); // 매체명 매칭여부
  const [settlementCompanyName, setSettlementCompanyName] =
    useState<string>(""); // 정산업체명
  const [isSettlementCompanyMatched, setIsSettlementCompanyMatched] =
    useState<string>(""); // 정산업체명 매칭여부
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 엑셀 파일 관련 상태
  const [excelFile, setExcelFile] = useState<File>(); // 엑셀 파일
  const [productNameIndex, setProductNameIndex] = useState<string>(""); // 상품명
  const [quantityIndex, setQuantityIndex] = useState<string>(""); // 수량
  const [orderDateIndex, setOrderDateIndex] = useState<string>(""); // 발주일자
  const [purchasePlaceIndex, setPurchasePlaceIndex] = useState<string>(""); // 매입처
  const [salesPlaceIndex, setSalesPlaceIndex] = useState<string>(""); // 매출처
  const [purchasePriceIndex, setPurchasePriceIndex] = useState<string>(""); // 매입가
  const [salesPriceIndex, setSalesPriceIndex] = useState<string>(""); // 판매가
  const [purchaseShippingFeeIndex, setPurchaseShippingFeeIndex] =
    useState<string>(""); // 매입 배송비
  const [salesShippingFeeIndex, setSalesShippingFeeIndex] =
    useState<string>(""); // 매출 배송비
  const [taxTypeIndex, setTaxTypeIndex] = useState<string>(""); // 과세 여부

  // 수정할 주문값
  const [updateOrder, setUpdateOrder] = useState({
    mediumName: "",
    settlementCompanyName: "",
    productName: "",
    quantity: 0,
    orderDate: "",
    purchasePlace: "",
    salesPlace: "",
    purchasePrice: 0,
    salesPrice: 0,
    purchaseShippingFee: 0,
    salesShippingFee: 0,
    taxType: 0,
  });

  const [orderIdsToDelete, setOrderIdsToDelete] = useState<number[]>([]); // 삭제할 주문값의 ID 배열

  // 엑셀 파일 드롭 이벤트
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setExcelFile(file);
  }, []);

  // Dropzone 설정
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    }, // 엑셀 파일만 허용
    multiple: false, // 하나의 파일만 받음
  });

  // 체크박스 전체 선택 이벤트
  function handleSelectAllCheckboxChange() {
    if (orderIdsToDelete.length === orderList?.items.length) {
      setOrderIdsToDelete([]);
    } else {
      const allOrderIds = orderList?.items.map((order) => order.id) || [];
      setOrderIdsToDelete(allOrderIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(orderId: number) {
    setOrderIdsToDelete((prevOrderIds) => {
      if (prevOrderIds.includes(orderId)) {
        return prevOrderIds.filter((id) => id !== orderId);
      } else {
        return [...prevOrderIds, orderId];
      }
    });
  }

  // 주문값 등록 모달 닫기 버튼 클릭 이벤트
  function handleExcelModalCloseButtonClick() {
    setIsCreateOrderModalOpen(false);
    setExcelFile(undefined);
  }

  // // "전체 수정" 버튼 클릭 이벤트
  // function handleEditButtonClick() {
  //   setIsEditMode(true);
  //   setEditableOrderList(orderList.items); // 수정 가능한 데이터 복사
  //   originalOrderList.current = JSON.parse(JSON.stringify(orderList.items)); // 원본 데이터 저장
  // }

  // // "저장" 버튼 클릭 이벤트
  // function handleSaveButtonClick() {
  //   // 수정된 데이터만 추출
  //   const modifiedOrders = editableOrderList.filter((editableItem, index) => {
  //     const originalItem = originalOrderList.current[index];
  //     return JSON.stringify(editableItem) !== JSON.stringify(originalItem);
  //   });

  //   // console.log("수정된 데이터:", modifiedOrders); // 수정된 데이터 출력

  //   try {
  //     modifiedOrders.forEach((modifiedOrder) => {
  //       updateOrderListOne(modifiedOrder.id, {
  //         mediumName: modifiedOrder.mediumName,
  //         settlementCompanyName: modifiedOrder.settlementCompanyName,
  //         productName: modifiedOrder.productName,
  //         quantity: modifiedOrder.quantity,
  //         orderDate: modifiedOrder.orderDate,
  //         purchasePlace: modifiedOrder.purchasePlace,
  //         salesPlace: modifiedOrder.salesPlace,
  //         purchasePrice: modifiedOrder.purchasePrice,
  //         salesPrice: modifiedOrder.salesPrice,
  //         purchaseShippingFee: modifiedOrder.purchaseShippingFee,
  //         salesShippingFee: modifiedOrder.salesShippingFee,
  //         taxType: Number(modifiedOrder.taxType),
  //       }).catch((error) => {
  //         console.error(error);
  //       });
  //     });

  //     window.location.reload();
  //   } catch (e) {
  //     console.error(e);
  //   }

  //   setIsEditMode(false);
  // }

  // // 값 수정 핸들러
  // function handleEditableChange(
  //   index: number,
  //   field: keyof OrderList,
  //   value: string,
  // ) {
  //   const updatedList = [...editableOrderList];
  //   updatedList[index] = {
  //     ...updatedList[index],
  //     [field]: value,
  //   };
  //   setEditableOrderList(updatedList);
  // }

  // 주문값 등록 버튼 클릭 이벤트
  function handleCreateOrderButtonClick() {
    if (excelFile) {
      setIsExcelResponseLoading(true); // 엑셀 파일 업로드 중 로딩 상태
      uploadOrder(
        excelFile,
        productNameIndex,
        quantityIndex,
        orderDateIndex,
        purchasePlaceIndex,
        salesPlaceIndex,
        purchasePriceIndex,
        salesPriceIndex,
        purchaseShippingFeeIndex,
        salesShippingFeeIndex,
        taxTypeIndex,
      )
        .then(() => {
          setIsCreateOrderModalOpen(false);
          setExcelFile(undefined);
          setIsExcelResponseLoading(false); // 엑셀 파일 업로드 로딩 상태 해제
          window.location.reload();
        })
        .catch((error) => {
          setIsExcelResponseLoading(false); // 엑셀 파일 업로드 로딩 상태 해제
          alert(error.response.data.message);
        });
    } else {
      alert("엑셀 파일을 업로드해주세요.");
    }
  }

  // 주문값 수정 버튼 클릭 이벤트
  function handleUpdateOrderButtonClick() {
    updateOrderListOne(orderIdToUpdate, updateOrder)
      .then((response) => {
        console.log(response);
        setIsUpdateOrderModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 검색 버튼 클릭 이벤트
  function handleSearchButtonClick() {
    fetchOrderListSearch({
      startDate,
      endDate,
      periodType,
      mediumName,
      isMediumMatched,
      settlementCompanyName,
      isSettlementCompanyMatched,
      searchQuery,
    })
      .then((response) => {
        setOrderList(
          response ?? {
            items: [],
            totalMarginAmount: 0,
            totalPurchasePrice: 0,
            totalPurchaseShippingFee: 0,
            totalSalesPrice: 0,
            totalSalesShippingFee: 0,
            totalShippingDifference: 0,
          },
        );
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.error(error);
      });
  }

  // 엑셀 다운로드 버튼 클릭 이벤트
  function handleExcelDownloadButtonClick() {
    downloadOrderListExcel({
      startDate,
      endDate,
      periodType,
      mediumName,
      isMediumMatched,
      settlementCompanyName,
      isSettlementCompanyMatched,
      searchQuery,
    }).catch((error) => {
      console.error(error);
    });
  }

  // 주문값 선택 삭제 버튼 클릭 이벤트
  function handleDeleteOrderButtonClick() {
    if (orderIdsToDelete.length === 0) {
      alert("삭제할 주문값을 선택해주세요.");
      return;
    }
    try {
      setIsDeleting(true); // 삭제 중 로딩 상태
      deleteOrderListMany(orderIdsToDelete)
        .then(() => {
          setIsDeleting(false); // 삭제 중 로딩 상태 해제
          setOrderIdsToDelete([]);
          window.location.reload();
        })
        .catch((error) => {
          setIsDeleting(false); // 삭제 중 로딩 상태 해제
          console.error(error);
        });
    } catch (error) {
      setIsDeleting(false); // 삭제 중 로딩 상태 해제
      console.error(error);
    }
  }

  // 주문 매칭 등록 버튼 클릭 이벤트
  function handleRegisterOrderMatchingButtonClick() {
    registerOrderMatching({
      mediumName: mediumNameToMatch,
      settlementCompanyName: settlementCompanyNameToMatch,
      purchasePlace: purchasePlaceToMatch,
      salesPlace: salesPlaceToMatch,
    })
      .then(() => {
        setMediumNameToMatch("");
        setSettlementCompanyNameToMatch("");
        setPurchasePlaceToMatch("");
        setSalesPlaceToMatch("");
        setIsRegisterOrderMatchingModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert("이미 등록된 매칭입니다.");
        } else {
          alert(error.response.data.message);
        }
      });
  }

  // 주문값 등록 모달 열기 버튼 클릭 이벤트
  function handleCreateOrderModalOpenButtonClick() {
    setIsCreateOrderModalOpen(true);

    fetchOrderExcelColumnIndex().then((response) => {
      if (response) {
        setProductNameIndex(response.productNameIndex);
        setQuantityIndex(response.quantityIndex);
        setOrderDateIndex(response.orderDateIndex);
        setPurchasePlaceIndex(response.purchasePlaceIndex);
        setSalesPlaceIndex(response.salesPlaceIndex);
        setPurchasePriceIndex(response.purchasePriceIndex);
        setSalesPriceIndex(response.salesPriceIndex);
        setPurchaseShippingFeeIndex(response.purchaseShippingFeeIndex);
        setSalesShippingFeeIndex(response.salesShippingFeeIndex);
        setTaxTypeIndex(response.taxTypeIndex);
      }
    });
  }

  // 마운트 시 실행
  useEffect(() => {
    // 주문 리스트 조회
    try {
      setIsTableLoading(true); // 테이블 로딩 상태
      fetchOrderListAll()
        .then((response) => {
          setOrderList(
            response ?? {
              items: [],
              totalMarginAmount: 0,
              totalPurchasePrice: 0,
              totalPurchaseShippingFee: 0,
              totalSalesPrice: 0,
              totalSalesShippingFee: 0,
              totalShippingDifference: 0,
            },
          );
          setIsTableLoading(false); // 테이블 로딩 상태 해제
        })
        .catch((error) => {
          setIsTableLoading(false); // 테이블 로딩 상태 해제
          console.error(error);
        });
    } catch (error) {
      setIsTableLoading(false); // 테이블 로딩 상태 해제
      console.error(error);
    }

    // 매체명 조회
    fetchCompanyAll()
      .then((response) => {
        if (response) {
          const companyNames = response.items.map((company) => company.name);
          setCompanyList(companyNames);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // 정산업체명 조회
    fetchSettlementCompanyAll().then((response) => {
      if (response) {
        const settlementCompanyNames = response.items.map(
          (settlementCompany) => settlementCompany.name,
        );
        setSettlementCompanyList(settlementCompanyNames);
      }
    });
  }, []);

  // 정렬 필드 변경 시 실행
  useEffect(() => {
    if (fieldToSort && isDescend) {
      sortOrderList(fieldToSort, isDescend)
        .then((response) => {
          setOrderList(
            response ?? {
              items: [],
              totalMarginAmount: 0,
              totalPurchasePrice: 0,
              totalPurchaseShippingFee: 0,
              totalSalesPrice: 0,
              totalSalesShippingFee: 0,
              totalShippingDifference: 0,
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [fieldToSort, isDescend]);

  // orderIdToUpdate가 변경될 때 API 호출
  useEffect(() => {
    if (orderIdToUpdate !== -1) {
      fetchOrderListOne(orderIdToUpdate).then((response) => {
        if (response) {
          setUpdateOrder({
            mediumName: response.mediumName,
            settlementCompanyName: response.settlementCompanyName,
            productName: response.productName,
            quantity: response.quantity,
            orderDate: response.orderDate,
            purchasePlace: response.purchasePlace,
            salesPlace: response.salesPlace,
            purchasePrice: response.purchasePrice,
            salesPrice: response.salesPrice,
            purchaseShippingFee: response.purchaseShippingFee,
            salesShippingFee: response.salesShippingFee,
            taxType: Number(response.taxType),
          });
        }
      });
    }
  }, [orderIdToUpdate]);

  // 매칭 버튼 클릭 시 실행
  useEffect(() => {
    if (isMatchingButtonClicked) {
      handleRegisterOrderMatchingButtonClick();
      setIsMatchingButtonClicked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMatchingButtonClicked,
    mediumNameToMatch,
    settlementCompanyNameToMatch,
  ]);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">주문 리스트</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="font-semibold">발주일자검색</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
                <span className="font-semibold">~</span>
                <input
                  type="date"
                  className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`${periodType === "" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("")}
                >
                  전체
                </button>
                <button
                  type="button"
                  className={`${periodType === "어제" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("어제")}
                >
                  어제
                </button>
                <button
                  type="button"
                  className={`${periodType === "지난 3일" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("지난 3일")}
                >
                  지난 3일
                </button>
                <button
                  type="button"
                  className={`${periodType === "일주일" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("일주일")}
                >
                  일주일
                </button>
                <button
                  type="button"
                  className={`${periodType === "1개월" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("1개월")}
                >
                  1개월
                </button>
                <button
                  type="button"
                  className={`${periodType === "3개월" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("3개월")}
                >
                  3개월
                </button>
                <button
                  type="button"
                  className={`${periodType === "6개월" ? "border border-solid border-primaryButton bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("6개월")}
                >
                  6개월
                </button>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">매체명</span>
                  <select
                    className="h-8 w-60 border border-solid border-black text-center"
                    onChange={(e) => {
                      setMediumName(e.target.value);
                    }}
                  >
                    <option value="">전체</option>
                    {companyList.map((company, index) => (
                      <option key={index} value={company || ""}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">매체명 매칭여부</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="mediumMatching"
                        value=""
                        className=""
                        checked={isMediumMatched === ""}
                        onChange={(e) => {
                          setIsMediumMatched(e.target.value);
                        }}
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="mediumMatching"
                        value="true"
                        className=""
                        checked={isMediumMatched === "true"}
                        onChange={(e) => {
                          setIsMediumMatched(e.target.value);
                        }}
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="mediumMatching"
                        value="false"
                        className=""
                        checked={isMediumMatched === "false"}
                        onChange={(e) => {
                          setIsMediumMatched(e.target.value);
                        }}
                      />
                      미매칭
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">정산업체명</span>
                  <select
                    className="h-8 w-60 border border-solid border-black text-center"
                    onChange={(e) => {
                      setSettlementCompanyName(e.target.value);
                    }}
                  >
                    <option value="">전체</option>
                    {settlementCompanyList.map((settlementCompany, index) => (
                      <option key={index} value={settlementCompany || ""}>
                        {settlementCompany}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">정산업체명 매칭여부</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="settlementCompanyMatching"
                        value=""
                        className=""
                        checked={isSettlementCompanyMatched === ""}
                        onChange={(e) => {
                          setIsSettlementCompanyMatched(e.target.value);
                        }}
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="settlementCompanyMatching"
                        value="true"
                        className=""
                        checked={isSettlementCompanyMatched === "true"}
                        onChange={(e) => {
                          setIsSettlementCompanyMatched(e.target.value);
                        }}
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="settlementCompanyMatching"
                        value="false"
                        className=""
                        checked={isSettlementCompanyMatched === "false"}
                        onChange={(e) => {
                          setIsSettlementCompanyMatched(e.target.value);
                        }}
                      />
                      미매칭
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="font-semibold">검색</span>
              <div className="h-10 w-96 rounded-md border border-solid border-black px-3">
                <input
                  type="text"
                  className="h-full w-full"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                  onClick={handleSearchButtonClick}
                >
                  검색하기
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-solid border-gray-500 px-5 font-semibold text-gray-500"
                >
                  검색 초기화
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex h-fit w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={handleCreateOrderModalOpenButtonClick}
              >
                주문값 등록
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
                onClick={handleDeleteOrderButtonClick}
              >
                선택 삭제
              </button>
              {/* {isEditMode ? (
                <button
                  type="button"
                  className="flex h-10 items-center justify-center rounded-md bg-primaryButtonHover px-5 font-semibold text-white"
                  onClick={handleSaveButtonClick}
                >
                  저장
                </button>
              ) : (
                <button
                  type="button"
                  className="flex h-10 items-center justify-center rounded-md bg-primaryButton px-5 font-semibold text-white"
                  onClick={handleEditButtonClick}
                >
                  전체 수정
                </button>
              )} */}
            </div>
            <div className="flex items-center gap-3">
              <select
                name="fieldToSort"
                id=""
                className="h-10 rounded-md border border-solid border-black px-4 text-center font-medium"
                onChange={(e) => {
                  setFieldToSort(e.target.value);
                }}
              >
                <option value="">리스트명</option>
                {ORDERLIST_HEADER.slice(0, ORDERLIST_HEADER.length - 1).map(
                  (header, index) => (
                    <option key={index} value={Object.values(header)[0] || ""}>
                      {Object.keys(header)[0]}
                    </option>
                  ),
                )}
              </select>
              <select
                name="isDescend"
                id=""
                className="h-10 rounded-md border border-solid border-black px-4 text-center font-medium"
                onChange={(e) => {
                  setIsDescend(e.target.value);
                }}
              >
                <option value="">정렬방식</option>
                <option value="asc">오름차순</option>
                <option value="desc">내림차순</option>
              </select>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={handleExcelDownloadButtonClick}
              >
                엑셀 다운로드
              </button>
            </div>
          </div>
          <div className="mb-10 mt-2 h-fit w-full overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="w-9 border border-black">
                    <input
                      type="checkbox"
                      className=""
                      onChange={handleSelectAllCheckboxChange}
                      checked={
                        orderList?.items &&
                        orderList.items.length > 0 &&
                        orderIdsToDelete.length === orderList.items.length
                      }
                    />
                  </th>
                  {ORDERLIST_HEADER.map((header, index) => (
                    <th key={index} className="border border-black">
                      {Object.keys(header)[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderList?.items.map((order, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      <input
                        type="checkbox"
                        className=""
                        onChange={() => handleCheckboxChange(order.id)}
                        checked={orderIdsToDelete.includes(order.id)}
                      />
                    </td>
                    <td className="border border-black text-center">
                      {orderList.items.length - index}
                    </td>
                    <td
                      className={`${isEditMode === index || "px-2"} max-w-32 overflow-hidden whitespace-nowrap border border-black text-center`}
                      contentEditable={order.mediumName === null}
                      suppressContentEditableWarning
                      // onInput={(e) =>
                      //   handleEditableChange(
                      //     index,
                      //     "mediumName",
                      //     e.currentTarget.textContent || "",
                      //   )
                      // }
                      onInput={(e) => {
                        setMediumNameToMatch(e.currentTarget.textContent || "");
                      }}
                      onFocus={() => setIsEditMode(index)}
                      // onBlur={() => setIsEditMode(null)}
                    >
                      {order.mediumName}
                    </td>
                    <td
                      className={`${isEditMode === index || "px-2"} max-w-32 overflow-hidden whitespace-nowrap border border-black text-center`}
                      contentEditable={order.settlementCompanyName === null}
                      suppressContentEditableWarning
                      // onInput={(e) =>
                      //   handleEditableChange(
                      //     index,
                      //     "settlementCompanyName",
                      //     e.currentTarget.textContent || "",
                      //   )
                      // }
                      onInput={(e) => {
                        setSettlementCompanyNameToMatch(
                          e.currentTarget.textContent || "",
                        );
                      }}
                      onFocus={() => setIsEditMode(index)}
                      // onBlur={() => setIsEditMode(null)}
                    >
                      {order.settlementCompanyName}
                    </td>
                    <td className="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap border border-black px-2 text-center">
                      {order.productName}
                    </td>
                    <td className="border border-black text-center">
                      {order.quantity}
                    </td>
                    <td className="border border-black text-center">
                      {order.orderDate}
                    </td>
                    <td className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap border border-black px-2 text-center">
                      {order.purchasePlace}
                    </td>
                    <td className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap border border-black px-2 text-center">
                      {order.salesPlace}
                    </td>
                    <td className="border border-black text-center">
                      {order.purchasePrice}
                    </td>
                    <td className="border border-black text-center">
                      {order.salesPrice}
                    </td>
                    <td className="border border-black text-center">
                      {order.purchaseShippingFee}
                    </td>
                    <td className="border border-black text-center">
                      {order.salesShippingFee}
                    </td>
                    <td className="border border-black text-center">
                      {order.taxType === "11" && "과세"}
                      {order.taxType === "12" && "면세"}
                    </td>
                    <td className="border border-black text-center">
                      {order.marginAmount}
                    </td>
                    <td className="border border-black text-center">
                      {order.shippingDifference}
                    </td>
                    <td className="border border-black px-2 text-center">
                      <div className="flex w-full items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex h-8 items-center justify-center whitespace-nowrap rounded-md bg-editButton px-5 font-semibold text-white"
                          onClick={() => {
                            setIsUpdateOrderModalOpen(true);
                            setOrderIdToUpdate(order.id);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="flex h-8 items-center justify-center whitespace-nowrap rounded-md bg-registerButton px-5 font-semibold text-white disabled:bg-opacity-40"
                          disabled={isEditMode !== index}
                          onClick={() => {
                            // setMediumNameToMatch(order.mediumName);
                            // setSettlementCompanyNameToMatch(
                            //   order.settlementCompanyName,
                            // );
                            setPurchasePlaceToMatch(order.purchasePlace);
                            setSalesPlaceToMatch(order.salesPlace);
                            setIsMatchingButtonClicked(true);
                            // handleRegisterOrderMatchingButtonClick();
                            // setIsRegisterOrderMatchingModalOpen(true);
                          }}
                        >
                          등록
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="h-10 bg-[#EBE5FC]">
                  <td className="border border-black text-center font-semibold">
                    합
                  </td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalPurchasePrice}
                  </td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalSalesPrice}
                  </td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalPurchaseShippingFee}
                  </td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalSalesShippingFee}
                  </td>
                  <td className="border border-black text-center">-</td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalMarginAmount}
                  </td>
                  <td className="border border-black text-center font-semibold">
                    {orderList?.totalShippingDifference}
                  </td>
                  <td className="border border-black text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateOrderModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-fit w-fit flex-col items-center rounded-md bg-white px-10 py-8">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleExcelModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-2xl font-bold">주문값 등록</h2>
            <div className="mt-7 flex items-center justify-center gap-10">
              <div className="flex w-fit flex-col flex-wrap items-center justify-center gap-6">
                {/* 상품명 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    상품명
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setProductNameIndex(e.target.value)}
                    value={productNameIndex || ""}
                  >
                    <option value="">상품명</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 수량 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    수량
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setQuantityIndex(e.target.value)}
                    value={quantityIndex || ""}
                  >
                    <option value="">수량</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 발주일자 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    발주일자
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setOrderDateIndex(e.target.value)}
                    value={orderDateIndex || ""}
                  >
                    <option value="">발주일자</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 매입처 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    매입처
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setPurchasePlaceIndex(e.target.value)}
                    value={purchasePlaceIndex || ""}
                  >
                    <option value="">매입처</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 매출처 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    매출처
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setSalesPlaceIndex(e.target.value)}
                    value={salesPlaceIndex || ""}
                  >
                    <option value="">매출처</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 과세 여부 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    과세 여부
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setTaxTypeIndex(e.target.value)}
                    value={taxTypeIndex || ""}
                  >
                    <option value="">과세 여부</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 매입가 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    매입가
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setPurchasePriceIndex(e.target.value)}
                    value={purchasePriceIndex || ""}
                  >
                    <option value="">매입가</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 판매가 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    판매가
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setSalesPriceIndex(e.target.value)}
                    value={salesPriceIndex || ""}
                  >
                    <option value="">판매가</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 매입 배송비 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    매입 배송비
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) =>
                      setPurchaseShippingFeeIndex(e.target.value)
                    }
                    value={purchaseShippingFeeIndex || ""}
                  >
                    <option value="">매입 배송비</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 매출 배송비 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    매출 배송비
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setSalesShippingFeeIndex(e.target.value)}
                    value={salesShippingFeeIndex || ""}
                  >
                    <option value="">매출 배송비</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet || ""}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {excelFile ? (
                <div className="mt-6 flex h-96 w-96 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-solid border-black">
                  <div className="flex h-28 w-28 items-center justify-center">
                    <img src={excelLogoIcon} alt="" className="" />
                  </div>
                  <span className="text-lg font-semibold">
                    {excelFile.name}
                  </span>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="mt-6 flex h-96 w-96 cursor-pointer items-center justify-center rounded-md border border-solid border-black"
                >
                  <input {...getInputProps()} className="h-full w-full" />
                  {isDragActive ? (
                    <p className="text-base font-medium">파일을 놓아주세요</p>
                  ) : (
                    <p className="text-base font-medium">
                      엑셀 파일을 드래그하거나
                      <br />
                      클릭하여 업로드해주세요
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleCreateOrderButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}

      {isUpdateOrderModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-updateModal w-updateModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsUpdateOrderModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">주문값 수정</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={updateOrder.mediumName || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        mediumName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  정산업체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={updateOrder.settlementCompanyName || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        settlementCompanyName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  상품명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={updateOrder.productName || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        productName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  수량
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="number"
                    className="h-full w-full"
                    value={updateOrder.quantity || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        quantity: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  발주일자
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="date"
                    className="h-full w-full"
                    value={updateOrder.orderDate || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        orderDate: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매입처
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={updateOrder.purchasePlace || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        purchasePlace: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매출처
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={updateOrder.salesPlace || ""}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        salesPlace: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매입가
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="number"
                    className="h-full w-full"
                    value={updateOrder.purchasePrice || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        purchasePrice: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  판매가
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="number"
                    className="h-full w-full"
                    value={updateOrder.salesPrice || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        salesPrice: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매입 배송비
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="number"
                    className="h-full w-full"
                    value={updateOrder.purchaseShippingFee || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        purchaseShippingFee: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매출 배송비
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="number"
                    className="h-full w-full"
                    value={updateOrder.salesShippingFee || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        salesShippingFee: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  과세 여부
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <select
                    className="h-full w-full px-2"
                    value={Number(updateOrder.taxType) || 0}
                    onChange={(e) => {
                      setUpdateOrder({
                        ...updateOrder,
                        taxType: Number(e.target.value),
                      });
                    }}
                  >
                    <option value="11">과세</option>
                    <option value="12">면세</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleUpdateOrderButtonClick}
            >
              수정
            </button>
          </div>
        </div>
      )}

      {isRegisterOrderMatchingModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-registerModal w-registerModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsRegisterOrderMatchingModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">주문 매칭 등록</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={mediumNameToMatch || ""}
                    onChange={(e) => {
                      setMediumNameToMatch(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  정산업체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                  <input
                    type="text"
                    className="h-full w-full"
                    value={settlementCompanyNameToMatch || ""}
                    onChange={(e) => {
                      setSettlementCompanyNameToMatch(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매입처
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={purchasePlaceToMatch || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매출처
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={salesPlaceToMatch || ""}
                    disabled
                  />
                </div>
              </div>
            </div>
            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleRegisterOrderMatchingButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}

      {isExcelResponseLoading && <LoadingSpinner />}
      {isDeleting && <LoadingSpinner />}
      {isTableLoading && <LoadingSpinner />}
    </>
  );
}

export default OrderListContent;
