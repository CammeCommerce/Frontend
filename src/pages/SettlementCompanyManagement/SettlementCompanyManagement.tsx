import SettlementCompanyManagementContent from "../../components/content/SettlementCompanyManagementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function SettlementCompanyManagement() {
  return (
    <>
      <SideNav />
      <div className="w-content flex h-screen flex-col">
        <MainHeader />
        <SettlementCompanyManagementContent />
      </div>
    </>
  );
}

export default SettlementCompanyManagement;
