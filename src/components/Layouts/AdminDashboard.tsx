import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../Header/SidebarMenu';
import AdminHeader from '../Header/AdminHeader';
import ManagementSidebar from '../Sidebar/ManagementSidebar';

const sidebarRoutes = [
  { to: '/admin/books', icon: 'library_books', label: 'Kitaplar' },
  { to: '/admin/genres', icon: 'category', label: 'Kitap Türleri' },
  { to: '/admin/users', icon: 'group', label: 'Kullanıcılar' },
  {
    to: '/admin/borrowedbooks',
    icon: 'menu_book',
    label: 'Ödünç Kitaplar'
  },
  { to: '/admin/authors', icon: 'person_edit', label: 'Yazarlar' }
]

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <div className="relative z-10 flex h-dvh min-h-dvh w-full">
          <ManagementSidebar sidebarRoutes={sidebarRoutes}/>
          <main className="grow overflow-y-auto overflow-x-hidden text-neutral-100">
            <header className="top-0 w-full">
              <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
            </header>
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
};

export default AdminDashboard;
