import CompanyManagementContent from "../../components/content/CompanyManagementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function CompanyManagement() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <CompanyManagementContent />
      </div>
    </>
  );
}

export default CompanyManagement;
