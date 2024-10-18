import { useEffect, useState } from "react";
import {
  deleteOrderMatchingListMany,
  fetchOrderMatchingListAll,
  FetchOrderMatchingListAllResponse,
  fetchOrderMatchingListSearch,
} from "../../../api/order/order";
import { fetchCompanyAll } from "../../../api/medium/medium";
import { fetchSettlementCompanyAll } from "../../../api/settlement-company/settlement-company";

function OrderMatchingListContent() {
  const [orderMatchingList, setOrderMatchingList] =
    useState<FetchOrderMatchingListAllResponse>();
  const [companyList, setCompanyList] = useState<string[]>([]); // 매체명 목록
  const [settlementCompanyList, setSettlementCompanyList] = useState<string[]>(
    [],
  ); // 정산업체명 목록

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [settlementCompanyName, setSettlementCompanyName] =
    useState<string>(""); // 정산업체명
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  const [orderMatchingIdsToDelete, setOrderMatchingIdsToDelete] = useState<
    number[]
  >([]); // 삭제할 주문 매칭 ID 목록

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearchButtonClick = () => {
    fetchOrderMatchingListSearch(
      startDate,
      endDate,
      periodType,
      mediumName,
      settlementCompanyName,
      searchQuery,
    )
      .then((response) => {
        setOrderMatchingList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 체크박스 전체 선택 이벤트
  function handleSelectAllCheckboxChange() {
    if (orderMatchingIdsToDelete.length === orderMatchingList?.items.length) {
      setOrderMatchingIdsToDelete([]);
    } else {
      const allOrderMatchingIds =
        orderMatchingList?.items.map((orderMatching) => orderMatching.id) || [];
      setOrderMatchingIdsToDelete(allOrderMatchingIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(orderMatchingId: number) {
    setOrderMatchingIdsToDelete((prevOrderMatchingIds) => {
      if (prevOrderMatchingIds.includes(orderMatchingId)) {
        return prevOrderMatchingIds.filter((id) => id !== orderMatchingId);
      } else {
        return [...prevOrderMatchingIds, orderMatchingId];
      }
    });
  }

  // 선택 삭제 버튼 클릭 이벤트
  function handleDeleteButtonClick() {
    deleteOrderMatchingListMany(orderMatchingIdsToDelete)
      .then(() => {
        setOrderMatchingIdsToDelete([]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchOrderMatchingListAll()
      .then((response) => {
        setOrderMatchingList(response);
      })
      .catch((error) => {
        console.error(error);
      });

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

  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">주문 매칭리스트</h2>
        <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
          <div className="flex items-center gap-5">
            <span className="font-semibold">최초매칭일자검색</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="font-semibold">~</span>
              <input
                type="date"
                className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                onChange={(e) => setEndDate(e.target.value)}
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
                  onChange={(e) => setMediumName(e.target.value)}
                >
                  <option value="">전체</option>
                  {companyList.map((company, index) => (
                    <option key={index} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="font-semibold">정산업체명</span>
                <select
                  className="h-8 w-60 border border-solid border-black text-center"
                  onChange={(e) => setSettlementCompanyName(e.target.value)}
                >
                  <option value="">전체</option>
                  {settlementCompanyList.map((settlementCompany, index) => (
                    <option key={index} value={settlementCompany}>
                      {settlementCompany}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-semibold">검색</span>
            <div className="h-10 w-96 rounded-md border border-solid border-black px-3">
              <input
                type="text"
                className="h-full w-full"
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <button
            type="button"
            className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
            disabled={orderMatchingIdsToDelete.length === 0}
            onClick={handleDeleteButtonClick}
          >
            선택 삭제
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
                      orderMatchingList?.items &&
                      orderMatchingList.items.length > 0 &&
                      orderMatchingIdsToDelete.length ===
                        orderMatchingList.items.length
                    }
                  />
                </th>
                <th className="border border-black">No</th>
                <th className="border border-black">매체명</th>
                <th className="border border-black">정산업체명</th>
                <th className="border border-black">매입처</th>
                <th className="border border-black">매출처</th>
              </tr>
            </thead>
            <tbody>
              {orderMatchingList?.items.map((orderMatching, index) => (
                <tr key={index} className="h-10">
                  <td className="border border-black text-center">
                    <input
                      type="checkbox"
                      className=""
                      onChange={() => handleCheckboxChange(orderMatching.id)}
                      checked={orderMatchingIdsToDelete.includes(
                        orderMatching.id,
                      )}
                    />
                  </td>
                  <td className="border border-black text-center">
                    {orderMatching.id}
                  </td>
                  <td className="border border-black text-center">
                    {orderMatching.mediumName}
                  </td>
                  <td className="border border-black text-center">
                    {orderMatching.settlementCompanyName}
                  </td>
                  <td className="border border-black text-center">
                    {orderMatching.purchasePlace}
                  </td>
                  <td className="border border-black text-center">
                    {orderMatching.salesPlace}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderMatchingListContent;
