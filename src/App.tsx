import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import CompanyManagement from "./pages/CompanyManagement";
import SettlementCompanyManagement from "./pages/SettlementCompanyManagement";
import OrderManagement from "./pages/OrderList";
import OrderMatchingList from "./pages/OrderMatchingList";
import DepositList from "./pages/DepositList";
import DepositMatchingList from "./pages/DepositMatchingList";
import WithdrawalList from "./pages/WithdrawalList";
import WithdrawalMatchingList from "./pages/WithdrawalMatchingList";
import OnlineList from "./pages/OnlineList";
import ProfitLossStatement from "./pages/ProfitLossStatement";
import Profile from "./pages/Profile";
import SubAccountSetting from "./pages/SubAccountSetting";
import OtherSetting from "./pages/OtherSetting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/company-management" element={<CompanyManagement />} />
      <Route
        path="/settlement-company-management"
        element={<SettlementCompanyManagement />}
      />
      <Route path="/order-list" element={<OrderManagement />} />
      <Route path="/order-matching-list" element={<OrderMatchingList />} />
      <Route path="/deposit-list" element={<DepositList />} />
      <Route path="/deposit-matching-list" element={<DepositMatchingList />} />
      <Route path="/withdrawal-list" element={<WithdrawalList />} />
      <Route
        path="/withdrawal-matching-list"
        element={<WithdrawalMatchingList />}
      />
      <Route path="/online-list" element={<OnlineList />} />
      <Route path="/profit-loss-statement" element={<ProfitLossStatement />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subaccount-setting" element={<SubAccountSetting />} />
      <Route path="/other-setting" element={<OtherSetting />} />
    </Routes>
  );
}

export default App;
