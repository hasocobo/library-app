import { useEffect, useState } from 'react';
import axios from 'axios';
import TUser from '../../types/User';
import { MoreVertical } from 'lucide-react';
import TableSkeleton from '../TableSkeleton';

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminUserManagement = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState([]);
  // const [search, setSearch] = useState('');
  // const [page, setPage] = useState(1);
  // const pageSize = 10;
  // const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Kullanıcılar
      </h2>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="border p-3">Ad</th>
                <th className="border p-3">Soyad</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Kullanıcı Adı</th>
                <th className="border p-3">Roller</th>
                <th className="border p-3">ID</th>
                <th className="border p-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user: TUser) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border p-3">{user.firstName}</td>
                    <td className="border p-3">{user.lastName}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.username}</td>
                    <td className="border p-3">
                      {user.roles.join(', ') || 'Yok'}
                    </td>
                    <td className="border p-3">{user.id}</td>
                    <td className="border p-3 text-center">
                      <button className="rounded-full p-2 hover:bg-gray-200">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Kullanıcı bulunamadı.
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

export default AdminUserManagement;
