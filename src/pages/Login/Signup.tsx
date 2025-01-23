import React, { useState } from 'react';
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

export default function Signup() {
  const [signupData, setSignupData] = useState({
    username: '',
    name: '',
    surname: '',
    role: '',
    password: ''
  });

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isFailureOpen, setIsFailureOpen] = useState(false);

  function open() {
    setIsSuccessOpen(true);
  }

  function close() {
    setIsFailureOpen(false);
  }

  const navigate = useNavigate();

  function handleSignupInputs(e: any) {
    const { name, value } = e.target;

    setSignupData({ ...signupData, [name]: value });
  }

  async function handleSignupSubmit(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5109/api/v1/users', signupData);
      setIsSuccessOpen(true);
      console.log(response.data);
    } catch (error) {
      setIsFailureOpen(true);
      console.log(error);
    }
  }

  console.log(signupData);

  return (
    <>
      <Transition appear show={isSuccessOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setIsSuccessOpen(false)}
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
                <DialogPanel className="w-96 max-w-md rounded-xl border bg-white/5 p-6 backdrop-blur-2xl">
                  <DialogTitle
                    as="h3"
                    className="flex items-center gap-2 text-lg font-semibold text-slate-800"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
                      <i className="material-icons text-2xl text-green-950">
                        check
                      </i>
                    </div>
                    User creation successful!
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-slate-800/50">
                    You can now login using your username and password.
                  </p>
                  <div className="mt-4">
                    <div className='flex justify-between '>
                      <Button
                        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-green-900 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-50 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={() => setIsSuccessOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className="inline-flex items-center gap-2 rounded-md bg-green-800/90 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-900/90 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={() => navigate('/login')}
                      >
                        Log in
                      </Button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isFailureOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setIsFailureOpen(false)}
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
                <DialogPanel className="w-96 max-w-md rounded-xl border bg-white/5 p-6 backdrop-blur-2xl">
                  <DialogTitle
                    as="h3"
                    className="flex items-center gap-2 text-lg font-semibold text-slate-800"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
                      <i className="material-icons text-2xl text-red-950">
                        close
                      </i>
                    </div>
                    Bu kullanıcı zaten mevcut!
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-slate-800/50">
                    Bu e-posta adresi zaten kullanılıyor, lütfen başka bir e-posta adresi deneyin.
                  </p>
                  <div className="mt-4">
                    <div className='flex justify-between '>
                      <Button
                        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-blue-900 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-50 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={() => setIsFailureOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className="inline-flex items-center gap-2 rounded-md bg-blue-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={() => navigate('/login')}
                      >
                        Log in with the existing user
                      </Button>
                    </div>
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
            'bg-image flex h-screen sm:items-center justify-center bg-transparent overflow-y-hidden ' +
            (isSuccessOpen || isFailureOpen ? 'blur-[2px] ' : '')
          }
        >
          <div id="main" className="rounded-lg">
            <div
              id="card-container"
              className="mx-auto flex rounded-lg shadow-sm ring-1 ring-slate-900/5"
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
                  {
                    <form
                      className="rounded-b-lg bg-white px-16 pb-8 pt-8"
                      onSubmit={handleSignupSubmit}
                    >
                      <fieldset>
                        <div>
                          <div>
                            <input
                              type="email"
                              id="username"
                              name="username"
                              value={signupData.username}
                              onChange={handleSignupInputs}
                              minLength={3}
                              maxLength={20}
                              placeholder=" "
                              required
                            />
                            <label htmlFor="username">E-posta</label>
                          </div>
                          <div>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={signupData.name}
                              onChange={handleSignupInputs}
                              placeholder=" "
                              required
                            />
                            <label htmlFor="name">Ad</label>
                          </div>
                          <div>
                            <input
                              type="text"
                              id="surname"
                              name="surname"
                              value={signupData.surname}
                              onChange={handleSignupInputs}
                              maxLength={10}
                              placeholder=" "
                              required
                            />
                            <label htmlFor="surname">Soyad</label>
                          </div>
                          <div className="">
                            <input
                              type="password"
                              id="password"
                              name="password"
                              value={signupData.password}
                              onChange={handleSignupInputs}
                              minLength={6}
                              maxLength={20}
                              placeholder=" "
                              required
                            />
                            <label htmlFor="password">Şifre</label>
                          </div>
                          {/*<div className="relative mt-3 pb-6">
                            <div className="absolute left-3 top-[-26px] text-slate-400">
                              Rol
                            </div>
                            <select
                              className=" w-full rounded-md bg-slate-50 py-2 pl-4 text-sky-800"
                              id="role"
                              name="role"
                              value={signupData.role}
                              onChange={handleSignupInputs}
                              required
                            >
                              <option>Kullanıcı</option>
                            </select>
                          </div>
                          */}
                        </div>
                        <div className="button">
                          <button
                            type="submit"
                            className="mb-2 rounded-sm bg-blue-400 hover:bg-blue-500"
                          >
                            Kaydol
                          </button>
                        </div>
                        <div>
                          Zaten hesabın var mı?{' '}
                          <span
                            onClick={() => navigate('/login')}
                            className="font-semibold text-blue-300 hover:cursor-pointer hover:text-blue-500"
                          >
                            Giriş Yap
                          </span>
                        </div>
                      </fieldset>
                    </form>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}