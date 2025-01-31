import { useEffect, useState } from 'react';
import axios from 'axios';
import TGenre from '../../types/Genre';
import { MoreVertical } from 'lucide-react';
import { Button } from '@headlessui/react';
import TableSkeleton from '../TableSkeleton';

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminGenres = () => {
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Türler alınırken hata oluştu:', error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Kitap Türleri</h2>
        <Button className="flex items-center gap-1 rounded-sm bg-sky-800 p-2 text-sky-800 hover:bg-sky-900">
          <i className="material-symbols-outlined text-white">add</i>
          <span className="font-semibold text-white">Tür Ekle</span>
        </Button>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="border p-3">ID</th>
                <th className="border p-3">İsim</th>
                <th className="border p-3">Slug</th>
                <th className="border p-3">Üst Tür ID</th>
                <th className="border p-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {genres && genres.length > 0 ? (
                genres.map((genre: TGenre) => (
                  <tr key={genre.id} className="hover:bg-gray-50">
                    <td className="border p-3">{genre.id}</td>
                    <td className="border p-3">{genre.name}</td>
                    <td className="border p-3">{genre.slug}</td>
                    <td className="border p-3">
                      {genre.parentGenreId || 'Ana Tür'}
                    </td>
                    <td className="border p-3 text-center">
                      <button className="rounded-full p-2 hover:bg-gray-200">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
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
    </div>
  );
};

export default AdminGenres;
