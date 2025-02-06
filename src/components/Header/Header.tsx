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

export default function Header({ onMenuClick }) {
  const { user } = useUser();
  const location = useLocation();
  let pageName = location.pathname.slice(1).split('/')[0];

  const [genres, setGenres] = useState<TGenre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
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
    /*
    const selectedAuthorId = searchParams.get('author');
    const selectedGenreId = searchParams.get('genre')

    if (selectedAuthorId) newSearchParams.set('author', selectedAuthorId);

    if (selectedGenreId) newSearchParams.set('genre', selectedGenreId);
*/
    if (searchTerm) {
      newSearchParams.set('q', searchTerm);
    } 

    navigate({
      pathname: '/browse',
      search: newSearchParams.toString()
    });
  };

  return (
    <div className="relative z-50 sticky w-full border-b border-slate-100 bg-white text-sm font-semibold">
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
                  icon={'home'}
                  name={'Ana Sayfa'}
                  link={'/'}
                  iconStyle={
                    pageName === '' ? 'text-slate-300' : 'text-slate-300'
                  }
                  textStyle={
                    pageName === '' ? 'text-sky-700' : 'text-slate-500'
                  }
                  style={pageName === '' ? 'selected' : ''}
                  onClick={undefined}
                />
                {user && (
                  <NavItem
                    icon={'book'}
                    name={'Kitaplarım'}
                    link={'/mybooks'}
                    iconStyle={
                      pageName === 'mybooks'
                        ? 'text-slate-300'
                        : 'text-slate-300'
                    }
                    textStyle={
                      pageName === 'mybooks' ? 'text-sky-700' : 'text-slate-500'
                    }
                    style={pageName === 'mybooks' ? 'selected' : ''}
                    onClick={undefined}
                  />
                )}
                <Popover className="relative">
                  {({ open, close }) => (
                    <>
                      <PopoverButton
                        className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none ${
                          pageName === 'browse' ? 'bg-slate-100' : ''
                        }`}
                      >
                        <span className="text-slate-500">Gözat</span>
                        <i className="material-symbols-outlined text-slate-400">
                          {open ? 'expand_less' : 'expand_more'}
                        </i>
                      </PopoverButton>

                      <Transition
                        show={open}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <PopoverPanel
                          static
                          className="absolute left-0 z-50 mt-2 w-screen max-w-4xl rounded-lg bg-white p-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="grid grid-cols-3 gap-8">
                            {/* Main Genres */}
                            <div>
                              <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-sky-700">
                                Ana Türler
                              </h3>
                              <div className="space-y-3">
                                {genres
                                  .filter((genre) => !genre.parentGenreId)
                                  .map((genre) => (
                                    <Link
                                      key={genre.id}
                                      to={`/genre/${genre.slug}`}
                                      onClick={close}
                                      className="block rounded-md px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                      {genre.name}
                                    </Link>
                                  ))}
                              </div>
                            </div>

                            {/* Subgenres */}
                            <div>
                              <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-sky-700">
                                Alt Türler
                              </h3>
                              <div className="space-y-3">
                                {genres
                                  .filter((genre) => genre.parentGenreId)
                                  .map((genre) => (
                                    <Link
                                      key={genre.id}
                                      to={`/genre/${genre.slug}`}
                                      onClick={close}
                                      className="block rounded-md px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                      {genre.name}
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </PopoverPanel>
                      </Transition>
                    </>
                  )}
                </Popover>
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
                    placeholder="Tüm Kitaplarda Ara..."
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
                <Avatar />
              </div>
            ) : (
              <div
                className="cursor-pointer rounded-sm bg-sky-700 px-3 py-2 hover:bg-sky-600 md:block"
                onClick={() => navigate('/login')}
              >
                <p className="text-nowrap text-white">Giriş Yap</p>
              </div>
            )}

            {user && user.roles.includes('Admin') ? (
              <div
                onClick={() => navigate('/admin/books')}
                className="bg-rounded-xl absolute right-10 ml-2 hidden cursor-pointer items-center justify-center gap-1 rounded-sm p-2 hover:bg-slate-100 md:flex"
              >
                <i className="material-symbols-outlined text-lg text-slate-500">
                  arrow_forward
                </i>
                <div className="text-nowrap text-sm font-semibold tracking-tight text-slate-700">
                  Admin Paneli
                </div>
              </div>
            ) : user && user.roles.includes('Librarian') ? (
              <div
                onClick={() => navigate('/librarian/books')}
                className="bg-rounded-xl absolute right-10 ml-2 hidden cursor-pointer items-center justify-center gap-1 rounded-sm p-2 hover:bg-slate-100 md:flex"
              >
                <i className="material-symbols-outlined text-lg text-slate-500">
                  arrow_forward
                </i>
                <div className="text-nowrap text-sm font-semibold tracking-tight text-slate-700">
                  Yönetim Paneli
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
