export default function UserIcon({ onClick, user }) {
  return (
    <div onClick={onClick}>
      <div
        onClick={onClick}
        className="relative flex h-12 w-12 shrink-0 items-center 
        justify-center rounded-[50%] border bg-sky-50 hover:cursor-pointer
        "
      >
        <div className="absolute">{user.name.charAt(0) || user.pfp}</div>
      </div>
    </div>
  )
}