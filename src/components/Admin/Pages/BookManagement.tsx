import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, HomeIcon } from 'lucide-react';
import TBook from '../../../types/Book';
import { Button } from '@headlessui/react';
import TableSkeleton from '../../TableSkeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminBookCreationPanel from '../Panels/Books/AdminBookCreationPanel';
import DropdownMenu from '../Panels/DropdownMenu';
import AdminBookUpdatePanel from '../Panels/Books/AdminBookUpdatePanel';
import DeleteConfirmationModal from '../Panels/DeleteConfirmationModal';
import RequestResult from '../../../types/RequestResult';

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const BookManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<TBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<TBook[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult>(
    RequestResult.Default
  );

  const pageSize = 7;
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.slice(1).split('/');

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
        setLoading(false);
        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
          setTotalCount(parsedHeader.TotalCount);
        }
      } catch (error) {
        console.error('Kitaplar alınırken hata oluştu:', error);
      }
    };

    fetchBooks();
  }, [search, page]);

  const handleEdit = (book: TBook) => {
    setSelectedBook(book);
    setIsEditOpen(true);
  };

  const showDelete = (book: TBook) => {
    setSelectedBook(book);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`books/${selectedBook?.bookId}`);
      if (response.status === 204) setIsDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      setRequestResult(RequestResult.Failed);
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Creation panel for adding new books */}
      <AdminBookCreationPanel isOpen={isOpen} setIsOpen={setIsOpen} />

      <AdminBookUpdatePanel
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        bookToUpdate={selectedBook}
      />

      <DeleteConfirmationModal
        onConfirm={handleDelete}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        entityName={selectedBook?.title}
        entityType="kitabı"
        requestResult={requestResult}
        setRequestResult={setRequestResult}
      />

      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2">
          <HomeIcon
            opacity={0.8}
            onClick={() => navigate('/')}
            className="hover:cursor-pointer hover:opacity-95"
          />
          {paths.map((path, i) => (
            <span
              key={i}
              className="font-semibold text-slate-600 opacity-75 hover:cursor-pointer hover:opacity-95"
              onClick={() => navigate(i === 0 ? `/${paths[0]}` : `/${paths[0]}/${path}`)}
            >
              {'>'} {path.charAt(0).toUpperCase() + path.slice(1)}
            </span>
          ))}
        </nav>
        <div>
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 rounded-md bg-sky-800 p-2"
          >
            <i className="material-symbols-outlined text-white">add</i>
            <span className="font-semibold text-white">Kitap Ekle</span>
          </Button>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Tüm Kitaplar</h2>
        <p className='text-gray-500'>Toplam {totalCount} kitap</p>
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

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-lg bg-white shadow">
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
                    <td className="relative border p-3 text-center">
                      <DropdownMenu
                        isOpen={openDropdownId === book.bookId}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === book.bookId ? null : book.bookId
                          )
                        }
                        onEdit={() => handleEdit(book)}
                        onDelete={() => showDelete(book)}
                        onView={() => {
                          navigate(`/browse/${book.bookId}`);
                        }}
                      />
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
      )}

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

        <span className="flex grow justify-center font-semibold text-gray-700">
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

export default BookManagement;
