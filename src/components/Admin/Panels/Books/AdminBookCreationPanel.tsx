import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import TAuthor from '../../../types/Author';
import TGenre from '../../../types/Genre';

type BookCreationDto = {
  title: string;
  publishYear: number | '';
  pageCount: number | '';
  quantity: number | '';
  imageUrl: string;
  description: string;
};

type ValidationErrors = {
  [key in keyof BookCreationDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminBookCreationPanel = ({ isOpen, setIsOpen }) => {
  const [book, setBook] = useState<BookCreationDto>({
    title: '',
    publishYear: '',
    pageCount: '',
    quantity: '',
    imageUrl: '',
    description: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [authors, setAuthors] = useState<TAuthor[]>([]);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');
  const [selectedGenreId, setSelectedGenreId] = useState<string>('');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get('/authors');
        setAuthors(response.data);
        if (response.data.length > 0) {
          setSelectedAuthorId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data);
        if (response.data.length > 0) {
          setSelectedGenreId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (isOpen) {
      fetchAuthors();
      fetchGenres();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!book.title.trim()) {
      newErrors.title = 'Kitap adı gereklidir';
    }

    if (!book.publishYear) {
      newErrors.publishYear = 'Yayın yılı gereklidir';
    } else if (
      Number(book.publishYear) < 1000 ||
      Number(book.publishYear) > new Date().getFullYear()
    ) {
      newErrors.publishYear = 'Geçerli bir yayın yılı giriniz';
    }

    if (!book.pageCount) {
      newErrors.pageCount = 'Sayfa sayısı gereklidir';
    } else if (Number(book.pageCount) <= 0) {
      newErrors.pageCount = "Sayfa sayısı 0'dan büyük olmalıdır";
    }

    if (!book.quantity) {
      newErrors.quantity = 'Adet gereklidir';
    } else if (Number(book.quantity) <= 0) {
      newErrors.quantity = "Adet 0'dan büyük olmalıdır";
    }

    if (book.imageUrl != '' && !isValidUrl(book.imageUrl)) {
      newErrors.imageUrl = 'Geçerli bir URL giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setBook({
      title: '',
      publishYear: '',
      pageCount: '',
      quantity: '',
      imageUrl: '',
      description: ''
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await api.post(
        `/authors/${selectedAuthorId}/books`,
        {
          ...book,
          publishYear: Number(book.publishYear),
          pageCount: Number(book.pageCount),
          quantity: Number(book.quantity)
        },
        {
          params: {
            genreId: selectedGenreId
          }
        }
      );
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleInputChange = (
    field: keyof BookCreationDto,
    value: string | number
  ) => {
    setBook((prev) => ({ ...prev, [field]: value }));
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
                    Kitap Ekle
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Yazar
                      </label>
                      <select
                        id="author"
                        value={selectedAuthorId}
                        onChange={(e) => setSelectedAuthorId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.firstName + " " + author.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="genre"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Tür
                      </label>
                      <select
                        id="genre"
                        value={selectedGenreId}
                        onChange={(e) => setSelectedGenreId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Kitap Adı
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={book.title}
                        onChange={(e) =>
                          handleInputChange('title', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full space-y-1">
                        <label
                          htmlFor="publishYear"
                          className="block text-sm font-medium text-gray-500"
                        >
                          Yayın Yılı
                        </label>
                        <input
                          id="publishYear"
                          type="number"
                          value={book.publishYear}
                          onChange={(e) =>
                            handleInputChange('publishYear', e.target.value)
                          }
                          className={`w-full rounded-lg border ${
                            errors.publishYear
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        />
                        {errors.publishYear && (
                          <p className="text-sm text-red-500">
                            {errors.publishYear}
                          </p>
                        )}
                      </div>
                      <div className="w-full space-y-1">
                        <label
                          htmlFor="pageCount"
                          className="block text-sm font-medium text-gray-500"
                        >
                          Sayfa Sayısı
                        </label>
                        <input
                          id="pageCount"
                          type="number"
                          value={book.pageCount}
                          onChange={(e) =>
                            handleInputChange('pageCount', e.target.value)
                          }
                          className={`w-full rounded-lg border ${
                            errors.pageCount
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        />
                        {errors.pageCount && (
                          <p className="text-sm text-red-500">
                            {errors.pageCount}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Adet
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        value={book.quantity}
                        onChange={(e) =>
                          handleInputChange('quantity', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.quantity ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-500">
                          {errors.quantity}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="imageUrl"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Kapak Resmi URL
                      </label>
                      <input
                        id="imageUrl"
                        type="text"
                        value={book.imageUrl}
                        onChange={(e) =>
                          handleInputChange('imageUrl', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.imageUrl && (
                        <p className="text-sm text-red-500">
                          {errors.imageUrl}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Açıklama
                      </label>
                      <input
                        id="imageUrl"
                        type="text"
                        value={book.description}
                        onChange={(e) =>
                          handleInputChange('description', e.target.value)
                        }
                        className={`w-full rounded-lg border ${
                          errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
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

export default AdminBookCreationPanel;
