export default function UserIcon({ onClick, user, style, textStyle }) {
  return (
    <div onClick={onClick}>
      <div
        onClick={onClick}
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-sky-50 hover:cursor-pointer ${style}`}
      >
        <div className={`absolute font-semibold text-sky-800 ${textStyle}`}>
          {user && user.firstName && (user.firstName.charAt(0) || user.pfp)}{''}
          {user && user.lastName && (user.lastName.charAt(0) || user.pfp)}
        </div>
      </div>
    </div>
  );
}
