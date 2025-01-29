import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@headlessui/react';
import Book from '../components/Book/Book';
import TBook from '../types/Book';
import TGenre from '../types/Genre';
import BookSkeleton from '../components/BookSkeleton';
import PaginationHeader from '../types/PaginationHeader';
import Pagination from '../components/Pagination';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { 'Content-Type': 'application/json' }
});

const BookList = () => {
  // Initialize state variables
  const [books, setBooks] = useState<TBook[] | null>(null);
  const [genre, setGenre] = useState<TGenre | null>(null);
  const [paginationHeader, setPaginationHeader] = useState<PaginationHeader | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get URL parameters and navigation functions
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the page number from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        if (slug) {
          // Handle genre-specific book fetching
          const response = await api.get<TGenre>(`genres/${slug}`);
          setGenre(response.data);
          setBooks(response.data.books);
        } else {
          // Handle paginated book fetching
          const response = await api.get<TBook[]>(`books`, {
            params: {
              PageNumber: currentPage,
              PageSize: 6
            }
          });
          setBooks(response.data);
          setPaginationHeader(JSON.parse(response.headers["libraryapi-pagination"]));
        }
      } catch (error) {
        console.error('Error while fetching data', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [slug, currentPage]); // Dependencies now include currentPage instead of page

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col">
      <div className="flex grow flex-col px-4 py-6 text-slate-600">
        <p className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
          <Link to="/" className="text-slate-400 hover:text-slate-500">
            Türler
          </Link>
          {genre && (
            <>
              <span className="font-bold text-slate-600"> {'>'} </span>
              {genre.name}
            </>
          )}
        </p>
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
              {books.map((book) => (
                <div key={book.bookId}>
                  <Book bookElement={book} link={`/browse/${book.bookId}`} />
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
                onClick={() => navigate('/')}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          )}
        </div>
        <div className="flex grow justify-center">
          <div className="flex items-center gap-1 self-end">
            <Pagination paginationHeader={paginationHeader}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
