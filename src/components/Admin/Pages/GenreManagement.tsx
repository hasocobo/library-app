import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HomeIcon
} from 'lucide-react';
import TGenre from '../../../types/Genre';
import { Button } from '@headlessui/react';
import TableSkeleton from '../../TableSkeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminGenreCreationPanel from '../Panels/Genres/AdminGenreCreationPanel';
import DropdownMenu from '../Panels/DropdownMenu';
import AdminGenreUpdatePanel from '../Panels/Genres/AdminGenreUpdatePanel';
import DeleteConfirmationModal from '../Panels/DeleteConfirmationModal';
import RequestResult from '../../../types/RequestResult';
import api from '../../../api';

const GenreManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<TGenre | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult>(RequestResult.Default);

  const pageSize = 8;
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.slice(1).split('/');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres', {
          params: {
            SearchTerm: search,
            PageNumber: page,
            PageSize: pageSize
          }
        });

        setGenres(response.data);
        setLoading(false);
        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [search, page]);

  const handleEdit = (genre: TGenre) => {
    setSelectedGenre(genre);
    setIsEditOpen(true);
  };

  const showDelete = (genre: TGenre) => {
    setSelectedGenre(genre);
    setIsDeleteOpen(true);
    setRequestResult(RequestResult.Default);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`genres/${selectedGenre?.id}`);
      if (response.status === 204) setIsDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      setRequestResult(RequestResult.Failed);
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <AdminGenreCreationPanel isOpen={isOpen} setIsOpen={setIsOpen} />

      <AdminGenreUpdatePanel
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        genre={selectedGenre}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
        setRequestResult={setRequestResult}
        requestResult={requestResult}
        entityType='türü'
        entityName={selectedGenre?.name}
        warningMessage='Dikkat, bu türe ait bir alt tür veya kitap varsa silemezsiniz.'
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
            <span className="font-semibold text-white">Kitap Türü Ekle</span>
          </Button>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Tüm Kitap Türleri</h2>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Kitap Türü ara..."
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
                <th className="border p-3">Slug</th>
                <th className="border p-3">Üst Tür</th>
                <th className="border p-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {genres && genres.length > 0 ? (
                genres.map((genre: TGenre) => (
                  <tr key={genre.id} className="hover:bg-gray-50">
                    <td className="border p-3 font-medium">{genre.name}</td>
                    <td className="border p-3">{genre.slug}</td>
                    <td className="border p-3">
                      {genre.parentGenreName || 'Yok(Ana Tür)'}
                    </td>
                    <td className="relative border p-3 text-center">
                      <DropdownMenu
                        isOpen={openDropdownId === genre.id}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === genre.id ? null : genre.id
                          )
                        }
                        onEdit={() => handleEdit(genre)}
                        onDelete={() => showDelete(genre)}
                        onView={() => {
                          navigate(`/genre/${genre.slug}`);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Tür bulunamadı.
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

export default GenreManagement;