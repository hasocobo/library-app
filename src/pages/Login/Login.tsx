import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserProvider';
import api from '../../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, [])

  const { setUser } = useUser();
  const navigate = useNavigate();

  function openDialog() {
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('login', {
        username,
        password
      });

      const { data } = response;
      const { jwtToken, userDetails } = data;

      localStorage.clear();
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('userId', userDetails.id);
      localStorage.setItem('user', JSON.stringify(userDetails));

      setUser({
        id: userDetails.id,
        username: userDetails.username,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        dateOfBirth: userDetails.dateOfBirth,
        roles: userDetails.roles
      });

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      openDialog();
    }
  };

  return (
    <>
      {/* Error Dialog */}
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={closeDialog}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-96 max-w-md rounded-xl border bg-white p-4 backdrop-blur-2xl">
                  <DialogTitle
                    as="h3"
                    className="flex items-center gap-3 text-lg font-semibold text-slate-800"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
                      <i className="material-icons text-xl text-red-950">
                        close
                      </i>
                    </div>
                    Yanlış kullanıcı adı veya şifre!
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-slate-800/50">
                    Lütfen kullanıcı adı ve şifrenizi tekrar girin.
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 transition duration-200 focus:outline-none data-[hover]:bg-blue-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={closeDialog}
                    >
                      Tekrar Dene
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div
        id="page-container"
        className={`bg-image flex h-screen justify-center overflow-y-hidden bg-transparent sm:items-center ${
          isOpen ? 'blur-sm' : ''
        }`}
      >
        <div id="main" className="rounded-lg">
          <div
            id="card-container"
            className="mx-auto flex rounded-lg shadow-sm sm:ring-1 sm:ring-slate-900/5"
          >
            <div id="form-container">
              <div id="form">
                <div
                  id="form-greeting"
                  className="rounded-t-lg bg-stone-50 px-16 py-6 text-center"
                >
                  <h1 className="text-slate-700">Üye Girişi</h1>
                  <h2 className="text-slate-400">{''}</h2>
                </div>
                <form
                  onSubmit={handleLoginSubmit}
                  className="rounded-b-lg bg-white px-16 pb-8 pt-8"
                >
                  <fieldset>
                    <div>
                      <div>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          minLength={3}
                          maxLength={20}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="username">Kullanıcı Adı</label>
                      </div>
                      <div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={6}
                          maxLength={20}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="password">Şifre</label>
                      </div>
                    </div>

                    <div className="button">
                      <button
                        type="submit"
                        className="mb-2 rounded-sm bg-blue-400 hover:bg-blue-500"
                      >
                        Giriş Yap
                      </button>
                    </div>
                    <div>
                      Şifreni mi unuttun?{' '}
                      <a href="#" className="font-semibold text-blue-300">
                        Şifreni Yenile
                      </a>
                      <div className="flex w-full justify-center">
                        <div
                          onClick={() => navigate('/signup')}
                          className="mt-4 w-fit rounded-md bg-blue-50 p-2 font-semibold text-blue-400 hover:cursor-pointer hover:text-blue-500"
                        >
                          Veya Hemen Kaydol!
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
