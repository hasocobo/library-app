import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import TAuthor from '../../../../types/Author';

type AdminAuthorUpdateDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath?: string;
};

type ValidationErrors = {
  [key in keyof AdminAuthorUpdateDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

type AdminAuthorUpdatePanelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  author: TAuthor | null;
};

const AdminAuthorUpdatePanel = ({
  isOpen,
  setIsOpen,
  author,
}: AdminAuthorUpdatePanelProps) => {
  const [updateData, setUpdateData] = useState<AdminAuthorUpdateDto>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dateOfDeath: undefined,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [requestState, setRequestState] = useState<'default' | 'success' | 'failed'>('default');

  useEffect(() => {
    if (isOpen && author) {
      setUpdateData({
        firstName: author.firstName,
        lastName: author.lastName,
        dateOfBirth: new Date(author.dateOfBirth).toISOString().split('T')[0],
        dateOfDeath: new Date(author.dateOfDeath).toISOString().split('T')[0] ?? undefined,
      });
      setRequestState('default');
      setErrors({});
    }
  }, [isOpen, author]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!updateData.firstName.trim()) {
      newErrors.firstName = 'İsim gereklidir';
    }
    if (!updateData.lastName.trim()) {
      newErrors.lastName = 'Soyisim gereklidir';
    }
    if (!updateData.dateOfBirth) {
      newErrors.dateOfBirth = 'Doğum tarihi gereklidir';
    }
    // Additional validations can be added here (e.g. ensuring dateOfDeath is after dateOfBirth)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !author) return;

    try {
      const response = await api.put(`/authors/${author.id}`, updateData);
      if (response.status === 200) {
        setRequestState('success');
        closeModal();
        window.location.reload();
      } else {
        setRequestState('failed');
      }
    } catch (error) {
      console.error('Error updating author:', error);
      setRequestState('failed');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setRequestState('default');
  };

  const handleInputChange = (field: keyof AdminAuthorUpdateDto, value: string) => {
    setUpdateData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderContent = () => {
    if (requestState === 'failed') {
      return (
        <>
          <Dialog.Title
            as="h3"
            className="flex items-center gap-2 text-lg font-semibold text-red-800"
          >
            <AlertCircle size={24} color="#991b1b" />
            İşlem Başarısız
          </Dialog.Title>
          <p className="mt-2 text-sm text-gray-500">
            Yazar güncellenirken hata oluştu. Lütfen bilgileri kontrol edip tekrar deneyin.
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
          Yazar Bilgilerini Güncelle
        </Dialog.Title>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-500">
              İsim
            </label>
            <input
              id="firstName"
              type="text"
              value={updateData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-500">
              Soyisim
            </label>
            <input
              id="lastName"
              type="text"
              value={updateData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-500">
              Doğum Tarihi
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={updateData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="dateOfDeath" className="block text-sm font-medium text-gray-500">
              Ölüm Tarihi
            </label>
            <input
              id="dateOfDeath"
              type="date"
              value={updateData.dateOfDeath}
              onChange={(e) => handleInputChange('dateOfDeath', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.dateOfDeath ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.dateOfDeath && (
              <p className="text-sm text-red-500">{errors.dateOfDeath}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={closeModal}
          >
            İptal
          </button>
          <button
            type="button"
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
            onClick={handleSubmit}
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

export default AdminAuthorUpdatePanel;
