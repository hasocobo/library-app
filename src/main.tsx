import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.tsx';
import Signup from './pages/Login/Signup.tsx';
import { UserProvider } from './context/UserProvider.tsx';
import BookList from './pages/Login/BookList.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: []
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/books',
    element: <BookList />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
