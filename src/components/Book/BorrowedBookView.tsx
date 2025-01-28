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

const BorrowedBookView = () => {
  const [book, setBook] = useState<TBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { borrowedBookId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!borrowedBookId || !user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const borrowedBook = (await api.get<TBook>(`borrowed-books/${borrowedBookId}`)).data;

        setBook(borrowedBook);
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
  }, [borrowedBookId, user?.id]);

  const BorrowingStatus = () => {
    
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

          {/*<BorrowingStatus />*/}

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

export default BorrowedBookView;
