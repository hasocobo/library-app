import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HomeIcon
} from 'lucide-react';
import TAuthor from '../../../types/Author';
import { Button } from '@headlessui/react';
import TableSkeleton from '../../TableSkeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminAuthorCreationPanel from '../Panels/Authors/AdminAuthorCreationPanel';
import DropdownMenu from '../Panels/DropdownMenu';
import AdminAuthorUpdatePanel from '../Panels/Authors/AdminAuthorUpdatePanel';
import DeleteConfirmationModal from '../Panels/DeleteConfirmationModal';
import RequestResult from '../../../types/RequestResult';
import api from '../../../api';

const AuthorManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<TAuthor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authors, setAuthors] = useState<TAuthor[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult>(RequestResult.Default)


  const pageSize = 7;
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.slice(1).split('/');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get('/authors', {
          params: {
            SearchTerm: search,
            PageNumber: page,
            PageSize: pageSize
          }
        });

        setAuthors(response.data);
        setLoading(false);
        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, [search, page]);

  const handleEdit = (author: TAuthor) => {
    setSelectedAuthor(author);
    setIsEditOpen(true);
  };

  
  const showDelete = (author: TAuthor) => {
    setSelectedAuthor(author);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(
        `authors/${selectedAuthor?.id}`
      );
      if (response.status === 204) setIsDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      setRequestResult(RequestResult.Failed);
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <AdminAuthorCreationPanel isOpen={isOpen} setIsOpen={setIsOpen} />

      <AdminAuthorUpdatePanel
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        author={selectedAuthor}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
        requestResult={requestResult}
        setRequestResult={setRequestResult}
        entityType='yazarı'
        entityName={`${selectedAuthor?.firstName} ${selectedAuthor?.lastName}`}
        warningMessage='Dikkat, bu yazarı silmek onun tüm kitaplarını beraberinde silecektir. Yazarı silmeden önce kitabın ödünç alınmadığından emin olun.'
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
              onClick={() => navigate(i === 0 ? '/admin' : `/admin/${path}`)}
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
            <span className="font-semibold text-white">Yazar Ekle</span>
          </Button>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Tüm Yazarlar</h2>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Yazar ara..."
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
                <th className="border p-3">İsim</th>
                <th className="border p-3">Doğum Tarihi</th>
                <th className="border p-3">Ölüm Tarihi</th>
                <th className="border p-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {authors && authors.length > 0 ? (
                authors.map((author: TAuthor) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="border p-3 font-medium">
                      {author.firstName + ' ' + author.lastName}
                    </td>
                    <td className="border p-3">{author.dateOfBirth ? new Date(author.dateOfBirth).toLocaleDateString() : '-'}</td>
                    <td className="border p-3">{author.dateOfDeath ? new Date(author.dateOfDeath).toLocaleDateString() : '-'}</td>
                    <td className="relative border p-3 text-center">
                      <DropdownMenu
                        isOpen={openDropdownId === author.id}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === author.id ? null : author.id
                          )
                        }
                        onEdit={() => handleEdit(author)}
                        onDelete={() => showDelete(author)}
                        onView={() => {
                          navigate(
                            `/browse?q=${author.firstName + ' ' + author.lastName}`
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Yazar bulunamadı.
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

export default AuthorManagement;
