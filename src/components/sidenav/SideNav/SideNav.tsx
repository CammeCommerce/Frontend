import { useRecoilState } from "recoil";
import { sidenavAtom, sidenavDetailAtom } from "../../../pages/recoil";
import { useEffect } from "react";

function SideNav() {
  const [selected, setSelected] = useRecoilState<null | SideNavMenu>(
    sidenavAtom,
  );
  const [selectedDetail, setSelectedDetail] =
    useRecoilState<null | SideNavDetailMenu>(sidenavDetailAtom);

  // 현재 선택된 메뉴를 변경하는 함수
  function handleMenuClick(menu: SideNavMenu) {
    setSelected(menu);
  }

  // 현재 선택된 상세 메뉴를 변경하는 함수
  function handleDetailMenuClick(menu: SideNavDetailMenu) {
    setSelectedDetail(menu);
  }

  // 메뉴가 변경될 때마다 상세 메뉴를 초기화
  useEffect(() => {
    if (
      selected !== "주문관리" &&
      selected !== "수익(입금)리스트" &&
      selected !== "비용(입금)리스트" &&
      selected !== "설정"
    ) {
      setSelectedDetail(null);
    }
  }, [selected, selectedDetail]);

  return (
    <nav className="bg-sidenav flex h-full w-56 flex-col p-4">
      <div
        className={`${selected === "매체관리" ? "bg-sidenavSelected" : ""} flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("매체관리")}
      >
        <span
          className={`text-lg text-white ${selected === "매체관리" ? "font-bold" : ""} py-2`}
        >
          매체관리
        </span>
      </div>
      <div
        className={`${selected === "정산업체관리" ? "bg-sidenavSelected" : ""} flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("정산업체관리")}
      >
        <span
          className={`text-lg text-white ${selected === "정산업체관리" ? "font-bold" : ""} py-2`}
        >
          정산업체관리
        </span>
      </div>
      <div
        className={`${selected === "주문관리" ? "bg-sidenavSelected" : ""} flex min-h-14 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("주문관리")}
      >
        <span
          className={`text-lg text-white ${selected === "주문관리" ? "font-bold" : ""} py-2`}
        >
          주문관리
        </span>
        {selected === "주문관리" && (
          <div className="flex w-full flex-col">
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("주문리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "주문관리" && selectedDetail === "주문리스트" ? "font-bold" : ""}`}
              >
                주문리스트
              </span>
            </div>
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("주문값매칭리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "주문관리" && selectedDetail === "주문값매칭리스트" ? "font-bold" : ""}`}
              >
                주문값매칭리스트
              </span>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${selected === "수익(입금)리스트" ? "bg-sidenavSelected" : ""} flex min-h-14 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("수익(입금)리스트")}
      >
        <span
          className={`text-lg text-white ${selected === "수익(입금)리스트" ? "font-bold" : ""} py-2`}
        >
          수익(입금)리스트
        </span>
        {selected === "수익(입금)리스트" && (
          <div className="flex w-full flex-col">
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("입금리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "수익(입금)리스트" && selectedDetail === "입금리스트" ? "font-bold" : ""}`}
              >
                입금리스트
              </span>
            </div>
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("입금값매칭리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "수익(입금)리스트" && selectedDetail === "입금값매칭리스트" ? "font-bold" : ""}`}
              >
                입금값매칭리스트
              </span>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${selected === "비용(입금)리스트" ? "bg-sidenavSelected" : ""} flex min-h-14 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("비용(입금)리스트")}
      >
        <span
          className={`text-lg text-white ${selected === "비용(입금)리스트" ? "font-bold" : ""} py-2`}
        >
          비용(입금)리스트
        </span>
        {selected === "비용(입금)리스트" && (
          <div className="flex w-full flex-col">
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("출금리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "비용(입금)리스트" && selectedDetail === "출금리스트" ? "font-bold" : ""}`}
              >
                출금리스트
              </span>
            </div>
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("출금값매칭리스트")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "비용(입금)리스트" && selectedDetail === "출금값매칭리스트" ? "font-bold" : ""}`}
              >
                출금값매칭리스트
              </span>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${selected === "온라인 리스트" ? "bg-sidenavSelected" : ""} flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("온라인 리스트")}
      >
        <span
          className={`text-lg text-white ${selected === "온라인 리스트" ? "font-bold" : ""} py-2`}
        >
          온라인 리스트
        </span>
      </div>
      <div
        className={`${selected === "손익계산서" ? "bg-sidenavSelected" : ""} flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("손익계산서")}
      >
        <span
          className={`text-lg text-white ${selected === "손익계산서" ? "font-bold" : ""} py-2`}
        >
          손익계산서
        </span>
      </div>
      <div
        className={`${selected === "설정" ? "bg-sidenavSelected" : ""} flex min-h-14 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-opacity-20 py-2`}
        onClick={() => handleMenuClick("설정")}
      >
        <span
          className={`text-lg text-white ${selected === "설정" ? "font-bold" : ""} py-2`}
        >
          설정
        </span>
        {selected === "설정" && (
          <div className="flex w-full flex-col">
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("내정보")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "설정" && selectedDetail === "내정보" ? "font-bold" : ""}`}
              >
                내정보
              </span>
            </div>
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("부계정 설정")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "설정" && selectedDetail === "부계정 설정" ? "font-bold" : ""}`}
              >
                부계정 설정
              </span>
            </div>
            <div
              className="flex w-full items-center justify-center"
              onClick={() => handleDetailMenuClick("기타 설정")}
            >
              <span
                className={`py-2 text-sm text-white ${selected === "설정" && selectedDetail === "기타 설정" ? "font-bold" : ""}`}
              >
                기타 설정
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default SideNav;
