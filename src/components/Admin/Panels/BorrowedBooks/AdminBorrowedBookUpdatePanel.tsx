import { Dialog, Transition, Checkbox } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import TBorrowedBook from '../../../../types/BorrowedBook';
import RequestResult from '../../../../types/RequestResult';
import { AlertCircle } from 'lucide-react';
import { CheckIcon } from '@heroicons/react/24/solid';

type BorrowedBookUpdateDto = {
  dueDate: string;
  isReturned: boolean;
  returnedDate: string;
};

type ValidationErrors = {
  [key in keyof BorrowedBookUpdateDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

const AdminBorrowedBookUpdatePanel = ({
  isOpen,
  setIsOpen,
  borrowedBook
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  borrowedBook: TBorrowedBook | null;
}) => {
  const [updateData, setUpdateData] = useState<BorrowedBookUpdateDto>({
    dueDate: '',
    isReturned: false,
    returnedDate: ''
  });
  const [requestState, setRequestState] = useState<RequestResult>(
    RequestResult.Default
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isOpen && borrowedBook) {
      setUpdateData({
        dueDate:
          new Date(borrowedBook.dueDate as Date).toISOString().split('T')[0] ||
          '',
        isReturned: borrowedBook.isReturned || false,
        returnedDate:
          new Date(borrowedBook.returningDate as Date)
            .toISOString()
            .split('T')[0] || ''
      });
      setRequestState(RequestResult.Default);
    }
  }, [isOpen, borrowedBook]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (updateData.isReturned && !updateData.dueDate) {
      newErrors.dueDate = 'İade tarihi gereklidir';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.put(
        `/borrowed-books/${borrowedBook?.id}`,
        updateData
      );

      if (response.status === 200) {
        setRequestState(RequestResult.Success);
        closeModal();
        window.location.reload();
      } else {
        setRequestState(RequestResult.Failed);
      }
    } catch (error) {
      console.error('Error updating borrowed book:', error);
      setRequestState(RequestResult.Failed);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setRequestState(RequestResult.Default);
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
          <p className="mt-2 text-center text-sm text-gray-500">
            Ödünç kitap güncellenirken hata oluştu, lütfen tekrar deneyiniz.
          </p>
          <div className="mt-4 flex justify-end">
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
        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800">
          Ödünç Kitap Güncelle
        </Dialog.Title>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">
              Kitap
            </label>
            <div className="rounded-lg border border-gray-300 p-3 text-gray-600">
              {borrowedBook?.title} - {borrowedBook?.authorName}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">
              Kullanıcı
            </label>
            <div className="rounded-lg border border-gray-300 p-3 text-gray-600">
              {borrowedBook?.borrowerName}
            </div>
          </div>

          <div className="flex items-center gap-2 space-y-1">
            <Checkbox
              checked={updateData.isReturned}
              onChange={(checked) =>
                setUpdateData((prev) => ({ ...prev, isReturned: checked }))
              }
              className="group size-6 cursor-pointer rounded-md bg-gray-500/10 p-1 ring-1 ring-inset ring-white/15"
            >
              <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
            </Checkbox>
            <p className="text-gray-500">İade Edildi</p>
          </div>

          {/* Conditional Due Date Input */}
          {updateData.isReturned === false && (
            <div className="space-y-1">
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-500"
              >
                Son Teslim Tarihi
              </label>
              <input
                id="dueDate"
                type="date"
                value={updateData.dueDate}
                onChange={(e) =>
                  setUpdateData((prev) => ({
                    ...prev,
                    dueDate: e.target.value
                  }))
                }
                className={`w-full rounded-lg border ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
          )}

          {updateData.isReturned === true && (
            <div className="space-y-1">
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-500"
              >
                İade Edilen Tarih
              </label>
              <input
                id="dueDate"
                type="date"
                value={updateData.returnedDate}
                onChange={(e) =>
                  setUpdateData((prev) => ({
                    ...prev,
                    returnedDate: e.target.value
                  }))
                }
                className={`w-full rounded-lg border ${
                  errors.returnedDate ? 'border-red-500' : 'border-gray-300'
                } p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.returnedDate}</p>
              )}
            </div>
          )}
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

export default AdminBorrowedBookUpdatePanel;
