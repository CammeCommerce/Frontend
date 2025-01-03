import { useEffect, useState } from "react";
import {
  createOnlineListOne,
  deleteOnlineListMany,
  fetchOnlineListAll,
  fetchOnlineListOne,
  fetchOnlineListSearch,
  OnlineListResponse,
  updateOnlineListOne,
} from "../../../api/online/online";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import { fetchCompanyAll } from "../../../api/medium/medium";

function OnlineListContent() {
  const [onlineList, setOnlineList] = useState<OnlineListResponse>(); // 온라인 리스트
  const [companyList, setCompanyList] = useState<string[]>([]); // 매체명 리스트

  const [isCreateOnlineListModalOpen, setIsCreateOnlineListModalOpen] =
    useState<boolean>(false); // 주문값 등록 모달 오픈 상태

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumNameToSearch, setMediumNameToSearch] = useState<string>(""); // 매체명
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 추가 관련 상태
  const [salesMonth, setSalesMonth] = useState<string>(""); // 매출 발생 월
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [onlineCompanyName, setOnlineCompanyName] = useState<string>(""); // 온라인 업체명
  const [salesAmount, setSalesAmount] = useState<number>(0); // 매출액
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0); // 매입액
  const [marginAmount, setMarginAmount] = useState<number>(0); // 마진
  const [memo, setMemo] = useState<string>(""); // 메모

  // 수정 관련 상태
  const [isUpdateOnlineListModalOpen, setIsUpdateOnlineListModalOpen] =
    useState<boolean>(false); // 주문값 수정 모달 오픈 상태
  const [onlineListIdToUpdate, setOnlineListIdToUpdate] = useState<number>(-1); // 수정할 주문값 ID
  const [salesMonthToUpdate, setSalesMonthToUpdate] = useState<string>(""); // 매출 발생 월
  const [mediumNameToUpdate, setMediumNameToUpdate] = useState<string>(""); // 매체명
  const [onlineCompanyNameToUpdate, setOnlineCompanyNameToUpdate] =
    useState<string>(""); // 온라인 업체명
  const [salesAmountToUpdate, setSalesAmountToUpdate] = useState<number>(0); // 매출액
  const [purchaseAmountToUpdate, setPurchaseAmountToUpdate] =
    useState<number>(0); // 매입액
  const [marginAmountToUpdate, setMarginAmountToUpdate] = useState<number>(0); // 마진
  const [memoToUpdate, setMemoToUpdate] = useState<string>(""); // 메모

  const [onlineListIdsToDelete, setOnlineListIdsToDelete] = useState<number[]>(
    [],
  ); // 삭제할 온라인 리스트 ID 배열

  // 체크박스 전체 선택 이벤트
  function handleSelectAllCheckboxChange() {
    if (onlineListIdsToDelete.length === onlineList?.items.length) {
      setOnlineListIdsToDelete([]);
    } else {
      const allOnlineListIds =
        onlineList?.items.map((onelineList) => onelineList.id) || [];
      setOnlineListIdsToDelete(allOnlineListIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(onelineListId: number) {
    setOnlineListIdsToDelete((prevOnlineListIds) => {
      if (prevOnlineListIds.includes(onelineListId)) {
        return prevOnlineListIds.filter((id) => id !== onelineListId);
      } else {
        return [...prevOnlineListIds, onelineListId];
      }
    });
  }

  // 주문값 등록 모달 닫기 버튼 클릭 이벤트
  function handleCreateOnlineListModalCloseButtonClick() {
    setIsCreateOnlineListModalOpen(false);
  }

  // 추가 버튼 클릭 이벤트
  function handleCreateOnlineListButtonClick() {
    createOnlineListOne({
      salesMonth,
      mediumName,
      onlineCompanyName,
      salesAmount,
      purchaseAmount,
      marginAmount,
      memo,
    })
      .then(() => {
        setIsCreateOnlineListModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 수정 버튼 클릭 이벤트
  function handleUpdateOnlineListButtonClick() {
    updateOnlineListOne(onlineListIdToUpdate, {
      salesMonth: salesMonthToUpdate,
      mediumName: mediumNameToUpdate,
      onlineCompanyName: onlineCompanyNameToUpdate,
      salesAmount: salesAmountToUpdate,
      purchaseAmount: purchaseAmountToUpdate,
      marginAmount: marginAmountToUpdate,
      memo: memoToUpdate,
    })
      .then(() => {
        setIsUpdateOnlineListModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 검색 버튼 클릭 이벤트
  function handleSearchButtonClick() {
    fetchOnlineListSearch({
      startDate,
      endDate,
      periodType,
      mediumName: mediumNameToSearch,
      searchQuery,
    })
      .then((response) => {
        setOnlineList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 매출액 변경 핸들러 (매출액 변경 시 마진을 자동으로 계산)
  function handleSalesAmountChange(value: number) {
    setSalesAmount(value);
    setMarginAmount(value - purchaseAmount); // 마진 계산
  }

  // 매입액 변경 핸들러 (매입액 변경 시 마진을 자동으로 계산)
  function handlePurchaseAmountChange(value: number) {
    setPurchaseAmount(value);
    setMarginAmount(salesAmount - value); // 마진 계산
  }

  // 수정할 매출액 변경 핸들러 (매출액 변경 시 마진을 자동으로 계산)
  function handleSalesAmountToUpdateChange(value: number) {
    setSalesAmountToUpdate(value);
    setMarginAmountToUpdate(value - purchaseAmountToUpdate); // 마진 계산
  }

  // 수정할 매입액 변경 핸들러 (매입액 변경 시 마진을 자동으로 계산)
  function handlePurchaseAmountToUpdateChange(value: number) {
    setPurchaseAmountToUpdate(value);
    setMarginAmountToUpdate(salesAmountToUpdate - value); // 마진 계산
  }

  // 선택 삭제 버튼 클릭 이벤트
  function handleDeleteOnlineListButtonClick() {
    // 삭제할 항목이 없을 경우 알림
    if (onlineListIdsToDelete.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    deleteOnlineListMany(onlineListIdsToDelete)
      .then(() => {
        setOnlineListIdsToDelete([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchOnlineListAll()
      .then((response) => {
        setOnlineList(response);
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

  // 수정 모달 오픈 시 실행
  useEffect(() => {
    if (onlineListIdToUpdate !== -1) {
      fetchOnlineListOne(onlineListIdToUpdate).then((response) => {
        if (response) {
          setSalesMonthToUpdate(response.salesMonth);
          setMediumNameToUpdate(response.mediumName);
          setOnlineCompanyNameToUpdate(response.onlineCompanyName);
          setSalesAmountToUpdate(response.salesAmount);
          setPurchaseAmountToUpdate(response.purchaseAmount);
          setMarginAmountToUpdate(response.marginAmount);
          setMemoToUpdate(response.memo);
        }
      });
    }
  }, [onlineListIdToUpdate]);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">온라인 리스트</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="font-semibold">매출발생월검색</span>
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="font-semibold">~</span>
                <input
                  type="month"
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
                    onChange={(e) => setMediumNameToSearch(e.target.value)}
                  >
                    <option value="">전체</option>
                    {companyList.map((companyName, index) => (
                      <option key={index} value={companyName}>
                        {companyName}
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
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
                onClick={() => setIsCreateOnlineListModalOpen(true)}
              >
                행 추가
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
                onClick={handleDeleteOnlineListButtonClick}
              >
                선택 삭제
              </button>
            </div>
          </div>
          <div className="scrollbar-thin mt-2 h-fit w-full overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="border border-black">
                    <input
                      type="checkbox"
                      className=""
                      onChange={handleSelectAllCheckboxChange}
                      checked={
                        onlineList?.items &&
                        onlineList.items.length > 0 &&
                        onlineListIdsToDelete.length === onlineList.items.length
                      }
                    />
                  </th>
                  <th className="border border-black">No</th>
                  <th className="border border-black">매출 발생 월</th>
                  <th className="border border-black">매체명</th>
                  <th className="border border-black">온라인 업체명</th>
                  <th className="border border-black">매출액</th>
                  <th className="border border-black">매입액</th>
                  <th className="border border-black">마진</th>
                  <th className="border border-black">메모</th>
                  <th className="border border-black">관리</th>
                </tr>
              </thead>
              <tbody>
                {onlineList?.items.map((item, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      <input
                        type="checkbox"
                        className=""
                        onChange={() => handleCheckboxChange(item.id)}
                        checked={onlineListIdsToDelete.includes(item.id)}
                      />
                    </td>
                    <td className="border border-black text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black text-center">
                      {item.salesMonth}
                    </td>
                    <td className="border border-black text-center">
                      {item.mediumName}
                    </td>
                    <td className="border border-black text-center">
                      {item.onlineCompanyName}
                    </td>
                    <td className="border border-black text-center">
                      {item.salesAmount.toLocaleString()}
                    </td>
                    <td className="border border-black text-center">
                      {item.purchaseAmount.toLocaleString()}
                    </td>
                    <td className="border border-black text-center">
                      {item.marginAmount.toLocaleString()}
                    </td>
                    <td className="border border-black text-center">
                      {item.memo}
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="flex items-center justify-center whitespace-nowrap rounded-md bg-editButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setOnlineListIdToUpdate(item.id);
                            setIsUpdateOnlineListModalOpen(true);
                          }}
                        >
                          수정
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateOnlineListModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-excelModal w-excelModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleCreateOnlineListModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">온라인 리스트 추가</h2>
            <div className="mt-7 flex w-2/3 flex-wrap justify-center gap-10">
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  매출 발생 월
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="month"
                    className="h-full w-full px-2"
                    onChange={(e) => setSalesMonth(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    onChange={(e) => setMediumName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  온라인 업체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    onChange={(e) => setOnlineCompanyName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  매출액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    onChange={(e) =>
                      handleSalesAmountChange(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  매입액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    onChange={(e) =>
                      handlePurchaseAmountChange(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  마진
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={marginAmount}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-32 whitespace-nowrap text-lg font-semibold">
                  메모
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
                onClick={handleCreateOnlineListButtonClick}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateOnlineListModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-excelModal w-excelModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsUpdateOnlineListModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">온라인 리스트 수정</h2>
            <div className="mt-7 flex w-2/3 flex-wrap justify-center gap-10">
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매출 발생 월
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="month"
                    className="h-full w-full px-2"
                    value={salesMonthToUpdate}
                    onChange={(e) => setSalesMonthToUpdate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={mediumNameToUpdate}
                    onChange={(e) => setMediumNameToUpdate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  온라인
                  <br />
                  업체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={onlineCompanyNameToUpdate}
                    onChange={(e) =>
                      setOnlineCompanyNameToUpdate(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매출액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={salesAmountToUpdate}
                    onChange={(e) =>
                      handleSalesAmountToUpdateChange(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매입액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={purchaseAmountToUpdate}
                    onChange={(e) =>
                      handlePurchaseAmountToUpdateChange(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  마진
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={marginAmountToUpdate}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  메모
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={memoToUpdate}
                    onChange={(e) => setMemoToUpdate(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
                onClick={handleUpdateOnlineListButtonClick}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OnlineListContent;
