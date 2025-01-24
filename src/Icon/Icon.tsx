import { Link, useParams } from 'react-router-dom'

export default function Icon({ name }) {
  return (
    <div className="material-symbols-outlined icon flex cursor-pointer items-center justify-center">
      <div className="icon">{name}</div>
    </div>
  )
}