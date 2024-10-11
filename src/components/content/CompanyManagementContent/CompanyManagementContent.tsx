function CompanyManagementContent() {
  return (
    <div className="flex h-main w-full flex-col bg-primaryBackground p-5">
      <div className="flex h-fit w-full flex-col bg-white px-10 py-6 shadow-md">
        <h2 className="text-xl font-semibold">매체관리</h2>
        <div className="mt-4 flex w-full flex-col gap-6 rounded-lg border border-solid border-gray-400 p-5">
          <div className="flex items-center gap-5">
            <span className="">등록일자검색</span>
            <div className="flex items-center gap-2">
              <input type="date" className="" />
              <span className="">~</span>
              <input type="date" className="" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                전체
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                어제
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                지난 3일
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                일주일
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                1개월
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                3개월
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                6개월
              </button>
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
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
              >
                검색하기
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-md bg-gray-500 px-5 font-semibold text-white"
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
          >
            매체 등록
          </button>
        </div>
        <div className="mt-2 h-fit w-full">
          <table className="w-full table-fixed border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="border border-black">매체명</th>
                <th className="border border-black">등록일자</th>
                <th className="border border-black">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10">
                <td className="border border-black text-center">캄므커머스</td>
                <td className="border border-black text-center">2024-09-19</td>
                <td className="border border-black text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md bg-gray-500 px-5 py-1 font-semibold text-white"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md bg-gray-500 px-5 py-1 font-semibold text-white"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="h-10">
                <td className="border border-black text-center">포앤서치</td>
                <td className="border border-black text-center">2024-09-19</td>
                <td className="border border-black text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md bg-gray-500 px-5 py-1 font-semibold text-white"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-md bg-gray-500 px-5 py-1 font-semibold text-white"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompanyManagementContent;
