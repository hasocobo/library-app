import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const NavItem = function ({ link, name, onClick, style, icon }) {
  return (
    <Link
      to={link}
      className={`items-center rounded-sm p-3 transition 
     duration-200 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-300 ${style}`}
      onClick={onClick}
    >
      <div className='flex items-center text-slate-700 gap-1'>
        <i className='material-symbols-outlined text-slate-400'>{icon}</i>
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