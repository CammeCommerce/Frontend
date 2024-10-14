import { useState } from "react";
import {
  fetchProfitLossSearch,
  ProfitLoss,
} from "../../../api/profit-loss/profit-loss";

function ProfitLossStatementContent() {
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>(); // 손익계산서

  // 검색 관련 상태
  const [startDate, setStartDate] = useState(""); // 검색 시작일자
  const [endDate, setEndDate] = useState(""); // 검색 종료일자
  const [mediumName, setMediumName] = useState(""); // 매체명

  function handleSearchButtonClick() {
    fetchProfitLossSearch({
      startDate: startDate,
      endDate: endDate,
      mediumName: mediumName,
    })
      .then((response) => {
        setProfitLoss(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex h-full w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">온라인 리스트</h2>
        <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
          <div className="flex items-center gap-5">
            <span className="">매출발생월검색</span>
            <div className="flex items-center gap-2">
              <input
                type="month"
                className=""
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="">~</span>
              <input
                type="month"
                className=""
                onChange={(e) => setEndDate(e.target.value)}
              />
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
              <input type="text" className="h-full w-full" />
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
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center gap-2 rounded-sm border border-solid border-black px-3 py-2">
            <span className="">매체 : </span>
            <span className="">{profitLoss?.mediumName}</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-sm border border-solid border-black px-3 py-2">
            <span className="">기간 : </span>
            <span className="">{profitLoss?.period}</span>
          </div>
        </div>
        <div className="mt-2 h-fit w-1/2">
          <div className="flex h-10 w-full border-collapse items-center justify-center border border-b-0 border-black bg-gray-300">
            매출
          </div>
          <table className="w-full table-fixed border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">과목</th>
                <th className="border border-black">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
                <th className="border border-black text-center">도매 매출</th>
                <td className="border border-black text-center">
                  {profitLoss?.wholesaleSales}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">도매 배송비</th>
                <td className="border border-black text-center">
                  {profitLoss?.wholesaleShippingFee}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  수익 리스트 (용도 명 출력)
                </th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  온라인 리스트 매출 <br />
                  (온라인 업체명 출력)
                </th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center"></th>
                <td className="border border-black text-center"></td>
              </tr>
            </tbody>
          </table>
          <div className="flex h-10 w-full border-collapse items-center justify-center border border-y-0 border-black bg-gray-300">
            매입
          </div>
          <table className="w-full table-fixed border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">과목</th>
                <th className="border border-black">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
                <th className="border border-black text-center">도매 매입</th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">도매 배송비</th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  온라인 리스트 매입 <br />
                  (온라인 업체명 출력)
                </th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center"></th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  당기 순이익 (순손실)
                </th>
                <td className="border border-black text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfitLossStatementContent;
