import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@headlessui/react';
import TBook from '../../types/Book';
import bookImage from '../../assets/cover.png';
import TBorrowedBook from '../../types/BorrowedBook';
import BorrowingStatus from '../../types/BorrowingStatus';
import { useUser } from '../../context/UserProvider';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

const BookView = () => {
  const [book, setBook] = useState<TBook | null>(null);
  const [borrowedBook, setBorrowedBook] = useState<TBorrowedBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>('');
  const [borrowingSuccess, setBorrowingSuccess] = useState<BorrowingStatus>(0); // 0: varsayılan, 1: başarılı, -1: hata, 2: zaten ödünç alındı
  const { bookId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 2))
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      if (!bookId) return;

      setLoading(true);
      setError(null);

      try {
        const [bookResponse, borrowedBookResponse] = await Promise.all([
          api.get<TBook>(`books/${bookId}`),
          user && api
            .get<TBorrowedBook>(`users/${user.id}/borrowed-books/${bookId}`)
            .catch((err) => {
              if (err.response?.status === 404) {
                return { data: null };
              }
              throw err;
            })
        ]);

        setBook(bookResponse.data);
        if (borrowedBookResponse.data) {
          setBorrowedBook(borrowedBookResponse.data);
          setBorrowingSuccess(2);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ||
                'An error occurred while fetching data'
            : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, user?.id]);

  const handleBorrowBook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!localStorage.getItem('jwtToken')) {
      navigate('/login');
      return;
    }

    if (!dueDate) {
      setBorrowingSuccess(-1);
      return;
    }

    try {
      const response = await api.post(
        `users/${localStorage.userId}/borrowed-books`,
        {
          bookId: bookId,
          dueDate: new Date(dueDate).toISOString()
        }
      );
      if (response.status === 201) {
        setBorrowingSuccess(1);
      }
    } catch (error) {
      console.error('An error occurred when borrowing a book', error);
      setBorrowingSuccess(-1);
    }
  };

  const BorrowingStatus = () => {
    switch (borrowingSuccess) {
      case 1:
        return (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 items-center justify-center gap-2">
                <i className="material-symbols-outlined flex size-8 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                  check_circle
                </i>
                <h3 className="text-lg font-semibold text-green-800">
                  Ödünç Alma İşlemi Başarılı
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-slate-500">
                  Kitabı{' '}
                  <span className="font-semibold text-slate-600">
                    {' '}
                    {new Date(dueDate).toLocaleDateString('tr-TR')}
                  </span>{' '}
                  tarihine kadar iade etmeniz gerekmektedir.
                </p>
                <Button
                  onClick={() => navigate('/mybooks')}
                  className="mt-4 rounded-sm bg-green-700 px-2 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Ödünç Aldığım Kitapları Görüntüle
                </Button>
              </div>
            </div>
          </div>
        );
      case -1:
        return (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center gap-2">
                <i className="material-symbols-outlined flex size-8 items-center justify-center rounded-full bg-red-100 text-2xl text-red-800">
                  error
                </i>
                <h3 className="text-lg font-semibold text-slate-800">
                  Ödünç Alma İşlemi Başarısız
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <p className="mt-1 text-sm text-slate-500">
                  {!dueDate
                    ? 'Lütfen bir iade tarihi seçin.'
                    : 'Kitap ödünç alma işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
                </p>
                <Button
                  onClick={() => setBorrowingSuccess(0)}
                  className="mt-4 rounded-sm bg-red-800 px-3 py-2 text-sm font-medium font-semibold text-white hover:bg-red-900"
                >
                  Tekrar Dene
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 items-center justify-center gap-2">
                <i className="material-symbols-outlined flex size-8 items-center justify-center rounded-full bg-blue-100 text-2xl text-sky-600">
                  info
                </i>
                <h3 className="text-lg font-semibold text-slate-800">
                  Bu kitabı ödünç aldınız
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-slate-500 text-center">
                  Bu kitap şu anda sizde bulunuyor. Kitabı iade etmek veya diğer ödünç aldığınız kitapları görüntülemek için aşağıya tıklayınız.
                </p>
                <div className='flex w-full gap-2 justify-center'>
                  <Button
                    onClick={() => navigate('/mybooks')}
                  className="mb-2 mt-4 rounded-sm p-2 text-sm font-semibold border border-sky-700 hover:bg-sky-700 hover:text-white transition text-sky-800"
                  >
                    Tüm Kitapları Görüntüle
                  </Button>
                  <Button
                    className="mb-2 mt-4 rounded-sm bg-sky-700 px-2 py-2 text-sm font-semibold transition text-white hover:bg-sky-900"
                    onClick={() => navigate(`/mybooks/${borrowedBook?.id}`)}
                  >
                    Kitaba Git
                  </Button>

                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              {book && book.quantity > 0 ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <i className="material-symbols-outlined text-green-600">
                    check_circle
                  </i>
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <i className="material-symbols-outlined text-red-600">
                    error
                  </i>
                </div>
              )}
              <div>
                <p className="font-medium text-slate-700">
                  {book && book.quantity > 0
                    ? 'Ödünç Alınabilir'
                    : 'Mevcut Değil'}
                </p>
                <p className="text-sm text-slate-500">
                  {book && book?.quantity > 0
                    ? `${book.quantity} adet mevcut`
                    : 'Şu anda ödünç alınamaz'}
                </p>
              </div>
            </div>

            {book && book?.quantity > 0 && (
              <div className="mt-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-slate-700"
                >
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
                <Button
                  onClick={handleBorrowBook}
                  className="mt-4 w-full rounded-sm bg-green-800 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-900 disabled:bg-slate-300"
                  disabled={!dueDate}
                >
                  Ödünç Al
                </Button>
              </div>
            )}
          </div>
        );
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
          <h2 className="text-xl font-semibold text-slate-700">
            Kitap Bulunamadı
          </h2>
          <p className="mt-2 text-slate-500">
            Bu kitap mevcut değil veya kaldırılmış olabilir.
          </p>
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

          <BorrowingStatus />

          <section className="mt-6 rounded-lg bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">
              Ek Bilgi
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Yayın Yılı:</span>{' '}
                {book.publishYear}
              </div>
              <div>
                <span className="font-medium">Tür:</span> {book.genreName}
              </div>
              <div>
                <span className="font-medium">Sayfa Sayısı:</span>{' '}
                {book.pageCount}
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
