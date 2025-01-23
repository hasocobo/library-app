import { createContext, useContext, useState, ReactNode } from 'react';
import React from 'react';

type User = {
  name: string;
  surname: string;
  role: string;
};

const exampleUser: User = {
  name: 'Hasan',
  surname: 'Çoban',
  role: 'admin',
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(exampleUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
