import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.tsx';
import Signup from './pages/Login/Signup.tsx';
import { UserProvider } from './context/UserProvider.tsx';
import BookList from './pages/Login/BookList.tsx';
import BookView from './components/Book/BookView.tsx';

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <BookList />
      },
      {
        path: 'mybooks',
        element: <BookList />
      },
      {
        path: 'browse',
        element: <BookList />
      },
      {
        path: 'browse/:bookId',
        element: <BookView />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
