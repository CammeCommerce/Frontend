import { useEffect, useState } from "react";
import {
  createCompanyOne,
  deleteCompanyOne,
  fetchCompanyAll,
  FetchCompanyAllResponse,
  fetchCompanySearch,
  updateCompanyOne,
} from "../../../api/medium/medium";
import closeIcon from "/assets/icon/svg/Close_round.svg";

function CompanyManagementContent() {
  const [companyList, setCompanyList] = useState<FetchCompanyAllResponse>(); // 매체관리 리스트

  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState<boolean>(false); // 매체 등록 모달 상태
  const [isUpdateCompanyModalOpen, setIsUpdateCompanyModalOpen] =
    useState<boolean>(false); // 매체 수정 모달 상태
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState<boolean>(false); // 매체 삭제 확인 모달 상태

  const [companyNameInput, setCompanyNameInput] = useState<string>(""); // 매체명 입력값
  const [companyNameToUpdate, setCompanyNameToUpdate] = useState<string>(""); // 수정할 매체명
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일
  const [inputQuery, setInputQuery] = useState<string>(""); // 검색 입력값
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간

  const [companyIdToUpdate, setCompanyIdToUpdate] = useState<number>(-1); // 수정할 매체 ID
  const [companyIdToDelete, setCompanyIdToDelete] = useState<number>(-1); // 삭제할 매체 ID

  // 매체명 입력값 변경 함수
  function handleCompanyNameInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCompanyNameInput(e.target.value);
  }

  // 수정할 매체명 입력값 변경 함수
  function handleCompanyNameToUpdateChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCompanyNameToUpdate(e.target.value);
  }

  // 검색 입력값 변경 함수
  function handleInputQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputQuery(e.target.value);
  }

  // 시작일 변경 함수
  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(e.target.value);
  }

  // 종료일 변경 함수
  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(e.target.value);
  }

  // 검색 버튼 클릭 핸들러
  function handleSearchButtonClick() {
    fetchCompanySearch(inputQuery, startDate, endDate, periodType)
      .then((response) => {
        setCompanyList(response);
      })
      .catch(() => {
        alert("매체 검색에 실패했습니다.");
      });
  }

  // 등록 모달 버튼 클릭 함수
  function handleCreateCompanyButtonClick() {
    createCompanyOne(companyNameInput);
    setIsCreateCompanyModalOpen(false);
    window.location.reload();
  }

  // 수정 모달 버튼 클릭 함수
  function handleUpdateCompanyButtonClick() {
    updateCompanyOne(companyIdToUpdate, companyNameToUpdate);
    setIsUpdateCompanyModalOpen(false);
    window.location.reload();
  }

  // 삭제 확인 모달 버튼 클릭 함수
  function handleDeleteCompanyButtonClick() {
    deleteCompanyOne(companyIdToDelete);
    setIsDeleteConfirmModalOpen(false);
    window.location.reload();
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchCompanyAll()
      .then((response) => {
        setCompanyList(response);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">매체관리</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="font-semibold">등록일자검색</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                  onChange={(e) => {
                    handleStartDateChange(e);
                  }}
                />
                <span className="font-semibold">~</span>
                <input
                  type="date"
                  className="h-9 w-40 border border-solid border-gray-400 bg-gray-200 px-4 text-center"
                  onChange={(e) => {
                    handleEndDateChange(e);
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
            <div className="flex items-center gap-5">
              <span className="font-semibold">검색</span>
              <div className="h-10 w-96 rounded-md border border-solid border-black px-3">
                <input
                  type="text"
                  className="h-full w-full"
                  onChange={(e) => {
                    handleInputQueryChange(e);
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
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              onClick={() => setIsCreateCompanyModalOpen(true)}
            >
              매체 등록
            </button>
          </div>
          <div className="mt-2 h-fit w-full">
            <table className="mb-10 w-full table-fixed border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="border border-black">매체명</th>
                  <th className="border border-black">등록일자</th>
                  <th className="border border-black">관리</th>
                </tr>
              </thead>
              <tbody>
                {companyList?.items.map((company, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      {company.name}
                    </td>
                    <td className="border border-black text-center">
                      {new Date(company.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-md bg-editButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setIsUpdateCompanyModalOpen(true);
                            setCompanyIdToUpdate(company.id);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-md bg-deleteButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setIsDeleteConfirmModalOpen(true);
                            setCompanyIdToDelete(company.id);
                          }}
                        >
                          삭제
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
      {isCreateCompanyModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-40 w-96 flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsCreateCompanyModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">매체명 등록</h2>
            <div className="mt-7 flex w-full items-center gap-5">
              <span className="whitespace-nowrap text-lg font-semibold">
                매체명
              </span>
              <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                <input
                  type="text"
                  className="h-full w-full"
                  onChange={handleCompanyNameInputChange}
                />
              </div>
            </div>
            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleCreateCompanyButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}

      {isUpdateCompanyModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-40 w-96 flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsUpdateCompanyModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">매체명 수정</h2>
            <div className="mt-7 flex w-full items-center gap-5">
              <span className="whitespace-nowrap text-lg font-semibold">
                매체명
              </span>
              <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black px-2">
                <input
                  type="text"
                  className="h-full w-full"
                  onChange={handleCompanyNameToUpdateChange}
                />
              </div>
            </div>
            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleUpdateCompanyButtonClick}
            >
              수정
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-32 w-80 flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsDeleteConfirmModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h1 className="text-lg font-bold">삭제하시겠습니까?</h1>
            <div className="mt-7 flex w-full items-center justify-center gap-5">
              <button
                type="button"
                className="rounded-md bg-gray-300 px-5 py-1 font-medium"
                onClick={() => setIsDeleteConfirmModalOpen(false)}
              >
                아니오
              </button>
              <button
                type="button"
                className="rounded-md bg-gray-300 px-5 py-1 font-medium"
                onClick={handleDeleteCompanyButtonClick}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyManagementContent;
