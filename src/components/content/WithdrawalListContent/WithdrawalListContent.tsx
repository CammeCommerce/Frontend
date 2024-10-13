import { useCallback, useEffect, useState } from "react";
import closeIcon from "/assets/icon/svg/Close_round.svg";
import excelLogoIcon from "/assets/icon/png/excel-logo.png";
import { useDropzone } from "react-dropzone";
import {
  downloadWithdrawalListExcel,
  fetchWithdrawalListAll,
  FetchWithdrawalListAllResponse,
  fetchWithdrawalListSearch,
  updateWithdrawalOne,
  uploadWithdrawal,
} from "../../../api/withdrawal/withdrawal";
import { AxiosError } from "axios";

/* prettier-ignore */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // 알파벳 배열

function WithdrawalListContent() {
  const [withdrawalList, setWithdrawalList] =
    useState<FetchWithdrawalListAllResponse>(); // 출금 리스트

  const [isCreateWithdrawalModalOpen, setIsCreateWithdrawalModalOpen] =
    useState<boolean>(false); // 출금값 등록 모달 오픈 상태

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명
  const [isMediumMatched, setIsMediumMatched] = useState<string>("전체"); // 매체명 매칭여부
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어

  // 수정 모달 관련 상태
  const [isUpdateWithdrawalModalOpen, setIsUpdateWithdrawalModalOpen] =
    useState<boolean>(false); // 수정 모달 오픈 상태
  const [withdrawalIdToUpdate, setWithdrawalIdToUpdate] = useState<number>(0); // 수정할 주문값 ID
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

  // 출금값 등록 모달 닫기 버튼 클릭 이벤트
  function handleExcelModalCloseButtonClick() {
    setIsCreateWithdrawalModalOpen(false);
    setExcelFile(undefined);
  }

  // 출금값 등록 버튼 클릭 이벤트
  function handleCreateWithdrawalButtonClick() {
    if (excelFile) {
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
        })
        .catch((error: AxiosError) => {
          console.error(error);
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
        setWithdrawalList(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 출금값 수정 버튼 클릭 이벤트
  function handleUpdateWithdrawalButtonClick() {
    updateWithdrawalOne(withdrawalIdToUpdate, updateWithdrawal)
      .then(() => {
        setIsUpdateWithdrawalModalOpen(false);
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

  // 마운트 시 실행
  useEffect(() => {
    fetchWithdrawalListAll()
      .then((response) => {
        setWithdrawalList(response);
      })
      .catch((error: AxiosError) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
        <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
          <h2 className="text-xl font-semibold">출금 리스트</h2>
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
                <div className="flex items-center gap-3">
                  <span className="">매체명 매칭여부</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="companyMatching"
                        value="전체"
                        className=""
                        checked={isMediumMatched === "전체"}
                        onChange={() => setIsMediumMatched("전체")}
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
                        onChange={() => setIsMediumMatched("완료")}
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
                        onChange={() => setIsMediumMatched("미매칭")}
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
                onClick={() => setIsCreateWithdrawalModalOpen(true)}
              >
                출금값 등록
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
                    <input type="checkbox" className="" />
                  </th>
                  <th className="border border-black">No</th>
                  <th className="border border-black">매체명</th>
                  <th className="border border-black">출금일자</th>
                  <th className="border border-black">계좌별칭</th>
                  <th className="border border-black">출금액</th>
                  <th className="border border-black">계좌적요</th>
                  <th className="border border-black">거래수단1</th>
                  <th className="border border-black">거래수단2</th>
                  <th className="border border-black">계좌메모</th>
                  <th className="border border-black">용도</th>
                  <th className="border border-black">거래처</th>
                  <th className="border border-black">수정</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalList?.items.map((item, index) => (
                  <tr key={index} className="h-10">
                    <td className="border border-black text-center">
                      <input type="checkbox" className="" />
                    </td>
                    <td className="border border-black text-center">
                      {item.id}
                    </td>
                    <td className="border border-black text-center">
                      {item.mediumName}
                    </td>
                    <td className="border border-black text-center">
                      {item.withdrawalDate}
                    </td>
                    <td className="border border-black text-center">
                      {item.accountAlias}
                    </td>
                    <td className="border border-black text-center">
                      {item.withdrawalAmount}
                    </td>
                    <td className="border border-black text-center">
                      {item.accountDescription}
                    </td>
                    <td className="border border-black text-center">
                      {item.transactionMethod1}
                    </td>
                    <td className="border border-black text-center">
                      {item.transactionMethod2}
                    </td>
                    <td className="border border-black text-center">
                      {item.accountMemo}
                    </td>
                    <td className="border border-black text-center">
                      {item.purpose}
                    </td>
                    <td className="border border-black text-center">
                      {item.clientName}
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex w-full items-center justify-center gap-2">
                        <button
                          type="button"
                          className="border border-solid border-black bg-gray-300"
                          onClick={() => {
                            setWithdrawalIdToUpdate(item.id);
                            setIsUpdateWithdrawalModalOpen(true);
                          }}
                        >
                          수정
                        </button>
                        {/* <button
                          type="button"
                          className="border border-solid border-black bg-gray-300"
                          onClick={() => {
                            setPurchasePlaceToMatch(order.purchasePlace);
                            setSalesPlaceToMatch(order.salesPlace);
                            setIsRegisterOrderMatchingModalOpen(true);
                          }}
                        >
                          등록
                        </button> */}
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
          <div className="relative flex h-excelModal w-excelModal flex-col items-center rounded-md bg-white px-10 py-4">
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
              onClick={() => handleExcelModalCloseButtonClick()}
            >
              <img src={closeIcon} alt="닫기" className="w-full" />
            </button>
            <h2 className="text-xl font-bold">출금값 등록</h2>
            <div className="mt-7 flex w-2/3 flex-wrap justify-center gap-6">
              {/* 출금일자 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setWithdrawalDateIndex(e.target.value)}
              >
                <option value="">출금일자</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 계좌별칭 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setAccountAliasIndex(e.target.value)}
              >
                <option value="">계좌별칭</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 출금액 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setWithdrawalAmountIndex(e.target.value)}
              >
                <option value="">출금액</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 계좌적요 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setAccountDescriptionIndex(e.target.value)}
              >
                <option value="">계좌적요</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 거래수단1 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setTransactionMethod1Index(e.target.value)}
              >
                <option value="">거래수단1</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 거래수단2 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setTransactionMethod2Index(e.target.value)}
              >
                <option value="">거래수단2</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 계좌메모 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setAccountMemoIndex(e.target.value)}
              >
                <option value="">계좌메모</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 용도 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setPurposeIndex(e.target.value)}
              >
                <option value="">용도</option>
                {ALPHABET.map((alphabet, index) => (
                  <option key={index} value={alphabet}>
                    {alphabet}
                  </option>
                ))}
              </select>

              {/* 거래처 드롭다운 */}
              <select
                className="border border-solid border-black"
                onChange={(e) => setClientNameIndex(e.target.value)}
              >
                <option value="">거래처</option>
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
            <div className="mx-auto mt-7 flex w-3/4 flex-col gap-4">
              <div className="flex w-full items-center gap-4">
                <span className="">매체명</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      mediumName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">출금일자</span>
                <input
                  type="date"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      withdrawalDate: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">계좌별칭</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      accountAlias: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">출금액</span>
                <input
                  type="number"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      withdrawalAmount: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">계좌적요</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      accountDescription: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">거래수단1</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      transactionMethod1: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">거래수단2</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      transactionMethod2: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">계좌메모</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      accountMemo: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">용도</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      purpose: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-4">
                <span className="">거래처</span>
                <input
                  type="text"
                  className="w-96 border border-solid border-black"
                  onChange={(e) => {
                    setUpdateWithdrawal({
                      ...updateWithdrawal,
                      clientName: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <button
              className="absolute bottom-2 right-2 flex bg-gray-200 px-5 py-1"
              onClick={handleUpdateWithdrawalButtonClick}
            >
              수정
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawalListContent;
