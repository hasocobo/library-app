import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import TBook from '../../../types/Book';
import TGenre from '../../../types/Genre';

type AdminBookUpdatePanelProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookToUpdate: TBook | null;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminBookUpdatePanel = ({ isOpen, setIsOpen, bookToUpdate }: AdminBookUpdatePanelProps) => {
  // Local state for updateable fields.
  const [book, setBook] = useState({
    title: '',
    imageUrl: '',
    genreId: '',
    pageCount: 0,
    quantity: 0
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [genres, setGenres] = useState<TGenre[]>([]);

  // When the modal is open and a book is provided, pre-populate the form.
  useEffect(() => {
    if (isOpen && bookToUpdate) {
      setBook({
        title: bookToUpdate.title,
        imageUrl: bookToUpdate.imageUrl || '',
        // Use genreName as an initial value for genreId.
        genreId: bookToUpdate.genreName || '',
        pageCount: bookToUpdate.pageCount,
        quantity: bookToUpdate.quantity
      });
    }
  }, [isOpen, bookToUpdate]);

  // Fetch genres to populate the select dropdown.
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data);
        // If there's no genreId yet, set it to the first available genre.
        if (!book.genreId && response.data.length > 0) {
          setBook(prev => ({ ...prev, genreId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen, book.genreId]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!book.title.trim()) {
      newErrors.title = 'Kitap adı gereklidir';
    }
    if (book.imageUrl && !isValidUrl(book.imageUrl)) {
      newErrors.imageUrl = 'Geçerli bir URL giriniz';
    }
    if (!book.genreId) {
      newErrors.genreId = 'Tür seçimi gereklidir';
    }
    if (!book.pageCount || Number(book.pageCount) <= 0) {
      newErrors.pageCount = "Sayfa sayısı 0'dan büyük olmalıdır";
    }
    if (!book.quantity || Number(book.quantity) <= 0) {
      newErrors.quantity = "Adet 0'dan büyük olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookToUpdate) {
      return;
    }

    try {
      // Update the book using its bookId.
      await api.put(`/books/${bookToUpdate.bookId}`, {
        title: book.title,
        imageUrl: book.imageUrl,
        genreId: book.genreId,
        pageCount: Number(book.pageCount),
        quantity: Number(book.quantity)
      });
      closeModal();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setBook(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto bg-opacity-25 bg-black">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left transition-all">
                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                  Kitap Güncelle
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-500">
                      Kitap Adı
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={book.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full rounded-sm border ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-500">
                      Kapak Resmi URL
                    </label>
                    <input
                      id="imageUrl"
                      type="text"
                      value={book.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      className={`w-full rounded-sm border ${
                        errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                      } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-500">
                      Tür
                    </label>
                    <select
                      id="genre"
                      value={book.genreId}
                      onChange={(e) => handleInputChange('genreId', e.target.value)}
                      className={`w-full rounded-sm border ${
                        errors.genreId ? 'border-red-500' : 'border-gray-300'
                      } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    >
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                    {errors.genreId && <p className="text-sm text-red-500">{errors.genreId}</p>}
                  </div>

                  <div className="flex gap-4">
                    <div className="w-full space-y-1">
                      <label htmlFor="pageCount" className="block text-sm font-medium text-gray-500">
                        Sayfa Sayısı
                      </label>
                      <input
                        id="pageCount"
                        type="number"
                        value={book.pageCount}
                        onChange={(e) => handleInputChange('pageCount', e.target.value)}
                        className={`w-full rounded-sm border ${
                          errors.pageCount ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.pageCount && <p className="text-sm text-red-500">{errors.pageCount}</p>}
                    </div>

                    <div className="w-full space-y-1">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-500">
                        Adet
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        value={book.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className={`w-full rounded-sm border ${
                          errors.quantity ? 'border-red-500' : 'border-gray-300'
                        } p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex justify-center rounded-sm border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-sm border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
  );
};

export default AdminBookUpdatePanel;
