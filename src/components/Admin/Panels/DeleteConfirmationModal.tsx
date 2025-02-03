import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Trash } from 'lucide-react';
import { Fragment } from 'react';
import RequestResult from '../../../types/RequestResult';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName?: string;
  entityType?: string;
  warningMessage?: string; // Optional warning message (e.g., "This will delete 6 associated posts")
  requestResult: RequestResult;
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  entityType,
  warningMessage,
  requestResult
}: DeleteConfirmationModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              {requestResult === RequestResult.Default && (
                <div>
                  {/* Title */}
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-800"
                  >
                    {entityType} silmek istiyor musunuz?
                  </Dialog.Title>

                  {/* Description */}
                  <p className="mt-2 text-gray-600">
                    <span className="font-semibold text-gray-600">{entityName}</span> adlı{' '}
                    {entityType && entityType.toLowerCase()} silmek
                    istediğinizden emin misiniz?
                  </p>

                  {/* Warning Box */}
                  {warningMessage && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg bg-orange-100 p-3 text-orange-700">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <p className="text-sm">{warningMessage}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Hayır, iptal et
                    </button>
                    <button
                      onClick={onConfirm}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      <Trash size={18} color="white" />
                      Evet, silmeyi onayla
                    </button>
                  </div>
                </div>
              ) 
              }

              {
                requestResult === RequestResult.Failed && 
                <div>
                  Ürünü silme başarısız oldu, lütfen tekrar deneyiniz.
                </div>

              }
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmationModal;
