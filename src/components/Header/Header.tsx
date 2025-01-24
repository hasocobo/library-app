import { Link, useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import Avatar from './Avatar';
import { useUser } from '../../context/UserProvider';

export default function Header({ onMenuClick }) {
  const { user } = useUser();
  let pageName = useLocation().pathname.slice(1).split('/')[0];

  return (
    <div className="sticky relative w-full border-b border-slate-100 bg-white text-sm font-semibold">

      <div className="mx-auto max-w-7xl">
        <div className="px-4">
          <div className="flex items-center justify-between h-20">
            <Link to={'/'} className="hover:cursor-pointer">
              {/*<img src={Logo} alt="station watch logo" className="md:w-32 w-20" />*/}
            </Link>
            <i onClick={onMenuClick} className="material-symbols-outlined hover:cursor-pointer md:hidden 
            hover:bg-slate-100 rounded-xl size-10 flex justify-center items-center">
              menu
            </i>
            <div className="hidden h-full w-full items-center justify-start md:flex">
              <div className="flex gap-4 h-full items-center">
                <NavItem
                  icon={'home'}
                  name={'Ana Sayfa'}
                  link={'/'}
                  iconStyle={pageName === '' ? ' text-slate-300' : 'text-slate-300'}
                  textStyle={pageName === '' ? 'text-sky-700' : 'text-slate-500'}
                  style={pageName === '' ? 'selected' : ''} onClick={undefined}                />
                <NavItem
                  icon={'book'}
                  name={'Kitaplarım'}
                  link={'/mybooks'}
                  iconStyle={pageName === 'mybooks' ? 'text-slate-300' : 'text-slate-300'}
                  textStyle={pageName === 'mybooks' ? 'text-sky-700' : 'text-slate-500'}
                  style={pageName === 'mybooks' ? 'selected' : ''} onClick={undefined}                />
                <NavItem
                  icon={'expand_circle_down'}
                  name={'Gözat'}
                  link={'/browse'}
                  iconStyle={pageName === 'browse' ? ' text-slate-300' : 'text-slate-300'}
                  textStyle={pageName === 'browse' ? 'text-sky-700' : 'text-slate-500'}
                  style={pageName === 'browse' ? 'selected' : ''} onClick={undefined}                />
              </div>
            </div>
            <div className="hidden md:block">
              <Avatar user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}