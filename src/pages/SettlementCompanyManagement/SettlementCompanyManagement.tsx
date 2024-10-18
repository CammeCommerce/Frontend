import SettlementCompanyManagementContent from "../../components/content/SettlementCompanyManagementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function SettlementCompanyManagement() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <SettlementCompanyManagementContent />
      </div>
    </>
  );
}

export default SettlementCompanyManagement;
