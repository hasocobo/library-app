import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import NavItem from './NavItem';
import Avatar from './Avatar';
import { useUser } from '../../context/UserProvider';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition
} from '@headlessui/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TGenre from '../../types/Genre';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { 'Content-Type': 'application/json' }
});

export default function AdminHeader({ onMenuClick }) {
  const { user } = useUser();
  const location = useLocation();
  let pageName = location.pathname.slice(1).split('/')[0];

  const [genres, setGenres] = useState<TGenre[]>([]);
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
    const fetchGenres = async () => {
      try {
        const response = await api.get('genres');
        const data = response.data;
        setGenres(data);
      } catch (err) {}
    };

    fetchGenres();
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
            <div className="hidden h-full w-full items-center justify-start md:flex">
              <div className="flex h-full items-center gap-4">
                <NavItem
                  icon={'settings'}
                  name={'Admin İşlemleri'}
                  link={'/admin'}
                  iconStyle={
                    pageName === '' ? 'text-slate-300' : 'text-slate-300'
                  }
                  textStyle={
                    pageName === '' ? 'text-sky-700' : 'text-slate-600'
                  }
                  style={pageName === 'admin' ? 'selected' : ''}
                  onClick={undefined}
                />
                
              </div>
              {/* Search Bar */}
              <div className="relative mr-8 hidden grow items-center justify-center md:flex">
                <div className="relative">
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
                    placeholder="Kitap Ara"
                    className="h-10 w-96 rounded-lg border border-slate-200 pl-10 pr-12 text-sm text-slate-600 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
