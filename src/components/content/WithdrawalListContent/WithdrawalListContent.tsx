import { useCallback, useEffect, useState } from "react";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";
import { useDropzone } from "react-dropzone";
import {
  deleteWithdrawalListMany,
  downloadWithdrawalListExcel,
  fetchWithdrawalExcelColumnIndex,
  fetchWithdrawalListAll,
  FetchWithdrawalListAllResponse,
  fetchWithdrawalListSearch,
  fetchWithdrawalOne,
  registerWithdrawalMatching,
  updateWithdrawalOne,
  uploadWithdrawal,
  // WithdrawalList,
} from "../../../api/withdrawal/withdrawal";
import { AxiosError } from "axios";
import { fetchCompanyAll } from "../../../api/medium/medium";
import LoadingSpinner from "../../LoadingSpinner";

/* prettier-ignore */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // 알파벳 배열

function WithdrawalListContent() {
  const [withdrawalList, setWithdrawalList] =
    useState<FetchWithdrawalListAllResponse>({
      items: [],
    }); // 출금 리스트
  const [companyList, setCompanyList] = useState<string[]>(); // 매체명 리스트

  const [isCreateWithdrawalModalOpen, setIsCreateWithdrawalModalOpen] =
    useState<boolean>(false); // 출금값 등록 모달 오픈 상태

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [isMediumMatched, setIsMediumMatched] = useState<string>(""); // 매체명 매칭여부
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 등록 모달 관련 상태
  const [accountAliasToMatch, setAccountAliasToMatch] = useState<string>(""); // 매칭할 계좌별칭
  const [purposeToMatch, setPurposeToMatch] = useState<string>(""); // 매칭할 용도
  const [mediumNameToMatch, setMediumNameToMatch] = useState<string>(""); // 매칭할 매체명
  const [
    isRegisterWithdrawalMatchingModalOpen,
    setIsRegisterWithdrawalMatchingModalOpen,
  ] = useState<boolean>(false); // 등록 모달 오픈 상태

  const [isExcelResponseLoading, setIsExcelResponseLoading] =
    useState<boolean>(false); // 엑셀 응답 로딩 상태
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // 삭제 중 로딩 상태
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false); // 테이블 로딩 상태

  // 수정 모달 관련 상태
  const [isUpdateWithdrawalModalOpen, setIsUpdateWithdrawalModalOpen] =
    useState<boolean>(false); // 수정 모달 오픈 상태
  const [withdrawalIdToUpdate, setWithdrawalIdToUpdate] = useState<number>(-1); // 수정할 주문값 ID
  const [updateWithdrawal, setUpdateWithdrawal] = useState({
    mediumName: "",
    withdrawalDate: "",
    accountAlias: "",
    withdrawalAmount: 0,
    accountDescription: "",
    transactionMethod1: "",
    transactionMethod2: "",
    accountMemo: "",
    purpose: "",
    clientName: "",
  }); // 수정할 출금값

  // 엑셀 파일 관련 상태
  const [excelFile, setExcelFile] = useState<File>(); // 엑셀 파일
  const [withdrawalDateIndex, setWithdrawalDateIndex] = useState<string>(""); // 출금일자
  const [accountAliasIndex, setAccountAliasIndex] = useState<string>(""); // 계좌별칭
  const [withdrawalAmountIndex, setWithdrawalAmountIndex] =
    useState<string>(""); // 출금액
  const [accountDescriptionIndex, setAccountDescriptionIndex] =
    useState<string>(""); // 계좌적요
  const [transactionMethod1Index, setTransactionMethod1Index] =
    useState<string>(""); // 거래수단1
  const [transactionMethod2Index, setTransactionMethod2Index] =
    useState<string>(""); // 거래수단2
  const [accountMemoIndex, setAccountMemoIndex] = useState<string>(""); // 계좌메모
  const [purposeIndex, setPurposeIndex] = useState<string>(""); // 용도
  const [clientNameIndex, setClientNameIndex] = useState<string>(""); // 거래처

  const [isEditMode, setIsEditMode] = useState<number | null>(null); // 수정 가능 여부
  const [isMatchingButtonClicked, setIsMatchingButtonClicked] =
    useState<boolean>(false); // 매칭 버튼 클릭 여부
  // const [editableWithdrawalList, setEditableWithdrawalList] = useState<
  //   WithdrawalList[]
  // >([]);

  // // 원본 데이터를 참조로 저장
  // const originalWithdrawalList = useRef<WithdrawalList[]>([]);

  const [withdrawalIdsToDelete, setWithdrawalIdsToDelete] = useState<number[]>(
    [],
  ); // 삭제할 출금값 ID 배열

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
    if (withdrawalIdsToDelete.length === withdrawalList?.items.length) {
      setWithdrawalIdsToDelete([]);
    } else {
      const allWithdrawalIds =
        withdrawalList?.items.map((withdrawal) => withdrawal.id) || [];
      setWithdrawalIdsToDelete(allWithdrawalIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(withdrawalId: number) {
    setWithdrawalIdsToDelete((prevWithdrawalIds) => {
      if (prevWithdrawalIds.includes(withdrawalId)) {
        return prevWithdrawalIds.filter((id) => id !== withdrawalId);
      } else {
        return [...prevWithdrawalIds, withdrawalId];
      }
    });
  }

  // 출금값 등록 모달 닫기 버튼 클릭 이벤트
  function handleExcelModalCloseButtonClick() {
    setIsCreateWithdrawalModalOpen(false);
    setExcelFile(undefined);
  }

  // 출금값 등록 버튼 클릭 이벤트
  function handleCreateWithdrawalButtonClick() {
    if (excelFile) {
      setIsExcelResponseLoading(true); // 엑셀 파일 업로드 중 로딩 상태
      uploadWithdrawal({
        file: excelFile,
        withdrawalDateIndex,
        accountAliasIndex,
        withdrawalAmountIndex,
        accountDescriptionIndex,
        transactionMethod1Index,
        transactionMethod2Index,
        accountMemoIndex,
        purposeIndex,
        clientNameIndex,
      })
        .then(() => {
          setIsCreateWithdrawalModalOpen(false);
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

  // 검색 버튼 클릭 이벤트
  function handleSearchButtonClick() {
    fetchWithdrawalListSearch({
      startDate,
      endDate,
      periodType,
      mediumName,
      isMediumMatched,
      searchQuery,
    })
      .then((response) => {
        setWithdrawalList(
          response ?? {
            items: [],
          },
        );
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.error(error);
      });
  }

  // // "전체 수정" 버튼 클릭 이벤트
  // function handleEditButtonClick() {
  //   setIsEditMode(true);
  //   setEditableWithdrawalList(withdrawalList.items); // 수정 가능한 데이터 복사
  //   originalWithdrawalList.current = JSON.parse(
  //     JSON.stringify(withdrawalList.items),
  //   ); // 원본 데이터 저장
  // }

  // // "저장" 버튼 클릭 이벤트
  // function handleSaveButtonClick() {
  //   // 수정된 데이터만 추출
  //   const modifiedWithdrawals = editableWithdrawalList.filter(
  //     (editableItem, index) => {
  //       const originalItem = originalWithdrawalList.current[index];
  //       return JSON.stringify(editableItem) !== JSON.stringify(originalItem);
  //     },
  //   );

  //   console.log("수정된 데이터:", modifiedWithdrawals); // 수정된 데이터 출력

  //   try {
  //     modifiedWithdrawals.forEach((modifiedWithdrawal) => {
  //       updateWithdrawalOne(modifiedWithdrawal.id, {
  //         mediumName: modifiedWithdrawal.mediumName,
  //         withdrawalDate: modifiedWithdrawal.withdrawalDate,
  //         accountAlias: modifiedWithdrawal.accountAlias,
  //         withdrawalAmount: modifiedWithdrawal.withdrawalAmount,
  //         accountDescription: modifiedWithdrawal.accountDescription,
  //         transactionMethod1: modifiedWithdrawal.transactionMethod1,
  //         transactionMethod2: modifiedWithdrawal.transactionMethod2,
  //         accountMemo: modifiedWithdrawal.accountMemo,
  //         purpose: modifiedWithdrawal.purpose,
  //         clientName: modifiedWithdrawal.clientName,
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
  //   field: keyof WithdrawalList,
  //   value: string,
  // ) {
  //   const updatedList = [...editableWithdrawalList];
  //   updatedList[index] = {
  //     ...updatedList[index],
  //     [field]: value,
  //   };
  //   setEditableWithdrawalList(updatedList);
  // }

  // 출금값 수정 버튼 클릭 이벤트
  function handleUpdateWithdrawalButtonClick() {
    updateWithdrawalOne(withdrawalIdToUpdate, updateWithdrawal)
      .then(() => {
        setIsUpdateWithdrawalModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 엑셀 다운로드 버튼 클릭 이벤트
  function handleExcelDownloadButtonClick() {
    downloadWithdrawalListExcel({
      startDate,
      endDate,
      periodType,
      mediumName,
      isMediumMatched,
      searchQuery,
    }).catch((error) => {
      console.error(error);
    });
  }

  // 선택 삭제 버튼 클릭 이벤트
  function handleDeleteSelectedButtonClick() {
    // 삭제할 항목이 없으면 알림창 띄우기
    if (withdrawalIdsToDelete.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    try {
      setIsDeleting(true); // 삭제 중 로딩 상태
      deleteWithdrawalListMany(withdrawalIdsToDelete)
        .then(() => {
          setIsDeleting(false); // 삭제 중 로딩 상태 해제
          setWithdrawalIdsToDelete([]);
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

  // 출금 매칭 등록 버튼 클릭 이벤트
  function handleRegisterWithdrawalMatchingButtonClick() {
    registerWithdrawalMatching({
      mediumName: mediumNameToMatch,
      accountAlias: accountAliasToMatch,
      purpose: purposeToMatch,
    })
      .then(() => {
        setMediumNameToMatch("");
        setAccountAliasToMatch("");
        setPurposeToMatch("");
        setIsRegisterWithdrawalMatchingModalOpen(false);
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

  // 출금값 등록 모달 열기 버튼 클릭 이벤트
  function handleCreateWithdrawalModalOpenButtonClick() {
    setIsCreateWithdrawalModalOpen(true);

    fetchWithdrawalExcelColumnIndex().then((response) => {
      if (response) {
        setWithdrawalDateIndex(response.withdrawalDateIdx);
        setAccountAliasIndex(response.accountAliasIdx);
        setWithdrawalAmountIndex(response.withdrawalAmountIdx);
        setAccountDescriptionIndex(response.accountDescriptionIdx);
        setTransactionMethod1Index(response.transactionMethod1Idx);
        setTransactionMethod2Index(response.transactionMethod2Idx);
        setAccountMemoIndex(response.accountMemoIdx);
        setPurposeIndex(response.purposeIdx);
        setClientNameIndex(response.clientNameIdx);
      }
    });
  }

  // 마운트 시 실행
  useEffect(() => {
    try {
      setIsTableLoading(true); // 테이블 로딩 상태
      fetchWithdrawalListAll()
        .then((response) => {
          setWithdrawalList(
            response ?? {
              items: [],
            },
          );
          setIsTableLoading(false); // 테이블 로딩 상태 해제
        })
        .catch((error: AxiosError) => {
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
  }, []);

  // 수정 모달 열기 시 실행
  useEffect(() => {
    if (withdrawalIdToUpdate !== -1) {
      fetchWithdrawalOne(withdrawalIdToUpdate).then((response) => {
        if (response) {
          setUpdateWithdrawal({
            mediumName: response.mediumName,
            withdrawalDate: response.withdrawalDate,
            accountAlias: response.accountAlias,
            withdrawalAmount: response.withdrawalAmount,
            accountDescription: response.accountDescription,
            transactionMethod1: response.transactionMethod1,
            transactionMethod2: response.transactionMethod2,
            accountMemo: response.accountMemo,
            purpose: response.purpose,
            clientName: response.clientName,
          });
        }
      });
    }
  }, [withdrawalIdToUpdate]);

  useEffect(() => {
    if (isMatchingButtonClicked) {
      handleRegisterWithdrawalMatchingButtonClick();
      setIsMatchingButtonClicked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMatchingButtonClicked, accountAliasToMatch, purposeToMatch]);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">출금 리스트</h2>
          <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
            <div className="flex items-center gap-5">
              <span className="font-semibold">발주일자검색</span>
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
                    {companyList?.map((company, index) => (
                      <option key={index} value={company}>
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
                        name="companyMatching"
                        value=""
                        className=""
                        checked={isMediumMatched === ""}
                        onChange={(e) => setIsMediumMatched(e.target.value)}
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="companyMatching"
                        value="true"
                        className=""
                        checked={isMediumMatched === "true"}
                        onChange={(e) => setIsMediumMatched(e.target.value)}
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="companyMatching"
                        value="false"
                        className=""
                        checked={isMediumMatched === "false"}
                        onChange={(e) => setIsMediumMatched(e.target.value)}
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
                onClick={handleCreateWithdrawalModalOpenButtonClick}
              >
                출금값 등록
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
                onClick={handleDeleteSelectedButtonClick}
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
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              onClick={handleExcelDownloadButtonClick}
            >
              엑셀 다운로드
            </button>
          </div>
          <div className="mb-10 mt-2 h-fit w-full overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead className="bg-gray-200">
                <tr className="h-10">
                  <th className="whitespace-nowrap border border-black px-1">
                    <input
                      type="checkbox"
                      className=""
                      onChange={handleSelectAllCheckboxChange}
                      checked={
                        withdrawalList?.items &&
                        withdrawalList.items.length > 0 &&
                        withdrawalIdsToDelete.length ===
                          withdrawalList.items.length
                      }
                    />
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    No
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    매체명
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    출금일자
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    계좌별칭
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    출금액
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    계좌적요
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    거래수단1
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    거래수단2
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    계좌메모
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    용도
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    거래처
                  </th>
                  <th className="whitespace-nowrap border border-black px-1">
                    수정
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawalList?.items.map((item, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black px-1 text-center">
                      <input
                        type="checkbox"
                        className=""
                        onChange={() => handleCheckboxChange(item.id)}
                        checked={withdrawalIdsToDelete.includes(item.id)}
                      />
                    </td>
                    <td className="border border-black px-1 text-center">
                      {withdrawalList.items.length - index}
                    </td>
                    <td
                      className={`${isEditMode === index || "px-1"} max-w-32 overflow-hidden whitespace-nowrap border border-black text-center`}
                      contentEditable={item.mediumName === null}
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
                      {item.mediumName}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.withdrawalDate}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.accountAlias}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.withdrawalAmount.toLocaleString()}
                    </td>
                    <td className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap border border-black px-1 text-center">
                      {item.accountDescription}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.transactionMethod1}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.transactionMethod2}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.accountMemo}
                    </td>
                    <td className="border border-black px-1 text-center">
                      {item.purpose}
                    </td>
                    <td className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap border border-black px-1 text-center">
                      {item.clientName}
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex w-full items-center justify-center gap-2 px-1">
                        <button
                          type="button"
                          className="flex items-center justify-center whitespace-nowrap rounded-md bg-editButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setWithdrawalIdToUpdate(item.id);
                            setIsUpdateWithdrawalModalOpen(true);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center whitespace-nowrap rounded-md bg-registerButton px-5 py-1 font-semibold text-white disabled:bg-opacity-40"
                          disabled={isEditMode !== index}
                          onClick={() => {
                            // setMediumNameToMatch(item.mediumName);
                            setAccountAliasToMatch(item.accountAlias);
                            setPurposeToMatch(item.purpose);
                            setIsMatchingButtonClicked(true);
                            // setIsRegisterWithdrawalMatchingModalOpen(true);
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
          </div>
        </div>
      </div>

      {isCreateWithdrawalModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-excelModal w-fit flex-col items-center rounded-md bg-white px-10 py-8">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleExcelModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-2xl font-bold">출금값 등록</h2>
            <div className="mt-7 flex items-center justify-center gap-10">
              <div className="flex w-fit flex-col flex-wrap items-center justify-center gap-6">
                {/* 출금일자 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    출금일자
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setWithdrawalDateIndex(e.target.value)}
                    value={withdrawalDateIndex}
                  >
                    <option value="">출금일자</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 계좌별칭 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    계좌별칭
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setAccountAliasIndex(e.target.value)}
                    value={accountAliasIndex}
                  >
                    <option value="">계좌별칭</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 출금액 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    출금액
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setWithdrawalAmountIndex(e.target.value)}
                    value={withdrawalAmountIndex}
                  >
                    <option value="">출금액</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 계좌적요 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    계좌적요
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setAccountDescriptionIndex(e.target.value)}
                    value={accountDescriptionIndex}
                  >
                    <option value="">계좌적요</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 거래수단1 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    거래수단1
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setTransactionMethod1Index(e.target.value)}
                    value={transactionMethod1Index}
                  >
                    <option value="">거래수단1</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 거래수단2 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    거래수단2
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setTransactionMethod2Index(e.target.value)}
                    value={transactionMethod2Index}
                  >
                    <option value="">거래수단2</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 계좌메모 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    계좌메모
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setAccountMemoIndex(e.target.value)}
                    value={accountMemoIndex}
                  >
                    <option value="">계좌메모</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 용도 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    용도
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setPurposeIndex(e.target.value)}
                    value={purposeIndex}
                  >
                    <option value="">용도</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 거래처 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-32 text-center text-lg font-semibold">
                    거래처
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setClientNameIndex(e.target.value)}
                    value={clientNameIndex}
                  >
                    <option value="">거래처</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
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
              onClick={handleCreateWithdrawalButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}

      {isUpdateWithdrawalModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-updateModal w-updateModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsUpdateWithdrawalModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">출금값 수정</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.mediumName}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        mediumName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  출금일자
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="date"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.withdrawalDate}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        withdrawalDate: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  계좌별칭
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.accountAlias}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        accountAlias: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  출금액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.withdrawalAmount}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        withdrawalAmount: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  계좌적요
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.accountDescription}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        accountDescription: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  거래수단1
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.transactionMethod1}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        transactionMethod1: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  거래수단2
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.transactionMethod2}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        transactionMethod2: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  계좌메모
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.accountMemo}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        accountMemo: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  용도
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.purpose}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        purpose: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  거래처
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateWithdrawal.clientName}
                    onChange={(e) => {
                      setUpdateWithdrawal({
                        ...updateWithdrawal,
                        clientName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleUpdateWithdrawalButtonClick}
            >
              수정
            </button>
          </div>
        </div>
      )}

      {isRegisterWithdrawalMatchingModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-registerModal w-registerModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsRegisterWithdrawalMatchingModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">출금 매칭 등록</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={mediumNameToMatch || ""}
                    onChange={(e) => {
                      setMediumNameToMatch(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  계좌별칭
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={accountAliasToMatch || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  용도
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={purposeToMatch || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleRegisterWithdrawalMatchingButtonClick}
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

export default WithdrawalListContent;
