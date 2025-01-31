import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@headlessui/react';
import TBorrowedBook from '../../types/BorrowedBook';

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await api.get('/borrowed-books', {
          params: {
            SearchTerm: search,
            PageNumber: page,
            PageSize: pageSize
          }
        });

        setBorrowedBooks(response.data);
        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
        }
      } catch (error) {
        console.error('Ödünç alınan kitaplar alınırken hata oluştu:', error);
      }
    };

    fetchBorrowedBooks();
  }, [search, page]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Tüm Ödünç Alınan Kitaplar
        </h2>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Ödünç alınan kitap ara..."
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
              <th className="border p-3">Ödünç Alan</th>
              {/*<th className="border p-3">Ödünç Alan ID</th>*/}
              <th className="border p-3">Alınma Tarihi</th>
              <th className="border p-3">Durum</th>
              <th className="border p-3">İade Tarihi</th>
              <th className="border p-3">Son Teslim Tarih</th>
              <th className="border p-3">Ceza Ücreti</th>
              <th className="border p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks && borrowedBooks.length > 0 ? (
              borrowedBooks.map((book: TBorrowedBook) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{book.title}</td>
                  <td className="border p-3">{book.authorName}</td>
                  <td className="border p-3">{book.borrowerName}</td>
                  <td className="border p-3">
                    {new Date(book.borrowingDate).toLocaleDateString()}
                  </td>
                  {/*<td className="border p-3">{book.borrowerId}</td>*/}
                  <td className="border p-3">
                    {book.isReturned ? 'İade Edildi' : 'Ödünç Alındı'}
                  </td>
                  <td className="border p-3">
                    {book.returningDate
                      ? new Date(book.returningDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="border p-3">
                    {new Date(book.dueDate as Date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">{book.penaltyPrice}₺</td>
                  <td className="border p-3 text-center">
                    <button className="rounded-full p-2 hover:bg-gray-200">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  Ödünç alınan kitap bulunamadı.
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

        <span className="font-semibold text-gray-700">
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

export default AdminBorrowedBooks;
