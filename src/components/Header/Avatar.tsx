import { useEffect, useRef, useState } from 'react';
import UserIcon from './UserIcon';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserProvider';

export default function Avatar() {
  const [expanded, setExpanded] = useState(false);
  const { user } = useUser();
  const popoverRef = useRef(null);
  const role: string = user?.roles.includes('Admin') ? 'Admin'
    : user?.roles.includes('Librarian') ? 'Kütüphane Görevlisi'
    : 'User';

  useEffect(() => {
    expanded
      ? document.addEventListener('click', handleClickOutside)
      : document.removeEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [expanded]);

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  return (
    <div ref={popoverRef} className="relative">
      <UserIcon onClick={() => setExpanded(!expanded)} user={user} style={''} />
      {expanded && (
        <div
          className="z-[9999]!important absolute right-[-60px] top-[65px] flex flex-col rounded-md border bg-white shadow sm:block sm:w-60"
          style={{ zIndex: 9999, backgroundColor: 'white' }}
        >
          <header className="z-[9999]!important relative border-b">
            <div className="flex items-center gap-2 px-4 py-4">
              <UserIcon user={user} style={''} onClick={undefined} />
              <div className="flex flex-col">
                <p className="font-semibold text-slate-700">
                  {user &&
                    user.firstName &&
                    user.firstName + ' ' + user.lastName}
                </p>
                <p className="font-normal text-slate-500">{role}</p>
              </div>
            </div>
          </header>
          <main className="z-[9999]!important relative bg-white">
            <div className="flex flex-col bg-white">
              {/* <Link
                to={''}
                className="flex items-center gap-2 px-5 py-3 hover:bg-sky-50 "
              >
                <i className="material-icons text-slate-400">person</i>
                <p className="text-slate-600">Your Profile</p>
              </Link>{' '}
              {allowedRoles.includes(user.role) && (
                <Link
                  to={'/ekle'}
                  className="flex items-center gap-2 px-5 py-3 hover:bg-sky-50 "
                >
                  <i className="material-icons text-slate-400">add</i>
                  <p className="text-slate-600"></p>
                </Link>
              )} */}
              <Link
                to={`/login`}
                className="flex items-center gap-2 bg-white px-5 py-3 hover:bg-sky-50"
              >
                <i className="material-icons text-slate-400">logout</i>
                <p className="text-slate-600">Çıkış Yap</p>
              </Link>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
