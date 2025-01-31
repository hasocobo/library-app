import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import TBook from '../../types/Book';
import { Button } from '@headlessui/react';

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books', {
          params: {
            SearchTerm: search,
            PageNumber: page,
            PageSize: pageSize
          }
        });

        setBooks(response.data);
        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
        }
      } catch (error) {
        console.error('Kitaplar alınırken hata oluştu:', error);
      }
    };

    fetchBooks();
  }, [search, page]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Kitap Yönetimi</h2>
        <Button className="flex items-center gap-1 bg-sky-800 hover:bg-sky-900 text-sky-800 p-2 rounded-sm">
          <i className='material-symbols-outlined text-white'>add</i>
          <span className='font-semibold text-white'>Kitap Ekle</span>
        </Button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Kitap ara..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <i className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
          search
        </i>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="border p-3">Başlık</th>
              <th className="border p-3">Yazar</th>
              <th className="border p-3">Yıl</th>
              <th className="border p-3">Sayfa Sayısı</th>
              <th className="border p-3">Tür</th>
              <th className="border p-3">Kitap ID</th>
              <th className="border p-3">Adet</th>
              <th className="border p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {books && books.length > 0 ? (
              books.map((book: TBook) => (
                <tr key={book.bookId} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{book.title}</td>
                  <td className="border p-3">{book.authorName}</td>
                  <td className="border p-3">{book.publishYear}</td>
                  <td className="border p-3">{book.pageCount}</td>
                  <td className="border p-3">{book.genreName}</td>
                  <td className="border p-3">{book.bookId}</td>
                  <td className="border p-3 text-center">{book.quantity}</td>
                  <td className="border p-3 text-center">
                    <button className="rounded-full p-2 hover:bg-gray-200">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Kitap bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`flex items-center gap-1 rounded-lg border px-4 py-2 ${
            page === 1
              ? 'border-gray-300 text-gray-400'
              : 'border-blue-400 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-gray-700 font-semibold">
          Sayfa {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`flex items-center gap-1 rounded-lg border px-4 py-2 ${
            page === totalPages
              ? 'border-gray-300 text-gray-400'
              : 'border-blue-400 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminBooks;
