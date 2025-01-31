import React from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '../Header/UserIcon';
import { useUser } from '../../context/UserProvider';

const AdminSidebar = () => {
  const { user } = useUser();

  return (
    <aside className="hidden md:block h-screen w-64 bg-white border-r border-slate-100">
      <div className="flex flex-col items-center border-b p-8 text-center">
        <UserIcon
          style={'h-24 w-24 bg-slate-50'}
          textStyle={'text-slate-700 text-lg'}
          user={user}
          onClick={undefined}
        />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {user.firstName + ' ' + user.lastName}
        </h3>
        <p className="mt-1 text-sm text-gray-500">Admin</p>
      </div>
      <nav className="py-6">
        {[
          { to: '/admin/books', icon: 'library_books', label: 'Kitaplar' },
          { to: '/admin/genres', icon: 'category', label: 'Kitap Türleri' },
          { to: '/admin/users', icon: 'group', label: 'Kullanıcılar' },
          { to: '/admin/borrowed', icon: 'menu_book', label: 'Ödünç Kitaplar' }
        ].map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="mb-2 py-2 flex h-12 items-center justify-center text-slate-600 hover:text-slate-900 border-sky-800 hover:border-r-2 transition"
          >
            <div className='flex items-center w-2/3'>
              <i className="material-symbols-outlined text-lg text-slate-500">
                {icon}
              </i>
              <span className="ml-3 text-slate-700 font-semibold text-sm">{label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
