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
import AdminDashboard from './components/Layouts/AdminDashboard.tsx';
import BookManagement from './components/Admin/Pages/BookManagement.tsx';
import BorrowedBookManagement from './components/Admin/Pages/BorrowedBookManagement.tsx';
import UserManagement from './components/Admin/Pages/UserManagement.tsx';
import GenreManagement from './components/Admin/Pages/GenreManagement.tsx';
import AuthorManagement from './components/Admin/Pages/AuthorManagement.tsx';
import LibrarianDashboard from './components/Layouts/LibrarianDashboard.tsx';


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
            element: <BookManagement />
          },
          {
            path: 'borrowedbooks',
            element: <BorrowedBookManagement />
          },
          {
            path: 'users',
            element: <UserManagement />
          },
          {
            path: 'genres',
            element: <GenreManagement />
          },
          {
            path: 'authors',
            element: <AuthorManagement />
          }
        ]
      }
    ]
  },
  {
    path: '/librarian',
    element: <PrivateRoute allowedRoles={['Admin', 'Librarian'] } />,
    children: [
      {
        path: '',
        element: <LibrarianDashboard />,
        children: [
          {
            path: 'books',
            element: <BookManagement />
          },
          {
            path: 'borrowedbooks',
            element: <BorrowedBookManagement />
          },
          {
            path: 'genres',
            element: <GenreManagement />
          },
          {
            path: 'authors',
            element: <AuthorManagement />
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
