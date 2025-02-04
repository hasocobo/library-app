import { Link, useLocation } from 'react-router-dom';
import UserIcon from '../Header/UserIcon';
import { useUser } from '../../context/UserProvider';

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useUser();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-100 bg-white md:flex">
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
      <nav className="flex grow flex-col pt-6">
        {[
          { to: '/admin/books', icon: 'library_books', label: 'Kitaplar' },
          { to: '/admin/genres', icon: 'category', label: 'Kitap Türleri' },
          { to: '/admin/users', icon: 'group', label: 'Kullanıcılar' },
          {
            to: '/admin/borrowedbooks',
            icon: 'menu_book',
            label: 'Ödünç Kitaplar'
          },
          { to: '/admin/authors', icon: 'person_edit', label: 'Yazarlar' }
        ].map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={` mb-2 flex h-12 items-center justify-center border-sky-800 py-2 text-slate-600
               transition hover:border-r-2 hover:text-slate-900 ${to === location.pathname ? 'border-r-2' : ''}`}
          >
            <div className="flex w-2/3 items-center">
              <i className="material-symbols-outlined text-lg text-slate-500">
                {icon}
              </i>
              <span className="ml-3 text-sm font-semibold text-slate-700">
                {label}
              </span>
            </div>
          </Link>
        ))}
        <div className="flex grow flex-col justify-end">
          <Link
            to="/"
            className="mb-2 flex h-12 items-center justify-center gap-2 border-sky-800 py-2 text-slate-600 hover:border-r-2 hover:text-slate-900"
          >
            <i className="material-symbols-outlined text-lg text-slate-700">
              arrow_forward
            </i>
            <div className="text-nowrap text-sm font-semibold tracking-tight text-slate-700">
              Kullanıcı Sayfası
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
