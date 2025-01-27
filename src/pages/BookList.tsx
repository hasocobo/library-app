import axios from 'axios';
import { use, useEffect, useState } from 'react';
import TBook from '../types/Book';
import Book from '../components/Book/Book';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import TGenre from '../types/Genre';
import { Button } from '@headlessui/react';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { 'Content-Type': 'application/json' }
});

const exampleBooks: TBook[] = [
  {
    bookId: '1',
    title: 'The Great Adventure',
    authorName: 'John Doe',
    authorId: 'auth1',
    publishYear: 1999,
    pageCount: 320,
    quantity: 10,
    description: 'An epic tale of discovery and courage.'
  },
  {
    bookId: '2',
    title: 'Mystery of the Unknown',
    authorName: 'Jane Smith',
    authorId: 'auth2',
    publishYear: 2005,
    pageCount: 250,
    quantity: 5,
    description: 'A gripping mystery that keeps you on edge.'
  },
  {
    bookId: '3',
    title: 'Journey Through Time',
    authorName: 'Emily Taylor',
    authorId: 'auth3',
    publishYear: 2012,
    pageCount: 400,
    quantity: 8,
    description: 'A time travel adventure spanning centuries.'
  },
  {
    bookId: '4',
    title: 'The Lost Kingdom',
    authorName: 'Michael Brown',
    authorId: 'auth4',
    publishYear: 2018,
    pageCount: 500,
    quantity: 7,
    description: 'A thrilling quest to uncover a hidden kingdom.'
  },
  {
    bookId: '5',
    title: 'Cooking with Love',
    authorName: 'Sophia Johnson',
    authorId: 'auth5',
    publishYear: 2010,
    pageCount: 150,
    quantity: 15,
    description: 'Delicious recipes and heartwarming stories.'
  }
];

const BookList = () => {
  const [books, setBooks] = useState<TBook[] | null>(exampleBooks);
  const [genre, setGenre] = useState<TGenre | null>();
  const { slug } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let books: TBook[];
        if (slug) {
          const response = await api.get<TGenre>(`genres/${slug}`);
          setGenre(response.data);
          setBooks(response.data.books);
        } else {
          books = (await api.get<TBook[]>('books')).data;
          setBooks(books);
        }
      } catch (error) {
        console.error('Error while fetching data', error);
      }
    };
    fetchBooks();
  }, [slug]);

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="px-4 py-6 text-slate-600">
          <p className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
            {}
            <Link
              to="/"
              className="mb-4 text-sm font-semibold tracking-wide text-slate-400 hover:text-slate-500"
            >
              Türler
            </Link>
            <span className="font-bold text-slate-600"> {'>'} </span>{' '}
            {genre?.name}
          </p>
          <div className="p-1">
            {books && books?.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {books.map((book) => (
                  <div key={book.bookId}>
                    <Book bookElement={book} />
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
                  Bu türde henüz kitap bulunmamaktadır.
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
        </div>
      </div>
    </>
  );
};

export default BookList;
