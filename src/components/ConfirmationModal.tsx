import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XCircle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Devam etmek istediğinize emin misiniz?",
  title = "Onaylıyor musunuz?",
}: ConfirmationDialogProps) => {
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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-5 shadow-lg transition-all">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                {title}
              </Dialog.Title>
              <p className="mt-2 text-sm bg-white text-slate-500 mt-3 px-3 py-2 rounded-lg">{message}</p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  İptal Et
                </button>
                <button
                  onClick={onConfirm}
                  className="flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Onayla
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;