import React from 'react';

type User = {
  firstName?: string,
  lastName?: string,
  pfp?: string
};

type UserIconProps = {
  onClick?: () => void, 
  user?: User,
  style?: string,
  textStyle?: string 
};

// Default export for the UserIcon component
export default function UserIcon({ onClick, user, style, textStyle }: UserIconProps) {
  return (
    <div onClick={onClick}>
      <div
        onClick={onClick}
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-sky-50 hover:cursor-pointer ${style}`}
      >
        <div className={`absolute font-semibold text-sky-800 ${textStyle}`}>
          {user?.firstName && user.firstName.charAt(0)}
          {user?.lastName && user.lastName.charAt(0)}
          {!user?.firstName && !user?.lastName && user?.pfp}
        </div>
      </div>
    </div>
  );
}