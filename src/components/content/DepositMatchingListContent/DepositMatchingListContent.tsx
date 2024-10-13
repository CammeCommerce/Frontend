import { useEffect, useState } from "react";
import {
  fetchDepositMatchingListAll,
  FetchDepositMatchingListAllResponse,
  fetchDepositMatchingListSearch,
} from "../../../api/deposit/deposit";

function DepositMatchingListContent() {
  const [depositMatchingList, setDepositMatchingList] =
    useState<FetchDepositMatchingListAllResponse>(); // 입금 매칭리스트

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 검색 버튼 클릭 핸들러
  function handleSearchButtonClick() {
    fetchDepositMatchingListSearch({
      startDate: startDate,
      endDate: endDate,
      periodType: periodType,
      mediumName: mediumName,
      searchQuery: searchQuery,
    })
      .then((response) => {
        setDepositMatchingList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchDepositMatchingListAll()
      .then((response) => {
        setDepositMatchingList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">입금 매칭리스트</h2>
        <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
          <div className="flex items-center gap-5">
            <span className="">발주일자검색</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className=""
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="">~</span>
              <input
                type="date"
                className=""
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("")}
              >
                전체
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("어제")}
              >
                어제
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("지난 3일")}
              >
                지난 3일
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("일주일")}
              >
                일주일
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("1개월")}
              >
                1개월
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setPeriodType("3개월")}
              >
                3개월
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
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
                  onChange={(e) => setMediumName(e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="">매체명_1</option>
                  <option value="">매체명_2</option>
                  <option value="">매체명_3</option>
                  <option value="">매체명_4</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="">검색</span>
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
            >
              선택 삭제
            </button>
          </div>
        </div>
        <div className="mt-2 h-fit w-full">
          <table className="w-full table-fixed border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">
                  <input type="checkbox" className="" />
                </th>
                <th className="border border-black">No</th>
                <th className="border border-black">매체명</th>
                <th className="border border-black">계좌별칭</th>
                <th className="border border-black">용도</th>
              </tr>
            </thead>
            <tbody>
              {depositMatchingList?.items.map((item, index) => (
                <tr key={index} className="h-10">
                  <td className="border border-black text-center">
                    <input type="checkbox" className="" />
                  </td>
                  <td className="border border-black text-center">{item.id}</td>
                  <td className="border border-black text-center">
                    {item.mediumName}
                  </td>
                  <td className="border border-black text-center">
                    {item.accountAlias}
                  </td>
                  <td className="border border-black text-center">
                    {item.purpose}
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

export default DepositMatchingListContent;
