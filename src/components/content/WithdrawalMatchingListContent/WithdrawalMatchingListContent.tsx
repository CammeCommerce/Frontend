import { useEffect, useState } from "react";
import {
  deleteWithdrawalMatchingListMany,
  fetchWithdrawalMatchingListAll,
  fetchWithdrawalMatchingListSearch,
  WithdrawalMatchingList,
} from "../../../api/withdrawal/withdrawal";
import { fetchCompanyAll } from "../../../api/medium/medium";

function WithdrawalMatchingListContent() {
  const [withdrawalMatchingList, setWithdrawalMatchingList] =
    useState<WithdrawalMatchingList>(); // 출금 매칭리스트
  const [companyList, setCompanyList] = useState<string[]>([]); // 매체명 리스트

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  const [withdrawalMatchingIdsToDelete, setWithdrawalMatchingIdsToDelete] =
    useState<number[]>([]); // 삭제할 출금 매칭리스트 ID 배열

  // 검색 버튼 클릭 핸들러
  function handleSearchButtonClick() {
    fetchWithdrawalMatchingListSearch({
      startDate: startDate,
      endDate: endDate,
      periodType: periodType,
      mediumName: mediumName,
      searchQuery: searchQuery,
    })
      .then((response) => {
        setWithdrawalMatchingList(response);
      })
      .catch((error) => {
        console.error(error);
        alert(error.response.data.message);
      });
  }

  // 체크박스 전체 선택 이벤트
  function handleSelectAllCheckboxChange() {
    if (
      withdrawalMatchingIdsToDelete.length ===
      withdrawalMatchingList?.items.length
    ) {
      setWithdrawalMatchingIdsToDelete([]);
    } else {
      const allWithdrawalMatchingIds =
        withdrawalMatchingList?.items.map(
          (withdrawalMatching) => withdrawalMatching.id,
        ) || [];
      setWithdrawalMatchingIdsToDelete(allWithdrawalMatchingIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(withdrawalMatchingId: number) {
    setWithdrawalMatchingIdsToDelete((prevWithdrawalMatchingIds) => {
      if (prevWithdrawalMatchingIds.includes(withdrawalMatchingId)) {
        return prevWithdrawalMatchingIds.filter(
          (id) => id !== withdrawalMatchingId,
        );
      } else {
        return [...prevWithdrawalMatchingIds, withdrawalMatchingId];
      }
    });
  }

  // 선택 삭제 버튼 클릭 핸들러
  function handleDeleteButtonClick() {
    if (withdrawalMatchingIdsToDelete.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    deleteWithdrawalMatchingListMany(withdrawalMatchingIdsToDelete)
      .then(() => {
        setWithdrawalMatchingIdsToDelete([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchWithdrawalMatchingListAll()
      .then((response) => {
        setWithdrawalMatchingList(response);
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
  }, []);

  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">출금 매칭리스트</h2>
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
              onClick={handleDeleteButtonClick}
            >
              선택 삭제
            </button>
          </div>
        </div>
        <div className="mt-2 h-fit w-full">
          <table className="w-full border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">
                  <input
                    type="checkbox"
                    className=""
                    onChange={handleSelectAllCheckboxChange}
                    checked={
                      withdrawalMatchingList?.items &&
                      withdrawalMatchingList.items.length > 0 &&
                      withdrawalMatchingIdsToDelete.length ===
                        withdrawalMatchingList.items.length
                    }
                  />
                </th>
                <th className="border border-black">No</th>
                <th className="border border-black">매체명</th>
                <th className="border border-black">계좌별칭</th>
                <th className="border border-black">용도</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalMatchingList?.items.map((item, index) => (
                <tr key={index} className="h-10">
                  <td className="border border-black text-center">
                    <input
                      type="checkbox"
                      className=""
                      onChange={() => handleCheckboxChange(item.id)}
                      checked={withdrawalMatchingIdsToDelete.includes(item.id)}
                    />
                  </td>
                  <td className="border border-black text-center">
                    {index + 1}
                  </td>
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

export default WithdrawalMatchingListContent;
