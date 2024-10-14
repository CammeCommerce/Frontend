import { useCallback, useEffect, useState } from "react";
import {
  deleteOrderListMany,
  downloadOrderListExcel,
  fetchOrderListAll,
  FetchOrderListAllResponse,
  fetchOrderListSearch,
  registerOrderMatching,
  sortOrderList,
  updateOrderListOne,
  uploadOrder,
} from "../../../api/order/order";
import { useDropzone } from "react-dropzone";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";
import { AxiosError } from "axios";

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
  const [orderList, setOrderList] = useState<FetchOrderListAllResponse>(); // 주문 리스트

  const [orderIdToUpdate, setOrderIdToUpdate] = useState<number>(-1); // 수정할 주문값의 ID
  const [mediumNameToMatch, setMediumNameToMatch] = useState<string>(""); // 매칭할 매체명
  const [settlementCompanyNameToMatch, setSettlementCompanyNameToMatch] =
    useState<string>(""); // 매칭할 정산업체명
  const [purchasePlaceToMatch, setPurchasePlaceToMatch] = useState<string>(""); // 매칭할 매입처
  const [salesPlaceToMatch, setSalesPlaceToMatch] = useState<string>(""); // 매칭할 매출처
  const [fieldToSort, setFieldToSort] = useState<string>(""); // 정렬할 필드
  const [isDescend, setIsDescend] = useState<string>(""); // 내림차순 여부

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
  const [isMediumMatched, setIsMediumMatched] = useState<string>("전체"); // 매체명 매칭여부
  const [settlementCompanyName, setSettlementCompanyName] =
    useState<string>(""); // 정산업체명
  const [isSettlementCompanyMatched, setIsSettlementCompanyMatched] =
    useState<string>("전체"); // 정산업체명 매칭여부
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

  // 주문값 등록 버튼 클릭 이벤트
  function handleCreateOrderButtonClick() {
    if (excelFile) {
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
        })
        .catch((error: AxiosError) => {
          console.error(error);
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
        setOrderList(response);
      })
      .catch((error) => {
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
    deleteOrderListMany(orderIdsToDelete)
      .then(() => {
        setOrderIdsToDelete([]);
      })
      .catch((error) => {
        console.error(error);
      });
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchOrderListAll()
      .then((response) => {
        setOrderList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 정렬 필드 변경 시 실행
  useEffect(() => {
    if (fieldToSort && isDescend) {
      sortOrderList(fieldToSort, isDescend)
        .then((response) => {
          setOrderList(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [fieldToSort, isDescend]);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">주문 리스트</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="">발주일자검색</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className=""
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
                <span className="">~</span>
                <input
                  type="date"
                  className=""
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`${periodType === "" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("")}
                >
                  전체
                </button>
                <button
                  type="button"
                  className={`${periodType === "어제" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("어제")}
                >
                  어제
                </button>
                <button
                  type="button"
                  className={`${periodType === "지난 3일" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("지난 3일")}
                >
                  지난 3일
                </button>
                <button
                  type="button"
                  className={`${periodType === "일주일" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("일주일")}
                >
                  일주일
                </button>
                <button
                  type="button"
                  className={`${periodType === "1개월" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("1개월")}
                >
                  1개월
                </button>
                <button
                  type="button"
                  className={`${periodType === "3개월" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("3개월")}
                >
                  3개월
                </button>
                <button
                  type="button"
                  className={`${periodType === "6개월" ? "bg-primaryButton text-white" : "border border-solid border-primaryButton text-primaryButton"} flex h-10 items-center justify-center whitespace-nowrap rounded-md px-5 font-semibold`}
                  onClick={() => setPeriodType("6개월")}
                >
                  6개월
                </button>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="">매체명</span>
                  <select
                    className="h-8 w-60 border border-solid border-black text-center"
                    onChange={(e) => {
                      setMediumName(e.target.value);
                    }}
                  >
                    <option value="">전체</option>
                    <option value="">매체명_1</option>
                    <option value="">매체명_2</option>
                    <option value="">매체명_3</option>
                    <option value="">매체명_4</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="">매체명 매칭여부</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="mediumMatching"
                        value="전체"
                        className=""
                        checked={isMediumMatched === "전체"}
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
                        value="완료"
                        className=""
                        checked={isMediumMatched === "완료"}
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
                        value="미매칭"
                        className=""
                        checked={isMediumMatched === "미매칭"}
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
                  <span className="">정산업체명</span>
                  <select
                    className="h-8 w-60 border border-solid border-black text-center"
                    onChange={(e) => {
                      setSettlementCompanyName(e.target.value);
                    }}
                  >
                    <option value="">전체</option>
                    <option value="">정산업체명_1</option>
                    <option value="">정산업체명_2</option>
                    <option value="">정산업체명_3</option>
                    <option value="">정산업체명_4</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="">정산업체명 매칭여부</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="settlementCompanyMatching"
                        value="전체"
                        className=""
                        checked={isSettlementCompanyMatched === "전체"}
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
                        value="완료"
                        className=""
                        checked={isSettlementCompanyMatched === "완료"}
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
                        value="미매칭"
                        className=""
                        checked={isSettlementCompanyMatched === "미매칭"}
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
              <span className="">검색</span>
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
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primaryButton px-5 font-semibold text-white"
                  onClick={handleSearchButtonClick}
                >
                  검색하기
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-solid border-primaryButton px-5 font-semibold text-primaryButton"
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
                onClick={() => setIsCreateOrderModalOpen(true)}
              >
                주문값 등록
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
                disabled={orderIdsToDelete.length === 0}
                onClick={handleDeleteOrderButtonClick}
              >
                선택 삭제
              </button>
              <select
                name="fieldToSort"
                id=""
                className="border border-solid border-black text-center"
                onChange={(e) => {
                  setFieldToSort(e.target.value);
                }}
              >
                <option value="">리스트명</option>
                {ORDERLIST_HEADER.map((header, index) => (
                  <option key={index} value={Object.values(header)[0]}>
                    {Object.keys(header)[0]}
                  </option>
                ))}
              </select>
              <select
                name="isDescend"
                id=""
                className="border border-solid border-black text-center"
                onChange={(e) => {
                  setIsDescend(e.target.value);
                }}
              >
                <option value="">정렬방식</option>
                <option value="asc">오름차순</option>
                <option value="desc">내림차순</option>
              </select>
            </div>
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              onClick={handleExcelDownloadButtonClick}
            >
              엑셀 다운로드
            </button>
          </div>
          <div className="mt-2 h-fit w-full">
            <table className="w-full table-fixed border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="border border-black">
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
                      {order.id}
                    </td>
                    <td className="border border-black text-center">
                      {order.mediumName}
                    </td>
                    <td className="border border-black text-center">
                      {order.settlementCompanyName}
                    </td>
                    <td className="border border-black text-center">
                      {order.productName}
                    </td>
                    <td className="border border-black text-center">
                      {order.quantity}
                    </td>
                    <td className="border border-black text-center">
                      {order.orderDate}
                    </td>
                    <td className="border border-black text-center">
                      {order.purchasePlace}
                    </td>
                    <td className="border border-black text-center">
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
                    <td className="border border-black text-center">
                      <div className="flex w-full items-center justify-center gap-2">
                        <button
                          type="button"
                          className="border border-solid border-black bg-gray-300"
                          onClick={() => {
                            setIsUpdateOrderModalOpen(true);
                            setOrderIdToUpdate(order.id);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="border border-solid border-black bg-gray-300"
                          onClick={() => {
                            setPurchasePlaceToMatch(order.purchasePlace);
                            setSalesPlaceToMatch(order.salesPlace);
                            setIsRegisterOrderMatchingModalOpen(true);
                          }}
                        >
                          등록
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full table-fixed bg-gray-200">
              <tbody>
                <tr className="h-10">
                  <td className="border border-black text-center">합계</td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center">
                    {orderList?.totalPurchasePrice}
                  </td>
                  <td className="border border-black text-center">
                    {orderList?.totalSalesPrice}
                  </td>
                  <td className="border border-black text-center">
                    {orderList?.totalPurchaseShippingFee}
                  </td>
                  <td className="border border-black text-center">
                    {orderList?.totalSalesShippingFee}
                  </td>
                  <td className="border border-black text-center"></td>
                  <td className="border border-black text-center">
                    {orderList?.totalMarginAmount}
                  </td>
                  <td className="border border-black text-center">
                    {orderList?.totalShippingDifference}
                  </td>
                  <td className="border border-black text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateOrderModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-excelModal w-excelModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleExcelModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">주문값 등록</h2>
            <div className="mt-7 flex w-2/3 flex-wrap justify-center gap-6">
              {/* 상품명 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setProductNameIndex(e.target.value)}
              >
                <option value="">상품명</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 수량 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setQuantityIndex(e.target.value)}
              >
                <option value="">수량</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 발주일자 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setOrderDateIndex(e.target.value)}
              >
                <option value="">발주일자</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 매입처 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setPurchasePlaceIndex(e.target.value)}
              >
                <option value="">매입처</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 매출처 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setSalesPlaceIndex(e.target.value)}
              >
                <option value="">매출처</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 과세 여부 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setTaxTypeIndex(e.target.value)}
              >
                <option value="">과세 여부</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 매입가 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setPurchasePriceIndex(e.target.value)}
              >
                <option value="">매입가</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 판매가 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setSalesPriceIndex(e.target.value)}
              >
                <option value="">판매가</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 매입 배송비 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setPurchaseShippingFeeIndex(e.target.value)}
              >
                <option value="">매입 배송비</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 매출 배송비 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setSalesShippingFeeIndex(e.target.value)}
              >
                <option value="">매출 배송비</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>
            </div>
            {excelFile ? (
              <div className="flex h-96 w-96 flex-col items-center justify-center gap-4 border border-solid border-black">
                <div className="flex h-28 w-28 items-center justify-center">
                  <img src={excelLogoIcon} alt="" className="" />
                </div>
                <span className="text-lg font-semibold">{excelFile.name}</span>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="flex h-96 w-96 items-center justify-center border border-solid border-black"
              >
                <input {...getInputProps()} className="h-full w-full" />
                {isDragActive ? (
                  <p>파일을 놓아주세요</p>
                ) : (
                  <p>엑셀 파일을 드래그하거나 클릭하여 업로드해주세요</p>
                )}
              </div>
            )}

            <button
              className="absolute bottom-2 right-2 flex bg-gray-200 px-5 py-1"
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
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-4">
              <div className="flex w-full items-center gap-4">
                <span className="">매체명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      mediumName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">정산업체명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      settlementCompanyName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">상품명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      productName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">수량</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      quantity: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">발주일자</span>
                <input
                  type="date"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      orderDate: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매입처</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      purchasePlace: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매출처</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      salesPlace: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매입가</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      purchasePrice: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">판매가</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      salesPrice: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매입 배송비</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      purchaseShippingFee: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매출 배송비</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateOrder({
                      ...updateOrder,
                      salesShippingFee: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">과세 여부</span>
                <select
                  className="w-96 border border-solid border-black"
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

            <button
              className="absolute bottom-2 right-2 flex bg-gray-200 px-5 py-1"
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
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-4">
              <div className="flex w-full items-center gap-4">
                <span className="">매체명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setMediumNameToMatch(e.target.value);
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">정산업체명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setSettlementCompanyNameToMatch(e.target.value);
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매입처</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  value={purchasePlaceToMatch}
                  disabled
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">매출처</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  value={salesPlaceToMatch}
                  disabled
                />
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex bg-gray-200 px-5 py-1"
              onClick={handleRegisterOrderMatchingButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderListContent;
