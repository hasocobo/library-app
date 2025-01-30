import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-gray-700">
      <div className="p-6">
        <div className="w-full max-w-sm rounded-md bg-white text-center">
          <div className="flex justify-center">
            <i className="material-symbols-outlined text-5xl text-red-700">
              error_outline
            </i>
          </div>
          <p className="mt-4 text-lg text-gray-600">
            Bu sayfayı görüntüleme iznine sahip değilsiniz
          </p>
          <Link to="/">
            <button
              className="mt-5 rounded-sm bg-slate-800 px-4 py-2 text-center font-semibold text-white transition duration-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Go back to Home"
            >
              Ana Sayfaya Dön
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
