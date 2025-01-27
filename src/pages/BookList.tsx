import axios from 'axios';
import { useEffect, useState } from 'react';
import TBook from '../types/Book';
import Book from '../components/Book/Book';

const exampleBooks: TBook[] = [
  {
    id: '1',
    title: 'The Great Adventure',
    authorName: 'John Doe',
    authorId: 'auth1',
    publishYear: 1999,
    pageCount: 320,
    quantity: 10,
    description: 'An epic tale of discovery and courage.'
  },
  {
    id: '2',
    title: 'Mystery of the Unknown',
    authorName: 'Jane Smith',
    authorId: 'auth2',
    publishYear: 2005,
    pageCount: 250,
    quantity: 5,
    description: 'A gripping mystery that keeps you on edge.'
  },
  {
    id: '3',
    title: 'Journey Through Time',
    authorName: 'Emily Taylor',
    authorId: 'auth3',
    publishYear: 2012,
    pageCount: 400,
    quantity: 8,
    description: 'A time travel adventure spanning centuries.'
  },
  {
    id: '4',
    title: 'The Lost Kingdom',
    authorName: 'Michael Brown',
    authorId: 'auth4',
    publishYear: 2018,
    pageCount: 500,
    quantity: 7,
    description: 'A thrilling quest to uncover a hidden kingdom.'
  },
  {
    id: '5',
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = (
          await axios.get<TBook[]>('http://localhost:5109/api/v1/books')
        ).data;
        setBooks(books);
      } catch (error) {
        console.error('Error while fetching data', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="px-4 py-6 text-slate-600">
          <p className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
            Türler<span className="font-bold text-slate-600"> {'>'} </span>Tüm
            Kitaplar
          </p>
          <div className="p-1">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {books?.map((book) => (
                <div key={book.id}>
                  <Book bookElement={book} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookList;
