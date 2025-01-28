import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@headlessui/react';
import TBorrowedBook from '../../types/BorrowedBook';
import { useUser } from '../../context/UserProvider';
import bookImage from '../../assets/cover.png';

const api = axios.create({
  baseURL: `http://localhost:5109/api/v1/`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

const BorrowedBookView = () => {
  const [book, setBook] = useState<TBorrowedBook | null>(null);
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
        const response = await api.get<TBorrowedBook>(
          `borrowed-books/${borrowedBookId}`
        );
        setBook(response.data);
      } catch (err) {
        console.error('Veri alınırken hata oluştu:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || 'Veri alınırken bir hata oluştu'
            : 'Beklenmeyen bir hata oluştu'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [borrowedBookId, user?.id]);

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
        {/* Kitap Resmi ve Temel Bilgiler */}
        <div className="md:w-1/3">
          <img
            src={book.imageUrl}
            alt={`${book.title} kapak resmi`}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = bookImage;
            }}
          />
          <div className="mt-4 space-y-2">
            <h1 className="text-2xl font-bold text-slate-700">{book.title}</h1>
            <p className="text-xl text-slate-500">{book.authorName}</p>
          </div>
        </div>

        {/* Kitap Detayları ve İşlemler */}
        <div className="md:w-2/3">
          {/* Kitap Açıklaması */}
          <section className="prose max-w-none">
            <h2 className="mb-2 text-xl font-semibold text-slate-700">
              Kitap Hakkında
            </h2>
            <p className="pb-4 text-base leading-relaxed text-slate-600">
              {book.description || 'Bu kitap hakkında mevcut bir açıklama yok.'}
            </p>
          </section>

          {/* Ödünç Alma Detayları */}
          <section className="mt-6 rounded-lg bg-slate-50 p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">
              Ödünç Alma Bilgileri
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Ödünç Alma Tarihi:</span>{' '}
                {new Date(book.borrowingDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Son Teslim Tarihi:</span>{' '}
                {book.dueDate
                  ? new Date(book.dueDate).toLocaleDateString()
                  : 'Belirtilmemiş'}
              </div>
              <div>
                <span className="font-medium">Durum:</span>{' '}
                <span
                  className={`font-semibold ${book.isReturned ? 'text-green-600' : 'text-amber-600'}`}
                >
                  {book.isReturned ? 'İade Edildi' : 'Ödünç Alındı'}
                </span>
              </div>
              {book.returningDate && (
                <div>
                  <span className="font-medium">İade Tarihi:</span>{' '}
                  {new Date(book.returningDate).toLocaleDateString()}
                </div>
              )}
              <div>
                <span className="font-medium">Ceza Ücreti:</span>{' '}
                {book.penaltyPrice?.toFixed(2)} TL
              </div>
              
            </div>

            {!book.isReturned && (
              <div className="mt-6">
                <Button
                  onClick={() => {
                    // Kitap iade etme işlemi buraya eklenecek
                  }}
                  className="w-full rounded-sm bg-green-700 px-4 py-2 text-sm font-medium font-semibold text-white transition-colors hover:bg-green-800"
                >
                  Kitabı İade Et
                </Button>
              </div>
            )}
          </section>

          {/* Ek Bilgiler */}
          <section className="mt-6 rounded-lg bg-slate-50 p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">
              Ek Bilgiler
            </h2>
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
