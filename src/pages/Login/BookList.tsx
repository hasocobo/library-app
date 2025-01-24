import axios from 'axios';
import { useEffect, useState } from 'react';

type Book = {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  publishYear: number;
  pageCount: number;
  quantity: number;
  description: string;
};

const BookList = () => {
  const [books, setBooks] = useState<Book[] | null>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = (
          await axios.get<Book[]>('http://localhost:5109/api/v1/books')
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
      <div>
        {books?.map((book) => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.id}</p>
            <p>Author: {book.authorName}</p>
            <p>Published Year: {book.publishYear}</p>
            <p>Page Count: {book.pageCount}</p>
            <p>Quantity: {book.quantity}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookList;
