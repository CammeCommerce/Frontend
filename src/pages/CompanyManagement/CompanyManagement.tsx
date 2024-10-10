import CompanyManagementContent from "../../components/content/CompanyManagementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function CompanyManagement() {
  return (
    <>
      <SideNav />
      <div className="w-content flex h-screen flex-col">
        <MainHeader />
        <CompanyManagementContent />
      </div>
    </>
  );
}

export default CompanyManagement;
