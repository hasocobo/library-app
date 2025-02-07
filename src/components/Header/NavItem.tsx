import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface NavItemProps {
  link: string;
  name?: string;
  onClick?: () => void;
  style?: string;
  textStyle?: string;
  icon?: string;
  iconStyle?: string;
  children?: ReactNode;
}

const NavItem = ({
  link,
  name,
  onClick = () => {},
  style = '',
  textStyle = '',
  icon,
  iconStyle = '',
  children
}: NavItemProps) => {
  return (
    <Link
      to={link}
      onClick={onClick}
      className={`items-center lg:text-sm relative px-4 h-full flex transition duration-300
         hover:cursor-pointer hover:border-b-2 border-sky-600 border-opacity-50
         active:border-b-2 ${style}`}
    >
      {(icon || name) && (
        <div className={`flex items-center gap-1 ${textStyle}`}>
          {icon && (
            <i className={`material-symbols-outlined font-extralight ${iconStyle}`}>
              {icon}
            </i>
          )}
          {name}
        </div>
      )}
      {children}
    </Link>
  );
};

export default NavItem;