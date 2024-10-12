import { useCallback, useEffect, useState } from "react";
import {
  fetchOrderListAll,
  fetchOrderListAllResponse,
  uploadOrder,
} from "../../../api/order/order";
import { useDropzone } from "react-dropzone";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";

/* prettier-ignore */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // 알파벳 배열

function OrderListContent() {
  const [orderList, setOrderList] = useState<fetchOrderListAllResponse>(); // 주문 리스트

  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] =
    useState<boolean>(false); // 주문값 등록 모달 오픈 상태

  const [excelFile, setExcelFile] = useState<File>(); // 엑셀 파일

  // 드롭다운에서 선택된 값을 저장할 상태들
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

  // 주문값 등록 모달 닫기 버튼 클릭 이벤트
  function handleExcelModalCloseButtonClick() {
    setIsCreateOrderModalOpen(false);
    setExcelFile(undefined);
  }

  function handleCreateOrderButtonClick() {
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

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">주문 리스트</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="">발주일자검색</span>
              <div className="flex items-center gap-2">
                <input type="date" className="" />
                <span className="">~</span>
                <input type="date" className="" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  전체
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  어제
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  지난 3일
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  일주일
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  1개월
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  3개월
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  6개월
                </button>
              </div>
            </div>
            <div className="flex items-center gap-20">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="">매체명</span>
                  <select className="h-8 w-60 border border-solid border-black text-center">
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
                        name="matching"
                        value="전체"
                        className=""
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="matching"
                        value="완료"
                        className=""
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="matching"
                        value="미매칭"
                        className=""
                      />
                      미매칭
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="">정산업체명</span>
                  <select className="h-8 w-60 border border-solid border-black text-center">
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
                        name="matching"
                        value="전체"
                        className=""
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="matching"
                        value="완료"
                        className=""
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="matching"
                        value="미매칭"
                        className=""
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
                <input type="text" className="h-full w-full" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                >
                  검색하기
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
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
              >
                선택 삭제
              </button>
            </div>
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
            >
              엑셀 다운로드
            </button>
          </div>
          <div className="mt-2 h-fit w-full">
            <table className="mb-10 w-full table-fixed border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="border border-black">
                    <input type="checkbox" className="" />
                  </th>
                  <th className="border border-black">No</th>
                  <th className="border border-black">매체명</th>
                  <th className="border border-black">정산업체명</th>
                  <th className="border border-black">상품명</th>
                  <th className="border border-black">수량</th>
                  <th className="border border-black">발주일자</th>
                  <th className="border border-black">매입처</th>
                  <th className="border border-black">매출처</th>
                  <th className="border border-black">매입가</th>
                  <th className="border border-black">판매가</th>
                  <th className="border border-black">매입 배송비</th>
                  <th className="border border-black">매출 배송비</th>
                  <th className="border border-black">과세여부</th>
                  <th className="border border-black">마진액</th>
                  <th className="border border-black">배송차액</th>
                </tr>
              </thead>
              <tbody>
                {orderList?.items.map((order, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      <input type="checkbox" className="" />
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateOrderModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="w-excelModal h-excelModal relative flex flex-col items-center rounded-md bg-white px-10 py-4">
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
    </>
  );
}

export default OrderListContent;
