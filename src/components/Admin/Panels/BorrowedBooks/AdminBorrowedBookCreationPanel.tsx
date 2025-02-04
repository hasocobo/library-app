import { Button, Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import TUser from '../../../../types/User';
import TBook from '../../../../types/Book';
import RequestResult from '../../../../types/RequestResult';
import { AlertCircle } from 'lucide-react';

type BorrowedBookCreationDto = {
  userId: string;
  bookId: string;
  dueDate: string;
};

type ValidationErrors = {
  [key in keyof BorrowedBookCreationDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 14); // default due date is 2 weeks from today
const formattedDueDate = defaultDueDate.toISOString().split('T')[0];

const AdminBorrowedBookCreationPanel = ({ isOpen, setIsOpen }) => {
  const [borrowedBook, setBorrowedBook] = useState<BorrowedBookCreationDto>({
    userId: '',
    bookId: '',
    dueDate: formattedDueDate
  });
  const [requestState, setRequestState] = useState<RequestResult>(
    RequestResult.Default
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [users, setUsers] = useState<TUser[]>([]);
  const [books, setBooks] = useState<TBook[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRequestState(RequestResult.Default);
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [usersResponse, booksResponse] = await Promise.all([
        api.get('/users'),
        api.get('/books')
      ]);

      setUsers(usersResponse.data);
      setBooks(booksResponse.data);

      if (usersResponse.data.length > 0) {
        setBorrowedBook((prev) => ({
          ...prev,
          userId: usersResponse.data[0].id
        }));
      }
      if (booksResponse.data.length > 0) {
        setBorrowedBook((prev) => ({
          ...prev,
          bookId: booksResponse.data[0].bookId
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRequestState(RequestResult.Failed);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!borrowedBook.userId) newErrors.userId = 'Kullanıcı seçimi gereklidir';
    if (!borrowedBook.bookId) newErrors.bookId = 'Kitap seçimi gereklidir';
    if (!borrowedBook.dueDate) {
      newErrors.dueDate = 'İade tarihi gereklidir';
    } else if (new Date(borrowedBook.dueDate) <= new Date()) {
      newErrors.dueDate = 'İade tarihi bugünden sonra olmalıdır';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post(
        `/users/${borrowedBook.userId}/borrowed-books`,
        {
          bookId: borrowedBook.bookId,
          dueDate: borrowedBook.dueDate
        }
      );

      if (response.status === 201) {
        setRequestState(RequestResult.Success);
        closeModal();
        window.location.reload();
      } else {
        setRequestState(RequestResult.Failed);
      }
    } catch (error) {
      console.error('Error creating borrowed book record:', error);
      setRequestState(RequestResult.Failed);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setBorrowedBook((prev) => ({ ...prev, userId: '', bookId: '' }));
    setErrors({});
    setRequestState(RequestResult.Default);
  };

  const handleInputChange = (
    field: keyof BorrowedBookCreationDto,
    value: string
  ) => {
    setBorrowedBook((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderContent = () => {
    if (requestState === RequestResult.Failed) {
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
            Kitap ödünç alınırken hata oluştu. Kitabı daha önce almadığınızdan
            emin olun.
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => setRequestState(RequestResult.Default)}
              className="flex items-center justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Tekrar Dene
            </Button>
            <Button
              onClick={closeModal}
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
            >
              Kapat
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <Dialog.Title as="h3" className="text-xl font-semibold text-gray-800">
          Ödünç Kitap Kaydı Oluştur
        </Dialog.Title>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-500"
            >
              Kullanıcı
            </label>
            <select
              id="user"
              value={borrowedBook.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="book"
              className="block text-sm font-medium text-gray-500"
            >
              Kitap
            </label>
            <select
              id="book"
              value={borrowedBook.bookId}
              onChange={(e) => handleInputChange('bookId', e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {books.map((book) => (
                <option key={book.bookId} value={book.bookId}>
                  {`${book.title} - ${book.authorName}`}
                </option>
              ))}
            </select>
            {errors.bookId && (
              <p className="text-sm text-red-500">{errors.bookId}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-500"
            >
              İade Tarihi
            </label>
            <input
              id="dueDate"
              type="date"
              value={borrowedBook.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate}</p>
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
            Kaydet
          </button>
        </div>
      </>
    );
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {renderContent()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminBorrowedBookCreationPanel;
