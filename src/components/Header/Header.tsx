import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import Avatar from './Avatar';
import { useUser } from '../../context/UserProvider';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition
} from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TGenre from '../../types/Genre';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { 'Content-Type': 'application/json' }
});
export default function Header({ onMenuClick }) {
  const { user } = useUser();
  let pageName = useLocation().pathname.slice(1).split('/')[0];

  const [genres, setGenres] = useState<TGenre[]>([]);
  const navigate = useNavigate();

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

  return (
    <div className="relative sticky w-full border-b border-slate-100 bg-white text-sm font-semibold">
      <div className="mx-auto max-w-7xl">
        <div className="px-4">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/*
            <Link to={'/'} className="hover:cursor-pointer">
<img src={Logo} alt="logo" className="md:w-32 w-20" />
            </Link>
          */}
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
                    pageName === '' ? ' text-slate-300' : 'text-slate-300'
                  }
                  textStyle={
                    pageName === '' ? 'text-sky-700' : 'text-slate-500'
                  }
                  style={pageName === '' ? 'selected' : ''}
                  onClick={undefined}
                ></NavItem>
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
                  ></NavItem>
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
                      .filter((genre) => !genre.parentGenreId) // Filter top-level genres
                      .map((genre) => (
                        <Link
                          key={genre.id}
                          to={`/genre/${genre.slug}`} // Use slug in the URL
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
                      .filter((genre) => genre.parentGenreId) // Filter subgenres
                      .map((genre) => (
                        <Link
                          key={genre.id}
                          to={`/genre/${genre.slug}`} // Use slug in the URL
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
