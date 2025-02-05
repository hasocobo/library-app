import { useEffect, useState } from 'react';
import TUser from '../../../types/User';
import {
  ChevronLeft,
  ChevronRight,
  HomeIcon
} from 'lucide-react';
import { Button } from '@headlessui/react';
import TableSkeleton from '../../TableSkeleton';
import { useLocation, useNavigate } from 'react-router-dom';

import AdminUserCreationPanel from '../Panels/Users/AdminUserCreationPanel';
import AdminUserUpdatePanel from '../Panels/Users/AdminUserUpdatePanel';
import DeleteConfirmationModal from '../Panels/DeleteConfirmationModal';
import DropdownMenu from '../Panels/DropdownMenu';
import RequestResult from '../../../types/RequestResult';
import api from '../../../api';

const UserManagement = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<TUser[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult>(RequestResult.Default);

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const pageSize = 7;
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.slice(1).split('/');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', {
          params: {
            SearchTerm: search,
            PageNumber: page,
            PageSize: pageSize
          }
        });
        setUsers(response.data);
        setLoading(false);

        const paginationHeader = response.headers['libraryapi-pagination'];
        if (paginationHeader) {
          const parsedHeader = JSON.parse(paginationHeader);
          setTotalPages(parsedHeader.TotalPages);
        }
      } catch (error) {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
      }
    };

    fetchUsers();
  }, [search, page]);

  const handleEdit = (user: TUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const showDelete = (user: TUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
    setRequestResult(RequestResult.Default);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/users/${selectedUser?.id}`);
      if (response.status === 204) {
        setIsDeleteOpen(false);
        window.location.reload();
      }
    } catch (error) {
      setRequestResult(RequestResult.Failed);
      console.error('Kullanıcı silinirken hata oluştu:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Modals for creating, updating, and deleting a user */}
      <AdminUserCreationPanel isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
      <AdminUserUpdatePanel
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        user={selectedUser}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
        setRequestResult={setRequestResult}
        requestResult={requestResult}
        entityType="kullanıcıyı"
        entityName={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
        warningMessage="Dikkat, bu kullanıcıyı silmek geri alınamaz. Silmeden önce tüm bilgileri kontrol ettiğinizden emin olun."
      />

      {/* Breadcrumbs and Create Button */}
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
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1 rounded-md bg-sky-800 p-2"
          >
            <i className="material-symbols-outlined text-white">add</i>
            <span className="font-semibold text-white">Kullanıcı Ekle</span>
          </Button>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Tüm Kullanıcılar</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Kullanıcı ara..."
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

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-lg bg-white shadow">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="border p-3">Ad</th>
                <th className="border p-3">Soyad</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Kullanıcı Adı</th>
                <th className="border p-3">Roller</th>
                <th className="border p-3">ID</th>
                <th className="border p-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user: TUser) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border p-3 font-medium">{user.firstName}</td>
                    <td className="border p-3">{user.lastName}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.username}</td>
                    <td className="border p-3">
                      {user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Yok'}
                    </td>
                    <td className="border p-3">{user.id}</td>
                    <td className="relative border p-3 text-center">
                      <DropdownMenu
                        isOpen={openDropdownId === user.id}
                        onToggle={() =>
                          setOpenDropdownId(openDropdownId === user.id ? null : user.id)
                        }
                        onEdit={() => handleEdit(user)}
                        onDelete={() => showDelete(user)}
                        onView={() =>
                          navigate(`/browse?q=${encodeURIComponent(user.username)}`)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
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

export default UserManagement;
