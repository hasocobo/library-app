import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@headlessui/react';
import { useUser } from '../../context/UserProvider';
import TBorrowedBook from '../../types/BorrowedBook';
import BookSkeleton from '../../components/BookSkeleton';
import BorrowedBook from '../../components/Book/BorrowedBook';
import PaginationHeader from '../../types/PaginationHeader';
import Pagination from '../../components/Pagination';
import api from '../../api';


const BorrowedBookList = () => {
  // State declarations with pagination additions
  const [books, setBooks] = useState<TBorrowedBook[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationHeader, setPaginationHeader] = useState<PaginationHeader | null>(null);
  
  // Hooks
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  
  // Get current page from URL parameters
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<TBorrowedBook[]>(`users/${user.id}/borrowed-books`, {
          params: {
            PageNumber: currentPage,
            PageSize: 6
          }
        });
        
        if (isMounted) {
          setBooks(response.data);
          // Parse pagination header from response
          setPaginationHeader(JSON.parse(response.headers['libraryapi-pagination']));
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch borrowed books. Please try again later.');
          setBooks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [user.id, currentPage]);

  return (
    <div className="mx-auto max-w-5xl flex h-full flex-col">
      <div className="flex h-full flex-col grow px-4 py-6 text-slate-600">
        <p className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
          Ödünç Aldığınız Tüm Kitaplar
        </p>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="p-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index}>
                  <BookSkeleton />
                </div>
              ))}
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {books.map((book, index) => (
                <div key={index}>
                  <BorrowedBook bookElement={book} link={`/mybooks/${book.id}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12">
              <svg
                className="h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                Kitap bulunamadı
              </h3>
              <p className="mt-1 text-center text-sm text-slate-500">
                Henüz kitap ödünç almadınız.
              </p>
              <Button
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-sm/6 font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50 focus:outline-none data-[hover]:bg-slate-50 data-[open]:bg-slate-100 data-[focus]:outline-1 data-[focus]:outline-slate-700"
                onClick={() => navigate("/")}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          )}
        </div>

        {books && books.length > 0 && (
          <div className="flex grow justify-center">
            <div className="flex items-center gap-1 self-end">
              <Pagination paginationHeader={paginationHeader} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBookList;