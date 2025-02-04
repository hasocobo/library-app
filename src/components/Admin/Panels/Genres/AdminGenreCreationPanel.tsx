import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import TGenre from '../../../../types/Genre';

type GenreCreationDto = {
  name: string;
  slug: string;
};

type ValidationErrors = {
  [key in keyof GenreCreationDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminGenreCreationPanel = ({ isOpen, setIsOpen }) => {
  const [genre, setGenre] = useState<GenreCreationDto>({
    name: '',
    slug: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [selectedParentGenreId, setSelectedParentGenreId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!genre.name.trim()) {
      newErrors.name = 'Tür adı gereklidir';
    }

    if (!genre.slug.trim()) {
      newErrors.slug = 'Slug gereklidir';
    } else if (!/^[a-z0-9-]+$/.test(genre.slug)) {
      newErrors.slug = 'Slug yalnızca küçük harf, rakam ve tire içermelidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closeModal = () => {
    setIsOpen(false);
    setGenre({
      name: '',
      slug: ''
    });
    setSelectedParentGenreId(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await api.post('/genres', {
        ...genre,
        parentGenreId: selectedParentGenreId || undefined
      });
      
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error creating genre:', error);
    }
  };

  const handleInputChange = (
    field: keyof GenreCreationDto,
    value: string
  ) => {
    // Auto-generate slug when name changes
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
      
      setGenre((prev) => ({ 
        ...prev, 
        [field]: value,
        slug: slug
      }));
    } else {
      setGenre((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Kitap Türü Ekle
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
                        value={selectedParentGenreId || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedParentGenreId(value ? value : null);
                        }}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="">Ana Tür</option>
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
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
                        value={genre.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                        Slug(kısa isim)
                      </label>
                      <input
                        id="slug"
                        type="text"
                        value={genre.slug}
                        onChange={(e) =>
                          handleInputChange('slug', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.slug ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSubmit}
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      İptal
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminGenreCreationPanel;