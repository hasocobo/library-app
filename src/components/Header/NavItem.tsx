import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const NavItem = function ({ link, name, onClick, style, textStyle, icon, iconStyle }) {
  return (
    <Link
      to={link}
      className={`items-center px-4 h-full flex transition
     duration-300 hover:cursor-pointer hover:border-b-2 border-sky-600 border-opacity-50 active:border-b-2 ${style}`}
      onClick={onClick}
    >
      <div className={`flex items-center gap-1 ${textStyle}`}>
        <i className={`material-symbols-outlined font-extralight ${iconStyle}`}>{icon}</i>
       {name}
      </div>
    </Link>
  )
}

NavItem.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string
}

export default NavItem