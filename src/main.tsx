import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.tsx';
import Signup from './pages/Login/Signup.tsx';
import { UserProvider } from './context/UserProvider.tsx';
import BookList from './pages/BookList.tsx';
import BookView from './components/Book/BookView.tsx';
import BorrowedBookList from './pages/BorrowedBooks/BorrowedBookList.tsx';
import BorrowedBookView from './components/Book/BorrowedBookView.tsx';
import Unauthorized from './pages/Unauthorized.tsx';
import PrivateRoute from './components/Authorization/PrivateRoute.tsx';
import AdminDashboard from './components/Admin/AdminDashboard.tsx';
import AdminBooks from './components/Admin/AdminBooks.tsx';
import AdminBorrowedBooks from './components/Admin/AdminBorrowedBooks.tsx';
import AdminUserManagement from './components/Admin/AdminUserManagement.tsx';
import AdminGenres from './components/Admin/AdminGenres.tsx';

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
        element: <BorrowedBookList />
      },
      {
        path: 'browse',
        element: <BookList />
      },
      {
        path: 'browse/:bookId',
        element: <BookView />
      },
      {
        path: 'genre/:slug',
        element: <BookList />
      },
      {
        path: 'mybooks/:borrowedBookId',
        element: <BorrowedBookView />
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
    /*element: <PrivateRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: 'b',
        element: <Signup />
      }
    ]*/
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },

  {
    path: '/admin',
    element: <PrivateRoute allowedRoles={['Admin']} />,
    children: [
      {
        path: '',
        element: <AdminDashboard />,
        children: [
          {
            path: 'browse',
            element: <BookList />
          },
          {
            path: 'books',
            element: <AdminBooks />
          },
          {
            path: 'borrowedbooks',
            element: <AdminBorrowedBooks />
          },
          {
            path: 'users',
            element: <AdminUserManagement />
          },
          {
            path: 'genres',
            element: <AdminGenres />
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
