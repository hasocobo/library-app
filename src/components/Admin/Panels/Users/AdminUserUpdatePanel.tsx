import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import TUser from '../../../../types/User';

type AdminUserUpdateDto = {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  roles: string[];
};

type ValidationErrors = {
  [key in keyof AdminUserUpdateDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

type AdminUserUpdatePanelProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: TUser | null;
};

const AdminUserUpdatePanel = ({ isOpen, setIsOpen, user }: AdminUserUpdatePanelProps) => {
  const [updateData, setUpdateData] = useState<AdminUserUpdateDto>({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    roles: []
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [requestState, setRequestState] = useState<'default' | 'success' | 'failed'>('default');

  useEffect(() => {
    if (isOpen && user) {
      setUpdateData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        roles: user.roles || []
      });
      setRequestState('default');
      setErrors({});
    }
  }, [isOpen, user]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!updateData.firstName.trim()) newErrors.firstName = 'İsim gereklidir';
    if (!updateData.lastName.trim()) newErrors.lastName = 'Soyisim gereklidir';
    if (!updateData.email.trim()) newErrors.email = 'Email gereklidir';
    // If one of the password fields is entered, both must be provided
    if (updateData.newPassword && !updateData.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre gereklidir';
    }
    if (updateData.currentPassword && !updateData.newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir';
    }
    if (updateData.roles.length === 0) newErrors.roles = 'En az bir rol gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setRequestState('default');
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    try {
      const response = await api.put(`/users/${user.id}`, updateData);
      if (response.status === 200) {
        setRequestState('success');
        closeModal();
        window.location.reload();
      } else {
        setRequestState('failed');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setRequestState('failed');
    }
  };

  const handleInputChange = (field: keyof AdminUserUpdateDto, value: string) => {
    if (field === 'roles') {
      setUpdateData((prev) => ({ ...prev, roles: value.split(',').map((r) => r.trim()).filter(Boolean) }));
    } else {
      setUpdateData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderContent = () => {
    if (requestState === 'failed') {
      return (
        <>
          <Dialog.Title as="h3" className="flex items-center gap-2 text-lg font-semibold text-red-800">
            <AlertCircle size={24} color="#991b1b" />
            İşlem Başarısız
          </Dialog.Title>
          <p className="mt-2 text-sm text-gray-500">
            Kullanıcı güncellenirken hata oluştu. Lütfen bilgileri kontrol edip tekrar deneyin.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Kapat
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <Dialog.Title as="h3" className="text-xl font-semibold text-gray-800">
          Kullanıcı Bilgilerini Güncelle
        </Dialog.Title>
        <div className="mt-4 space-y-4">
          {/* First Name */}
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-500">İsim</label>
            <input
              id="firstName"
              type="text"
              value={updateData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>
          {/* Last Name */}
          <div className="space-y-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-500">Soyisim</label>
            <input
              id="lastName"
              type="text"
              value={updateData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">Email</label>
            <input
              id="email"
              type="email"
              value={updateData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          {/* Current Password */}
          <div className="space-y-1">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-500">Mevcut Şifre</label>
            <input
              id="currentPassword"
              type="password"
              value={updateData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`w-full rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
          </div>
          {/* New Password */}
          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-500">Yeni Şifre</label>
            <input
              id="newPassword"
              type="password"
              value={updateData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`w-full rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
          </div>
          {/* Roles */}
          <div className="space-y-1">
            <label htmlFor="roles" className="block text-sm font-medium text-gray-500">
              Roller (virgülle ayrılmış)
            </label>
            <input
              id="roles"
              type="text"
              value={updateData.roles.join(', ')}
              onChange={(e) => handleInputChange('roles', e.target.value)}
              className={`w-full rounded-lg border ${errors.roles ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.roles && <p className="text-sm text-red-500">{errors.roles}</p>}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Güncelle
          </button>
        </div>
      </>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-in duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {renderContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdminUserUpdatePanel;
