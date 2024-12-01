import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteDepositListMany,
  DepositList,
  downloadDepositListExcel,
  fetchDepositExcelColumnIndex,
  fetchDepositListAll,
  FetchDepositListAllResponse,
  fetchDepositListOne,
  fetchDepositListSearch,
  registerDepositMatching,
  updateDepositListOne,
  uploadDepositListExcel,
} from "../../../api/deposit/deposit";
import { useDropzone } from "react-dropzone";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";
import { fetchCompanyAll } from "../../../api/medium/medium";

/* prettier-ignore */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // 알파벳 배열

function DepositListContent() {
  const [depositList, setDepositList] = useState<FetchDepositListAllResponse>({
    items: [],
  }); // 입금 리스트
  const [companyList, setCompanyList] = useState<string[]>([]); // 매체명 리스트

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [isMediumMatched, setIsMediumMatched] = useState<string>("전체"); // 매체명 매칭여부
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 엑셀 모달 관련 상태
  const [excelFile, setExcelFile] = useState<File>(); // 엑셀 파일
  const [depositDateIndex, setDepositDateIndex] = useState<string>(""); // 입금일자
  const [accountAliasIndex, setAccountAliasIndex] = useState<string>(""); // 계좌별칭
  const [depositAmountIndex, setDepositAmountIndex] = useState<string>(""); // 입금액
  const [accountDescriptionIndex, setAccountDescriptionIndex] =
    useState<string>(""); // 계좌적요
  const [transactionMethod1Index, setTransactionMethod1Index] =
    useState<string>(""); // 거래수단1
  const [transactionMethod2Index, setTransactionMethod2Index] =
    useState<string>(""); // 거래수단2
  const [accountMemoIndex, setAccountMemoIndex] = useState<string>(""); // 계좌메모
  const [counterpartyNameIndex, setCounterpartyNameIndex] =
    useState<string>(""); // 상대계좌예금주명
  const [purposeIndex, setPurposeIndex] = useState<string>(""); // 용도
  const [clientNameIndex, setClientNameIndex] = useState<string>(""); // 거래처

  // 수정할 입금값 관련 상태
  const [depositIdToUpdate, setDepositIdToUpdate] = useState<number>(-1); // 수정할 입금값 ID

  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 수정 가능 여부
  const [editableDepositList, setEditableDepositList] = useState<DepositList[]>(
    [],
  );

  // 원본 데이터를 참조로 저장
  const originalDepositList = useRef<DepositList[]>([]);

  // 수정할 입금값
  const [updateDeposit, setUpdateDeposit] = useState({
    mediumName: "",
    depositDate: "",
    accountAlias: "",
    depositAmount: 0,
    accountDescription: "",
    transactionMethod1: "",
    transactionMethod2: "",
    accountMemo: "",
    counterpartyName: "",
    purpose: "",
    clientName: "",
  });

  // 등록할 매칭 관련 상태
  const [mediumNameToMatch, setMediumNameToMatch] = useState<string>(""); // 등록할 매체명
  const [accountAliasToMatch, setAccountAliasToMatch] = useState<string>(""); // 등록할 계좌별칭
  const [purposeToMatch, setPurposeToMatch] = useState<string>(""); // 등록할 용도

  const [isExcelResponseLoading, setIsExcelResponseLoading] =
    useState<boolean>(false); // 엑셀 응답 로딩 상태
  const [
    isRegisterDepositMatchingModalOpen,
    setIsRegisterDepositMatchingModalOpen,
  ] = useState<boolean>(false); // 매칭 등록 모달 오픈 상태

  const [isCreateDepositModalOpen, setIsCreateDepositModalOpen] =
    useState<boolean>(false); // 입금값 등록 모달 오픈 상태
  const [isUpdateDepositModalOpen, setIsUpdateDepositModalOpen] =
    useState<boolean>(false); // 입금값 수정 모달 오픈 상태

  const [depositIdsToDelete, setDepositIdsToDelete] = useState<number[]>([]); // 삭제할 입금값 ID 배열

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
    if (depositIdsToDelete.length === depositList?.items.length) {
      setDepositIdsToDelete([]);
    } else {
      const allDepositIds =
        depositList?.items.map((deposit) => deposit.id) || [];
      setDepositIdsToDelete(allDepositIds);
    }
  }

  // 개별 체크박스 선택 이벤트
  function handleCheckboxChange(depositId: number) {
    setDepositIdsToDelete((prevDepositIds) => {
      if (prevDepositIds.includes(depositId)) {
        return prevDepositIds.filter((id) => id !== depositId);
      } else {
        return [...prevDepositIds, depositId];
      }
    });
  }

  // 입금값 등록 모달 닫기 버튼 클릭 이벤트
  function handleExcelModalCloseButtonClick() {
    setIsCreateDepositModalOpen(false);
    setExcelFile(undefined);
  }

  // 주문값 등록 버튼 클릭 이벤트
  function handleCreateDepositButtonClick() {
    if (excelFile) {
      setIsExcelResponseLoading(true); // 엑셀 파일 업로드 중 로딩 상태
      uploadDepositListExcel({
        file: excelFile,
        depositDateIndex,
        accountAliasIndex,
        depositAmountIndex,
        accountDescriptionIndex,
        transactionMethod1Index,
        transactionMethod2Index,
        accountMemoIndex,
        counterpartyNameIndex,
        purposeIndex,
        clientNameIndex,
      })
        .then(() => {
          setIsCreateDepositModalOpen(false);
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

  // "전체 수정" 버튼 클릭 이벤트
  function handleEditButtonClick() {
    setIsEditMode(true);
    setEditableDepositList(depositList.items); // 수정 가능한 데이터 복사
    originalDepositList.current = JSON.parse(JSON.stringify(depositList.items)); // 원본 데이터 저장
  }

  // "저장" 버튼 클릭 이벤트
  function handleSaveButtonClick() {
    // 수정된 데이터만 추출
    const modifiedDeposits = editableDepositList.filter(
      (editableItem, index) => {
        const originalItem = originalDepositList.current[index];
        return JSON.stringify(editableItem) !== JSON.stringify(originalItem);
      },
    );

    console.log("수정된 데이터:", modifiedDeposits); // 수정된 데이터 출력

    try {
      modifiedDeposits.forEach((modifiedDeposit) => {
        updateDepositListOne(modifiedDeposit.id, {
          mediumName: modifiedDeposit.mediumName,
          depositDate: modifiedDeposit.depositDate,
          accountAlias: modifiedDeposit.accountAlias,
          depositAmount: modifiedDeposit.depositAmount,
          accountDescription: modifiedDeposit.accountDescription,
          transactionMethod1: modifiedDeposit.transactionMethod1,
          transactionMethod2: modifiedDeposit.transactionMethod2,
          accountMemo: modifiedDeposit.accountMemo,
          counterpartyName: modifiedDeposit.counterpartyName,
          purpose: modifiedDeposit.purpose,
          clientName: modifiedDeposit.clientName,
        }).catch((error) => {
          console.error(error);
        });
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
    }

    setIsEditMode(false);
  }

  // 값 수정 핸들러
  function handleEditableChange(
    index: number,
    field: keyof DepositList,
    value: string,
  ) {
    const updatedList = [...editableDepositList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    setEditableDepositList(updatedList);
  }

  // 주문값 수정 버튼 클릭 이벤트
  function handleUpdateDepositButtonClick() {
    updateDepositListOne(depositIdToUpdate, updateDeposit)
      .then(() => {
        setIsUpdateDepositModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 검색 버튼 클릭 이벤트
  function handleSearchButtonClick() {
    fetchDepositListSearch({
      startDate,
      endDate,
      periodType,
      mediumName,
      isMediumMatched,
      searchQuery,
    })
      .then((response) => {
        setDepositList(
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

  // 엑셀 다운로드 버튼 클릭 이벤트
  function handleExcelDownloadButtonClick() {
    downloadDepositListExcel({
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
  function handleDeleteDepositButtonClick() {
    // 삭제할 입금값이 없을 경우
    if (depositIdsToDelete.length === 0) {
      alert("삭제할 입금값을 선택해주세요.");
      return;
    }

    deleteDepositListMany(depositIdsToDelete)
      .then(() => {
        setDepositIdsToDelete([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 매칭 등록 버튼 클릭 이벤트
  function handleRegisterDepositMatchingButtonClick() {
    registerDepositMatching({
      mediumName: mediumNameToMatch,
      accountAlias: accountAliasToMatch,
      purpose: purposeToMatch,
    })
      .then(() => {
        setMediumNameToMatch("");
        setAccountAliasToMatch("");
        setPurposeToMatch("");
        setIsRegisterDepositMatchingModalOpen(false);
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

  // 입금값 등록 모달 열기 버튼 클릭 이벤트
  function handleCreateDepositModalOpenButtonClick() {
    setIsCreateDepositModalOpen(true);

    fetchDepositExcelColumnIndex().then((response) => {
      if (response) {
        setDepositDateIndex(response.depositDateIdx);
        setAccountAliasIndex(response.accountAliasIdx);
        setDepositAmountIndex(response.depositAmountIdx);
        setAccountDescriptionIndex(response.accountDescriptionIdx);
        setTransactionMethod1Index(response.transactionMethod1Idx);
        setTransactionMethod2Index(response.transactionMethod2Idx);
        setAccountMemoIndex(response.accountMemoIdx);
        setCounterpartyNameIndex(response.counterpartyNameIdx);
        setPurposeIndex(response.purposeIdx);
        setClientNameIndex(response.clientNameIdx);
      }
    });
  }

  // 마운트 시 실행
  useEffect(() => {
    fetchDepositListAll()
      .then((response) => {
        setDepositList(
          response ?? {
            items: [],
          },
        );
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

  // 수정 모달 열기 시 실행
  useEffect(() => {
    if (depositIdToUpdate !== -1) {
      fetchDepositListOne(depositIdToUpdate).then((response) => {
        if (response) {
          setUpdateDeposit({
            mediumName: response.mediumName,
            depositDate: response.depositDate,
            accountAlias: response.accountAlias,
            depositAmount: response.depositAmount,
            accountDescription: response.accountDescription,
            transactionMethod1: response.transactionMethod1,
            transactionMethod2: response.transactionMethod2,
            accountMemo: response.accountMemo,
            counterpartyName: response.counterpartyName,
            purpose: response.purpose,
            clientName: response.clientName,
          });
        }
      });
    }
  }, [depositIdToUpdate]);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">입금 리스트</h2>
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
                    {companyList.map((company, index) => (
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
                        value="전체"
                        className=""
                        checked={isMediumMatched === "전체"}
                        onChange={(e) => setIsMediumMatched(e.target.value)}
                      />
                      전체
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="companyMatching"
                        value="완료"
                        className=""
                        checked={isMediumMatched === "완료"}
                        onChange={(e) => setIsMediumMatched(e.target.value)}
                      />
                      완료
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="companyMatching"
                        value="미매칭"
                        className=""
                        checked={isMediumMatched === "미매칭"}
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
                onClick={handleCreateDepositModalOpenButtonClick}
              >
                입금값 등록
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-deleteButton px-5 font-semibold text-white"
                onClick={handleDeleteDepositButtonClick}
              >
                선택 삭제
              </button>
              {isEditMode ? (
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
              )}
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
                  <th className="border border-black">
                    <input
                      type="checkbox"
                      className=""
                      onChange={handleSelectAllCheckboxChange}
                      checked={
                        depositList?.items &&
                        depositList.items.length > 0 &&
                        depositIdsToDelete.length === depositList.items.length
                      }
                    />
                  </th>
                  <th className="border border-black">No</th>
                  <th className="border border-black">매체명</th>
                  <th className="border border-black">입금일자</th>
                  <th className="border border-black">계좌별칭</th>
                  <th className="border border-black">입금액</th>
                  <th className="border border-black">계좌적요</th>
                  <th className="border border-black">거래수단1</th>
                  <th className="border border-black">거래수단2</th>
                  <th className="border border-black">계좌메모</th>
                  <th className="border border-black">상대계좌예금주명</th>
                  <th className="border border-black">용도</th>
                  <th className="border border-black">거래처</th>
                  <th className="border border-black">관리</th>
                </tr>
              </thead>
              <tbody>
                {depositList?.items.map((deposit, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      <input
                        type="checkbox"
                        className=""
                        onChange={() => handleCheckboxChange(deposit.id)}
                        checked={depositIdsToDelete.includes(deposit.id)}
                      />
                    </td>
                    <td className="border border-black text-center">
                      {depositList.items.length - index}
                    </td>
                    <td
                      className={`${isEditMode || "text-ellipsis px-2"} max-w-32 overflow-hidden whitespace-nowrap border border-black text-center`}
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onInput={(e) =>
                        handleEditableChange(
                          index,
                          "mediumName",
                          e.currentTarget.textContent || "",
                        )
                      }
                    >
                      {deposit.mediumName}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.depositDate}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.accountAlias}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.depositAmount.toLocaleString()}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.accountDescription}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.transactionMethod1}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.transactionMethod2}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.accountMemo}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.counterpartyName}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.purpose}
                    </td>
                    <td className="border border-black text-center">
                      {deposit.clientName}
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex w-full items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex items-center justify-center whitespace-nowrap rounded-md bg-editButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setIsUpdateDepositModalOpen(true);
                            setDepositIdToUpdate(deposit.id);
                          }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center whitespace-nowrap rounded-md bg-registerButton px-5 py-1 font-semibold text-white"
                          onClick={() => {
                            setAccountAliasToMatch(deposit.accountAlias);
                            setPurposeToMatch(deposit.purpose);
                            setIsRegisterDepositMatchingModalOpen(true);
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

      {isCreateDepositModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-fit w-fit flex-col items-center rounded-md bg-white px-10 py-8">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleExcelModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-2xl font-bold">입금값 등록</h2>
            <div className="mt-7 flex items-center justify-center gap-10">
              <div className="flex w-fit flex-col flex-wrap items-center justify-center gap-6">
                {/* 입금일자 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
                    입금일자
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setDepositDateIndex(e.target.value)}
                    value={depositDateIndex}
                  >
                    <option value="">입금일자</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 계좌별칭 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
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

                {/* 입금액 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
                    입금액
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setDepositAmountIndex(e.target.value)}
                    value={depositAmountIndex}
                  >
                    <option value="">입금액</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 계좌적요 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
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
                  <span className="w-40 text-center text-lg font-semibold">
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
                  <span className="w-40 text-center text-lg font-semibold">
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
                  <span className="w-40 text-center text-lg font-semibold">
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

                {/* 상대계좌예금주명 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
                    상대계좌예금주명
                  </span>
                  <select
                    className="h-7 w-40 rounded-sm border border-solid border-black px-4 text-center"
                    onChange={(e) => setCounterpartyNameIndex(e.target.value)}
                    value={counterpartyNameIndex}
                  >
                    <option value="">상대계좌예금주명</option>
                    {ALPHABET.map((alphabet, index) => (
                      <option key={index} value={alphabet}>
                        {alphabet}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 용도 드롭다운 */}
                <div className="flex items-center justify-center">
                  <span className="w-40 text-center text-lg font-semibold">
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
                  <span className="w-40 text-center text-lg font-semibold">
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
              onClick={handleCreateDepositButtonClick}
            >
              등록
            </button>

            {isExcelResponseLoading && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <svg
                  className="h-16 w-16 animate-spin text-gray-900/50"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="text-gray-900"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {isUpdateDepositModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-updateModal w-updateModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsUpdateDepositModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">입금값 수정</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateDeposit.mediumName}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        mediumName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  입금일자
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="date"
                    className="h-full w-full px-2"
                    value={updateDeposit.depositDate}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        depositDate: e.target.value,
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
                    value={updateDeposit.accountAlias}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        accountAlias: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  입금액
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="number"
                    className="h-full w-full px-2"
                    value={updateDeposit.depositAmount}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        depositAmount: Number(e.target.value),
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
                    value={updateDeposit.accountDescription}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
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
                    value={updateDeposit.transactionMethod1}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
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
                    value={updateDeposit.transactionMethod2}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
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
                    value={updateDeposit.accountMemo}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        accountMemo: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  상대계좌
                  <br />
                  예금주명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    value={updateDeposit.counterpartyName}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        counterpartyName: e.target.value,
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
                    value={updateDeposit.purpose}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
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
                    value={updateDeposit.clientName}
                    onChange={(e) => {
                      setUpdateDeposit({
                        ...updateDeposit,
                        clientName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleUpdateDepositButtonClick}
            >
              수정
            </button>
          </div>
        </div>
      )}

      {isRegisterDepositMatchingModalOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
          <div className="relative flex h-registerModal w-registerModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => setIsRegisterDepositMatchingModalOpen(false)}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">입금 매칭 등록</h2>
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-7">
              <div className="flex w-full items-center gap-4">
                <span className="w-24 whitespace-nowrap text-lg font-semibold">
                  매체명
                </span>
                <div className="flex h-7 w-full items-center justify-center rounded-sm border border-solid border-black">
                  <input
                    type="text"
                    className="h-full w-full px-2"
                    onChange={(e) => {
                      setMediumNameToMatch(e.target.value);
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
                    value={accountAliasToMatch}
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
                    value={purposeToMatch}
                    disabled
                  />
                </div>
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex rounded-md bg-gray-300 px-5 py-1 font-medium"
              onClick={handleRegisterDepositMatchingButtonClick}
            >
              등록
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DepositListContent;
