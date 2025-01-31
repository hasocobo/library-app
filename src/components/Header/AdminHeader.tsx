import {
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import Avatar from './Avatar';
import { useUser } from '../../context/UserProvider';
import { useEffect, useState, useRef } from 'react';
export default function AdminHeader({ onMenuClick }) {
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, []);


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams();
    if (searchTerm) {
      newSearchParams.set('q', searchTerm);
    } /*else {
      newSearchParams.delete('q');
    }*/

    navigate({
      pathname: '/browse',
      search: newSearchParams.toString()
    });
  };

  return (
    <div className="relative sticky w-full border-b border-slate-100 bg-white text-sm font-semibold">
      <div className="mx-auto max-w-7xl">
        <div className="px-4">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <i
              onClick={onMenuClick}
              className="material-symbols-outlined flex size-10 items-center justify-center rounded-xl hover:cursor-pointer hover:bg-slate-100 md:hidden"
            >
              menu
            </i>
            <div className="hidden h-full grow items-center justify-start md:flex">
              {/* Search Bar */}
              <div className="relative mr-8 hidden grow items-center justify-center md:flex">
                <div className="relative w-full">
                  <div className='relative w-xl'>
                    <i className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                      search
                    </i>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Tüm Kitaplarda Ara"
                      className="w-full h-12 rounded-lg border border-slate-200 pl-10 pr-12 text-sm text-slate-600 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {isFocused ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400">enter</span>
                          <i className="material-symbols-outlined text-base text-slate-400">
                            keyboard_return
                          </i>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-base text-slate-400">/</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {user ? (
              <div className="hidden md:block">
                <Avatar user={user} />
              </div>
            ) : (
              <div
                className="cursor-pointer rounded-sm bg-sky-700 px-3 py-2 hover:bg-sky-600 md:block"
                onClick={() => navigate('/login')}
              >
                <p className="text-nowrap text-white">Giriş Yap</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
