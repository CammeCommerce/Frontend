import { Link, useLocation } from "react-router-dom";

function SideNav() {
  const location = useLocation();

  return (
    <nav className="flex h-full w-56 flex-col items-center gap-2 bg-sidenav p-4">
      {/** 매체관리 탭 */}
      <Link
        to="/company-management"
        className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
      >
        <span
          className={`text-lg text-white ${location.pathname === "/company-management" ? "font-bold" : ""} py-2`}
        >
          매체관리
        </span>
      </Link>

      <hr className="w-4/5 border-gray-500" />

      {/** 정산업체관리 탭 */}
      <Link
        to="/settlement-company-management"
        className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
      >
        <span
          className={`text-lg text-white ${location.pathname === "/settlement-company-management" ? "font-bold" : ""} py-2`}
        >
          정산업체관리
        </span>
      </Link>

      <hr className="w-4/5 border-gray-500" />

      {/** 주문관리 탭 */}
      <div className="w-full">
        <Link
          to="/order-list"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
        >
          <span
            className={`text-lg text-white ${location.pathname === "/order-list" || location.pathname === "/order-matching-list" ? "font-bold" : ""} py-2`}
          >
            주문관리
          </span>
        </Link>

        {/** 세부 메뉴 */}
        {(location.pathname === "/order-list" ||
          location.pathname === "/order-matching-list") && (
          <div className="flex w-full flex-col">
            <Link
              to="/order-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/order-list" ? "underline" : ""}`}
              >
                주문리스트
              </span>
            </Link>
            <Link
              to="/order-matching-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/order-matching-list" ? "underline" : ""}`}
              >
                주문값매칭리스트
              </span>
            </Link>
          </div>
        )}
      </div>

      <hr className="w-4/5 border-gray-500" />

      {/** 수익(입금)리스트 탭 */}
      <div className="w-full">
        <Link
          to="/deposit-list"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
        >
          <span
            className={`text-lg text-white ${location.pathname === "/deposit-list" || location.pathname === "/deposit-matching-list" ? "font-bold" : ""} py-2`}
          >
            수익(입금)리스트
          </span>
        </Link>

        {/** 세부 메뉴 */}
        {(location.pathname === "/deposit-list" ||
          location.pathname === "/deposit-matching-list") && (
          <div className="flex w-full flex-col">
            <Link
              to="/deposit-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/deposit-list" ? "underline" : ""}`}
              >
                입금리스트
              </span>
            </Link>
            <Link
              to="/deposit-matching-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/deposit-matching-list" ? "underline" : ""}`}
              >
                입금값매칭리스트
              </span>
            </Link>
          </div>
        )}
      </div>

      <hr className="w-4/5 border-gray-500" />

      {/** 비용(출금)리스트 탭 */}
      <div className="w-full">
        <Link
          to="/withdrawal-list"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
        >
          <span
            className={`text-lg text-white ${location.pathname === "/withdrawal-list" || location.pathname === "/withdrawal-matching-list" ? "font-bold" : ""} py-2`}
          >
            비용(출금)리스트
          </span>
        </Link>

        {/** 세부 메뉴 */}
        {(location.pathname === "/withdrawal-list" ||
          location.pathname === "/withdrawal-matching-list") && (
          <div className="flex w-full flex-col">
            <Link
              to="/withdrawal-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/withdrawal-list" ? "underline" : ""}`}
              >
                출금리스트
              </span>
            </Link>
            <Link
              to="/withdrawal-matching-list"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/withdrawal-matching-list" ? "underline" : ""}`}
              >
                출금값매칭리스트
              </span>
            </Link>
          </div>
        )}
      </div>

      <hr className="w-4/5 border-gray-500" />

      {/** 온라인 리스트 탭 */}
      <Link
        to="/online-list"
        className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
      >
        <span
          className={`text-lg text-white ${location.pathname === "/online-list" ? "font-bold" : ""} py-2`}
        >
          온라인 리스트
        </span>
      </Link>

      <hr className="w-4/5 border-gray-500" />

      {/** 손익계산서 탭 */}
      <Link
        to="/profit-loss-statement"
        className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
      >
        <span
          className={`text-lg text-white ${location.pathname === "/profit-loss-statement" ? "font-bold" : ""} py-2`}
        >
          손익계산서
        </span>
      </Link>

      <hr className="w-4/5 border-gray-500" />

      {/** 설정 탭 */}
      <div className="w-full">
        <Link
          to="/profile"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-md bg-opacity-20"
        >
          <span
            className={`text-lg text-white ${location.pathname === "/profile" || location.pathname === "/subaccount-setting" || location.pathname === "/other-setting" ? "font-bold" : ""} py-2`}
          >
            설정
          </span>
        </Link>

        {/** 세부 메뉴 */}
        {(location.pathname === "/profile" ||
          location.pathname === "/subaccount-setting" ||
          location.pathname === "/other-setting") && (
          <div className="flex w-full flex-col">
            <Link
              to="/profile"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/profile" ? "underline" : ""}`}
              >
                내정보
              </span>
            </Link>
            <Link
              to="/subaccount-setting"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/subaccount-setting" ? "underline" : ""}`}
              >
                부계정 설정
              </span>
            </Link>
            <Link
              to="/other-setting"
              className="flex w-full items-center justify-center"
            >
              <span
                className={`py-2 text-sm text-white ${location.pathname === "/other-setting" ? "underline" : ""}`}
              >
                기타 설정
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default SideNav;
