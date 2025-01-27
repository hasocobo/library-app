import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import Avatar from './Avatar';
import { useUser } from '../../context/UserProvider';

export default function Header({ onMenuClick }) {
  const { user } = useUser();
  let pageName = useLocation().pathname.slice(1).split('/')[0];
  const navigate = useNavigate();

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
                />
                <NavItem
                  icon={'book'}
                  name={'Kitaplarım'}
                  link={'/mybooks'}
                  iconStyle={
                    pageName === 'mybooks' ? 'text-slate-300' : 'text-slate-300'
                  }
                  textStyle={
                    pageName === 'mybooks' ? 'text-sky-700' : 'text-slate-500'
                  }
                  style={pageName === 'mybooks' ? 'selected' : ''}
                  onClick={undefined}
                />
                <NavItem
                  icon={'expand_circle_down'}
                  name={'Gözat'}
                  link={'/browse'}
                  iconStyle={
                    pageName === 'browse' ? ' text-slate-300' : 'text-slate-300'
                  }
                  textStyle={
                    pageName === 'browse' ? 'text-sky-700' : 'text-slate-500'
                  }
                  style={pageName === 'browse' ? 'selected' : ''}
                  onClick={undefined}
                />
              </div>
            </div>
            {user ? (
              <div className="hidden md:block">
                <Avatar user={user} />
              </div>
            ) : (
              <div
                className=" cursor-pointer rounded-sm bg-sky-700 px-2 py-1 hover:bg-sky-600 md:block"
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
