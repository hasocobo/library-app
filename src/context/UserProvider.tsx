import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  role?: string,
  roles: string[]; // Roles as an array of strings
};

/*const initialUser: User = {
  id: '',
  username: '',
  email: '',
  firstName: 'Ziyaretçi',
  lastName: 'Ziyaretçi',
  dateOfBirth: '',
  role: 'admin',
  roles: [],
}; */

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    // Load user from localStorage if it exists
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
  }, [user]);

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
