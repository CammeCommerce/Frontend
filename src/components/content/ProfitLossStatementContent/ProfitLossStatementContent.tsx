import { useEffect, useState } from "react";
import {
  fetchProfitLossSearch,
  ProfitLoss,
} from "../../../api/profit-loss/profit-loss";
import { fetchCompanyAll } from "../../../api/medium/medium";

function ProfitLossStatementContent() {
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>(); // 손익계산서
  const [companyList, setCompanyList] = useState<string[]>([]); // 매체명 목록

  // 검색 관련 상태
  const [startDate, setStartDate] = useState<string>(""); // 검색 시작일자
  const [endDate, setEndDate] = useState<string>(""); // 검색 종료일자
  // const [periodType, setPeriodType] = useState<string>(""); // 검색 기간
  const [mediumName, setMediumName] = useState<string>(""); // 매체명

  // 검색 버튼 클릭 핸들러
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

  useEffect(() => {
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
    <div className="flex h-full w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">손익 계산서</h2>
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
            {/* 전체, 어제, 지난 3일 등 버튼 주석 */}
            {/* <div className="flex items-center gap-2">
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
            </div> */}
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
                  {companyList.map((companyName) => (
                    <option key={companyName} value={companyName}>
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
              <input type="text" className="h-full w-full" />
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
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center gap-2 rounded-sm border border-solid border-black px-3 py-2">
            <span className="font-bold">매체 : </span>
            <span className="">{profitLoss?.mediumName}</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-sm border border-solid border-black px-3 py-2">
            <span className="font-bold">기간 : </span>
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
                  {profitLoss?.wholesaleSales.toLocaleString()}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">도매 배송비</th>
                <td className="border border-black text-center">
                  {profitLoss?.wholesaleShippingFee.toLocaleString()}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  수익리스트 <br />
                  (용도명 출력)
                </th>
                <td className="border border-black text-center">
                  {profitLoss?.depositByPurpose &&
                    Object.keys(profitLoss?.depositByPurpose).map(
                      (key, index) => (
                        <span key={index} className="">
                          {key} :{" "}
                          {profitLoss?.depositByPurpose[key].toLocaleString()}
                          <br />
                        </span>
                      ),
                    )}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  온라인 리스트 매출 <br />
                  (온라인 업체명 출력)
                </th>
                <td className="border border-black text-center">
                  {profitLoss?.onlineSalesByMedia &&
                    Object.keys(profitLoss.onlineSalesByMedia).map(
                      (key, index) => (
                        <span key={index} className="">
                          {key} :{" "}
                          {profitLoss?.onlineSalesByMedia[key].toLocaleString()}
                          <br />
                        </span>
                      ),
                    )}
                </td>
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
          <table className="mb-10 w-full table-fixed border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">과목</th>
                <th className="border border-black">금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
                <th className="border border-black text-center">도매 매입</th>
                <td className="border border-black text-center">
                  {profitLoss?.wholesalePurchase.toLocaleString()}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">도매 배송비</th>
                <td className="border border-black text-center">
                  {profitLoss?.wholesalePurchaseShippingFee.toLocaleString()}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  비용리스트 <br />
                  (용도명 출력)
                </th>
                <td className="border border-black text-center">
                  {profitLoss?.withdrawalByPurpose &&
                    Object.keys(profitLoss?.withdrawalByPurpose).map(
                      (key, index) => (
                        <span key={index} className="">
                          {key} :{" "}
                          {profitLoss?.withdrawalByPurpose[
                            key
                          ].toLocaleString()}
                          <br />
                        </span>
                      ),
                    )}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  온라인 리스트 매입 <br />
                  (온라인 업체명 출력)
                </th>
                <td className="border border-black text-center">
                  {profitLoss?.onlinePurchaseByMedia &&
                    Object.keys(profitLoss.onlinePurchaseByMedia).map(
                      (key, index) => (
                        <span key={index} className="">
                          {key} :{" "}
                          {profitLoss?.onlinePurchaseByMedia[
                            key
                          ].toLocaleString()}
                          <br />
                        </span>
                      ),
                    )}
                </td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center"></th>
                <td className="border border-black text-center"></td>
              </tr>
              <tr className="h-10">
                <th className="border border-black text-center">
                  당기 순이익 (순손실)
                </th>
                <td className="border border-black text-center">
                  {profitLoss?.netProfitOrLoss.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfitLossStatementContent;
