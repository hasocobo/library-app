import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import axios from 'axios';

type BookCreationDto = {
  title: string;
  publishYear: number;
  pageCount: number;
  quantity: number;
  imageUrl: string;
};

const AdminBookCreationPanel = ({ isOpen, setIsOpen }) => {
  const [book, setBook] = useState<BookCreationDto>({
    title: '',
    publishYear: 0,
    pageCount: 0,
    quantity: 1,
    imageUrl: ''
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/books', book);
      closeModal();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleInputChange = (
    field: keyof BookCreationDto,
    value: string | number
  ) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <button
        className="flex items-center gap-1 rounded-sm bg-sky-800 p-2 text-sky-800 hover:bg-sky-900"
        onClick={openModal}
      >
        <i className="material-symbols-outlined text-white">add</i>
        <span className="font-semibold text-white">Kitap Ekle</span>
      </button>

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Kitap Ekle
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Kitap Adı"
                      value={book.title}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex gap-4">
                      <input
                        type="number"
                        placeholder="Yayın Yılı"
                        value={book.publishYear}
                        onChange={(e) =>
                          handleInputChange(
                            'publishYear',
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="number"
                        placeholder="Sayfa Sayısı"
                        value={book.pageCount}
                        onChange={(e) =>
                          handleInputChange('pageCount', Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Adet"
                      value={book.quantity}
                      onChange={(e) =>
                        handleInputChange('quantity', Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Kapak Resmi URL"
                      value={book.imageUrl}
                      onChange={(e) =>
                        handleInputChange('imageUrl', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSubmit}
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
