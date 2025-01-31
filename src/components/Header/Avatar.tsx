import { useEffect, useRef, useState } from 'react';
import UserIcon from './UserIcon';
import { Link } from 'react-router-dom';

const allowedRoles = ['Admin'];

export default function Avatar({ user }) {
  const [expanded, setExpanded] = useState(false);
  const popoverRef = useRef(null);
  const role: string = user?.roles[0]?.charAt(0).toUpperCase() + user?.roles[0]?.slice(1);

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
      <UserIcon onClick={() => setExpanded(!expanded)} user={user} style={""} />
      {expanded && (
        <div
          className="absolute z-[9999]!important right-[-60px] top-[65px] flex flex-col rounded-md border bg-white shadow sm:block sm:w-60"
          style={{ zIndex: 9999, backgroundColor: 'white' }} 
        >
          <header className="border-b relative z-[9999]!important">
            <div className="flex items-center gap-2 px-4 py-4">
              <UserIcon user={user} style={""} onClick={undefined} />
              <div className="flex flex-col">
                <p className="font-semibold text-slate-700">
                  {user && (user.firstName && user.firstName + ' ' + user.lastName)}
                </p>
                <p className="font-normal text-slate-500">{role}</p>
              </div>
            </div>
          </header>
          <main className="bg-white relative z-[9999]!important ">
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
                className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-sky-50"
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