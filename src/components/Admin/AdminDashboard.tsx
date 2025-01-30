import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../Header/SidebarMenu";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Sidebar/AdminSidebar";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <div className="relative z-10 flex h-dvh min-h-dvh w-full flex-col">
          <header className="top-0 w-full">
            <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          </header>
          <main className="grow overflow-y-auto text-neutral-100">
            <AdminSidebar />
            <Outlet />
          </main>

          <SidebarMenu
            isOpen={isSidebarOpen}
            handleClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;