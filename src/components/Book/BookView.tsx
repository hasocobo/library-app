import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@headlessui/react';
import TBook from '../../types/Book';
import bookImage from '../../assets/cover.png';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json" }
});

const BookView = () => {
  const [book, setBook] = useState<TBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [borrowingError, setBorrowingError] = useState<string | null>(null);
  const { bookId } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 2)).toISOString().split('T')[0];

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<TBook>(`books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || 'An error occurred while fetching book details'
            : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };
    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleBorrowBook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!localStorage.getItem('jwtToken')) {
      navigate('/login');
      return;
    }

    if (!dueDate) {
      setBorrowingError('Lütfen bir iade tarihi seçin');
      return;
    }

    try {
      setBorrowingError(null);
      const response = await api.post(`users/${localStorage.userId}/borrowed-books`, {
        bookId: bookId,
        dueDate: new Date(dueDate).toISOString()
      });
      // todo: onaylandı mesajı göster
    } catch (error) {
      console.error("An error occurred when borrowing a book", error);
      setBorrowingError('Kitap ödünç alma işlemi başarısız oldu');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex h-96 items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-slate-700"></div>
          <span className="text-slate-600">Kitap detayları yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto flex h-96 items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-700">Kitap Bulunamadı</h2>
          <p className="mt-2 text-slate-500">Bu kitap mevcut değil veya kaldırılmış olabilir.</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <img
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
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
              {book.description || 'Bu kitap hakkında mevcut bir açıklama yok.'}
            </p>
          </section>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              {book.quantity > 0 ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <i className="material-symbols-outlined text-green-600">check_circle</i>
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <i className="material-symbols-outlined text-red-600">error</i>
                </div>
              )}
              <div>
                <p className="font-medium text-slate-700">
                  {book.quantity > 0 ? 'Ödünç Alınabilir' : 'Mevcut Değil'}
                </p>
                <p className="text-sm text-slate-500">
                  {book.quantity > 0 
                    ? `${book.quantity} adet mevcut` 
                    : 'Şu anda ödünç alınamaz'}
                </p>
              </div>
            </div>

            {book.quantity > 0 && (
              <div className="mt-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                  İade Tarihi
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  min={minDate}
                  max={maxDate}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                {borrowingError && (
                  <p className="mt-2 text-sm text-red-600">{borrowingError}</p>
                )}
                <Button
                  onClick={handleBorrowBook}
                  className="mt-4 w-full rounded-lg bg-sky-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:bg-slate-300"
                  disabled={!dueDate}
                >
                  Ödünç Al
                </Button>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <section className="mt-6 rounded-lg bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Ek Bilgi</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Yayın Yılı:</span> {book.publishYear}
              </div>
              <div>
                <span className="font-medium">Tür:</span> {book.genreName}
              </div>
              <div>
                <span className="font-medium">Sayfa Sayısı:</span> {book.pageCount}
              </div>
              <div>
                <span className="font-medium">Stok:</span> {book.quantity} adet
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookView;