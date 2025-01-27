import axios from 'axios';
import { useEffect, useState } from 'react';
import TBook from '../../types/Book';
import Book from '../../components/Book/Book';
import { useUser } from '../../context/UserProvider';

// Axios instance for API calls
const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { 'Content-Type': 'application/json' },
});

// Example books for fallback or testing
const exampleBooks: TBook[] = [
  {
    bookId: '1',
    title: 'The Great Adventure',
    authorName: 'John Doe',
    authorId: 'auth1',
    publishYear: 1999,
    pageCount: 320,
    quantity: 10,
    description: 'An epic tale of discovery and courage.',
  },
  {
    bookId: '2',
    title: 'Mystery of the Unknown',
    authorName: 'Jane Smith',
    authorId: 'auth2',
    publishYear: 2005,
    pageCount: 250,
    quantity: 5,
    description: 'A gripping mystery that keeps you on edge.',
  },
  {
    bookId: '3',
    title: 'Journey Through Time',
    authorName: 'Emily Taylor',
    authorId: 'auth3',
    publishYear: 2012,
    pageCount: 400,
    quantity: 8,
    description: 'A time travel adventure spanning centuries.',
  },
  {
    bookId: '4',
    title: 'The Lost Kingdom',
    authorName: 'Michael Brown',
    authorId: 'auth4',
    publishYear: 2018,
    pageCount: 500,
    quantity: 7,
    description: 'A thrilling quest to uncover a hidden kingdom.',
  },
  {
    bookId: '5',
    title: 'Cooking with Love',
    authorName: 'Sophia Johnson',
    authorId: 'auth5',
    publishYear: 2010,
    pageCount: 150,
    quantity: 15,
    description: 'Delicious recipes and heartwarming stories.',
  },
];

const BorrowedBookList = () => {
  const [books, setBooks] = useState<TBook[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        const response = await api.get<TBook[]>(`users/${user.id}/borrowed-books`);
        if (isMounted) {
          setBooks(response.data);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch borrowed books. Please try again later.');
          setBooks(exampleBooks); 
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
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-slate-600">Yükleniyor...</p>
      </div>
    );
  }

  if (!loading && !error && books?.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-slate-600 font-semibold">Henüz bir kitap ödünç almadınız.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="px-4 py-6 text-slate-600">
        <p className="mb-4 text-sm font-semibold tracking-wide text-slate-600">
          Ödünç Aldığın Tüm Kitaplar
        </p>
        <div className="p-1">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {books?.map((book) => (
              <div key={book.bookId}>
                <Book bookElement={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBookList;