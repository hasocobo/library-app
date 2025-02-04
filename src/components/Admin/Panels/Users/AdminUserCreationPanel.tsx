import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';

type AdminUserCreationDto = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  roles: string[];
};

type ValidationErrors = {
  [key in keyof AdminUserCreationDto]?: string;
};

const api = axios.create({
  baseURL: 'http://localhost:5109/api/v1'
});

type AdminUserCreationPanelProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const AdminUserCreationPanel = ({
  isOpen,
  setIsOpen
}: AdminUserCreationPanelProps) => {
  const [user, setUser] = useState<AdminUserCreationDto>({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    // Set a default date (today) in YYYY-MM-DD format
    dateOfBirth: new Date().toISOString().split('T')[0],
    roles: []
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [requestState, setRequestState] = useState<
    'default' | 'success' | 'failed'
  >('default');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!user.firstName.trim()) newErrors.firstName = 'İsim gereklidir';
    if (!user.lastName.trim()) newErrors.lastName = 'Soyisim gereklidir';
    if (!user.userName.trim()) newErrors.userName = 'Kullanıcı adı gereklidir';
    if (!user.password.trim()) newErrors.password = 'Şifre gereklidir';
    if (!user.email.trim()) newErrors.email = 'Email gereklidir';
    if (!user.phoneNumber.trim())
      newErrors.phoneNumber = 'Telefon numarası gereklidir';
    if (!user.dateOfBirth) newErrors.dateOfBirth = 'Doğum tarihi gereklidir';
    if (user.roles.length === 0) newErrors.roles = 'En az bir rol gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closeModal = () => {
    setIsOpen(false);
    setUser({
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      roles: []
    });
    setErrors({});
    setRequestState('default');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Convert the dateOfBirth string into a full ISO string
      const payload = {
        ...user,
        dateOfBirth: new Date(user.dateOfBirth).toISOString()
      };
      const response = await api.post('/users', payload);
      if (response.status === 200) {
        setRequestState('success');
        closeModal();
        window.location.reload();
      } else {
        setRequestState('failed');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setRequestState('failed');
    }
  };

  const handleInputChange = (
    field: keyof AdminUserCreationDto,
    value: string
  ) => {
    if (field === 'roles') {
      // Assume roles are entered as a comma-separated string
      setUser((prev) => ({
        ...prev,
        roles: value
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      }));
    } else {
      setUser((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Kullanıcı Ekle
                </Dialog.Title>
                {requestState === 'failed' && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <AlertCircle size={24} />
                    <span>İşlem başarısız, lütfen bilgileri kontrol edin.</span>
                  </div>
                )}
                <div className="mt-4 space-y-4">
                  {/* First Name */}
                  <div className='flex items-center gap-4'>
                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Ad
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={user.firstName}
                        onChange={(e) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        className={`w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    {/* Last Name */}
                    <div className="space-y-1">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-500"
                      >
                        Soyad
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={user.lastName}
                        onChange={(e) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        className={`w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* UserName */}
                  <div className="space-y-1">
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Kullanıcı Adı
                    </label>
                    <input
                      id="userName"
                      type="text"
                      value={user.userName}
                      onChange={(e) =>
                        handleInputChange('userName', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.userName ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.userName && (
                      <p className="text-sm text-red-500">{errors.userName}</p>
                    )}
                  </div>
                  {/* Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Şifre
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={user.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Telefon Numarası
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      value={user.phoneNumber}
                      onChange={(e) =>
                        handleInputChange('phoneNumber', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Doğum Tarihi
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={user.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange('dateOfBirth', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>
                  {/* Roles */}
                  <div className="space-y-1">
                    <label
                      htmlFor="roles"
                      className="block text-sm font-medium text-gray-500"
                    >
                      Roller (virgülle ayrılmış)
                    </label>
                    <input
                      id="roles"
                      type="text"
                      value={user.roles.join(', ')}
                      onChange={(e) =>
                        handleInputChange('roles', e.target.value)
                      }
                      className={`w-full rounded-lg border ${errors.roles ? 'border-red-500' : 'border-gray-300'} p-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.roles && (
                      <p className="text-sm text-red-500">{errors.roles}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex justify-center rounded-lg border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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

export default AdminUserCreationPanel;
