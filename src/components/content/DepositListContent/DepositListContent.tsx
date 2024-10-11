function DepositListContent() {
  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">입금 리스트</h2>
        <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
          <div className="flex items-center gap-5">
            <span className="">발주일자검색</span>
            <div className="flex items-center gap-2">
              <input type="date" className="" />
              <span className="">~</span>
              <input type="date" className="" />
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
                <select className="h-8 w-60 border border-solid border-black text-center">
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
                      name="matching"
                      value="전체"
                      className=""
                    />
                    전체
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="matching"
                      value="완료"
                      className=""
                    />
                    완료
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="matching"
                      value="미매칭"
                      className=""
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
              <input type="text" className="h-full w-full" />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-500 px-5 font-semibold text-white"
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
              입금값 등록
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
                <th className="border border-black">입금일자</th>
                <th className="border border-black">계좌별칭</th>
                <th className="border border-black">입금액</th>
                <th className="border border-black">계좌적요</th>
                <th className="border border-black">거래수단1</th>
                <th className="border border-black">거래수단2</th>
                <th className="border border-black">거래메모</th>
                <th className="border border-black">상대계좌예금주명</th>
                <th className="border border-black">용도</th>
                <th className="border border-black">거래처</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
                <td className="border border-black text-center">
                  <input type="checkbox" className="" />
                </td>
                <td className="border border-black text-center">5</td>
                <td className="border border-black text-center">
                  캄므&gt;포앤_마진만
                </td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
                <td className="border border-black text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DepositListContent;
