import React, { FormEventHandler, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import axios from 'axios';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useUser();
  const navigate = useNavigate();

  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const handleLoginSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5109/api/v1/login', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', response.data.user._id);
      setUser(response.data.user);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 500);
      });
      navigate('/');
    } catch (err) {
      console.log(err);
      setIsOpen(true);
    } finally {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
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
                      className="inline-flex items-center gap-2 rounded-md bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 transition duration-200 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[hover]:bg-blue-500 data-[open]:bg-gray-700"
                      onClick={close}
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
      {
        <div
          id="page-container"
          className={
            'bg-image flex h-screen justify-center overflow-y-hidden bg-transparent sm:items-center ' +
            (isOpen ? 'blur-sm' : '')
          }
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
                    <h1 className="text-slate-700">Merhaba!</h1>
                    <h2 className="text-slate-400">
                      {""}
                    </h2>
                  </div>
                  <form
                    onSubmit={handleLoginSubmit}
                    className="rounded-b-lg bg-white px-16 pt-8 pb-8"
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
                          className="mb-2 rounded-md bg-blue-400 hover:bg-blue-500"
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
      }
    </>
  );
};

export default Login;
