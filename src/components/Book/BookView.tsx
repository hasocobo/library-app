import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TBook from '../../types/Book';
import bookImage from '../../assets/cover.png';
import { Button } from '@headlessui/react';
const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json" }
});
const exampleBook: TBook = {
  id: 'fallback-book-001',
  title: 'Untitled Book',
  authorName: 'Unknown Author',
  authorId: 'unknown-author-id',
  publishYear: new Date().getFullYear(),
  pageCount: 0,
  quantity: 0,
  description: 'No description available for this book.',
  imageUrl: '../../assets/cover.png',
  genreName: 'Uncategorized'
};

const BookView = () => {
  const [book, setBook] = useState<TBook | null>(exampleBook);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const { bookId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<TBook>(`books/${bookId}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ||
                'An error occurred while fetching book details'
            : 'An unexpected error occurred'
        );
        setLoading(false);
      }
    };
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleBorrowBook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!localStorage.getItem('jwtToken')) navigate('/login');

    try {
      const response = await api.post(`users/${localStorage.userId}/borrowed-books`, {
        "bookId": bookId,
        "dueDate": dueDate
      });
      console.log(response.data);
    } catch (error) {
      console.error("An error occurred when borrowing a book", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex h-screen items-center justify-center p-4">
        <div role="status">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return <div className="mx-auto p-4">No book found</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <img
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            className="h-[500px] w-full object-cover shadow-lg"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = bookImage;
            }}
          />
          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-bold text-slate-700">{book.title}</h2>
            <p className="text-xl text-slate-500">{book.authorName}</p>
          </div>
        </div>
        <div className="md:w-2/3">
          <section className="prose max-w-none">
            <h3 className="mb-2 text-xl font-semibold text-slate-700">
              Kitap Hakkında
            </h3>
            <p className="pb-4 text-base leading-relaxed text-slate-600">
              {book.description
                ? book.description
                : 'Bu kitap hakkında mevcut bir açıklama yok.'}
            </p>
          </section>
          <div>
            <div className="flex items-center gap-2">
              { book.quantity > 0 ?
              <i
                className={`material-symbols-outlined relative top-[-5px] flex size-6 p-2 items-center justify-center rounded-full font-extralight text-green-700`}
              >
                check_circle
              </i>
              :
              <i
              className={`material-symbols-outlined relative top-[-5px] flex size-6 p-2 text-red-700 items-center justify-center rounded-full font-extralight`}
            >
              error
            </i>
}
              <p className=" text-sm text-slate-600 mb-3">
              { book.quantity > 0 ? "Kitap ödünç alınmak için uygun" : "Kitap ödünç almak için mevcut değil" }
              </p>
            </div>
            <Button
              onClick={handleBorrowBook}
              className="rounded-sm mt-2 border border-sky-700 border-opacity-0 bg-sky-100 px-2 py-1 text-sm font-semibold text-sky-600 data-[active]:border-opacity-25 data-[hover]:bg-sky-200"
            >
              Ödünç Al
            </Button>
          </div>
          <section className="mt-4 rounded-md bg-gray-50 p-4">
            <h3 className="mb-4 text-xl font-semibold">Ek Bilgi</h3>
            <div className="text-sm text-gray-600">
              <p>Çıktığı Yıl: {book?.publishYear}</p>
              <p>Tür: {book?.genreName}</p>
              <p>Mevcut adet: {book?.quantity}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {book.pageCount && (
                <p>
                  <span>Page Count:</span> {book.pageCount}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookView;
