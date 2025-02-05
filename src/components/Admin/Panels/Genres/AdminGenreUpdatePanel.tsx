import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TGenre from '../../../../types/Genre';
import api from '../../../../api';

const emptyGuid = "00000000-0000-0000-0000-000000000000"

type AdminGenreUpdateDto = {
  name: string;
  slug: string;
  parentGenreId?: string | undefined;
};

type ValidationErrors = {
  [key in keyof AdminGenreUpdateDto]?: string;
};

type AdminGenreUpdatePanelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  genre: TGenre | null;
};

const AdminGenreUpdatePanel = ({
  isOpen,
  setIsOpen,
  genre
}: AdminGenreUpdatePanelProps) => {
  const [updateData, setUpdateData] = useState<AdminGenreUpdateDto>({
    name: '',
    slug: '',
    parentGenreId: undefined
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [requestState, setRequestState] = useState<
    'default' | 'success' | 'failed'
  >('default');
  const [availableGenres, setAvailableGenres] = useState<TGenre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setAvailableGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && genre) {
      setUpdateData({
        name: genre.name,
        slug: genre.slug,
        parentGenreId: genre.parentGenreId || undefined
      });
      setRequestState('default');
      setErrors({});
    }
  }, [isOpen, genre]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!updateData.name.trim()) {
      newErrors.name = 'Tür adı gereklidir';
    }
    if (!updateData.slug.trim()) {
      newErrors.slug = 'Slug gereklidir';
    } else if (!/^[a-z0-9-]+$/.test(updateData.slug)) {
      newErrors.slug = 'Slug yalnızca küçük harf, rakam ve tire içermelidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !genre) return;

    try {
      const response = await api.put(`/genres/${genre.id}`, {
        ...updateData,
        parentGenreId: updateData.parentGenreId || undefined
      });

      if (response.status === 200) {
        setRequestState('success');
        closeModal();
        window.location.reload();
      } else {
        setRequestState('failed');
      }
    } catch (error) {
      console.error('Error updating genre:', error);
      setRequestState('failed');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setRequestState('default');
  };

  const handleInputChange = (
    field: keyof AdminGenreUpdateDto,
    value: string | undefined
  ) => {
    // Auto-generate slug when name changes
    if (field === 'name') {
      if (value != null) {
        const slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-');

        setUpdateData((prev) => ({
          ...prev,
          [field]: value,
          slug: slug
        }));
      }
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
          <Dialog.Title
            as="h3"
            className="flex items-center gap-2 text-lg font-semibold text-red-800"
          >
            <AlertCircle size={24} color="#991b1b" />
            İşlem Başarısız
          </Dialog.Title>
          <p className="mt-2 text-sm text-gray-500">
            Tür güncellenirken hata oluştu. Lütfen bilgileri kontrol edip tekrar
            deneyin.
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
          Tür Bilgilerini Güncelle
        </Dialog.Title>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="parentGenre"
              className="block text-sm font-medium text-gray-500"
            >
              Üst Tür (İsteğe Bağlı)
            </label>
            <select
              id="parentGenre"
              value={updateData.parentGenreId || undefined}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange('parentGenreId', value ? value : undefined);
              }}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value={emptyGuid}>Ana Tür</option>
              {availableGenres
                .filter((g) => g.id !== genre?.id) // Prevent selecting current genre as parent
                .map((availableGenre) => (
                  <option key={availableGenre.id} value={availableGenre.id}>
                    {availableGenre.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500"
            >
              Tür Adı
            </label>
            <input
              id="name"
              type="text"
              value={updateData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-500"
            >
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={updateData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
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

export default AdminGenreUpdatePanel;
