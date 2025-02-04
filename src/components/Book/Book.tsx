import TBook from '../../types/Book';
import { Link } from 'react-router-dom';
import bookImage from '../../assets/cover.png';

const Book = ({ bookElement, link }: { bookElement: TBook; link: string }) => {
  return (
    <div>
      <Link to={link}>
        <div className="md:h-100 h-100 rounded-sm border shadow-sm hover:shadow-md">
          <div id="image" className="h-40 md:h-80">
            <img
              src={bookElement.imageUrl ? bookElement.imageUrl : bookImage}
              className="h-full w-full overflow-hidden object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col p-4">
            <h3 className="text-md font-semibold lg:text-lg">
              {bookElement.title}
            </h3>
            <p className="text-sm font-semibold text-slate-500">
              {bookElement.authorName}
            </p>
            {/* <p className="text-sm text-slate-500 mt-1">{bookElement.publishYear}</p>*/}
            <div className="flex items-center gap-1 pt-2">
              {bookElement.quantity > 0 ? (
                <>
                  <i className="material-symbols-outlined text-md text-green-600">
                    check_circle
                  </i>
                  <p className="text-sm text-slate-500">Mevcut</p>
                </>
              ) : (
                <>
                  <i className="material-symbols-outlined text-md text-red-600">
                    cancel
                  </i>
                  <p className="text-sm text-slate-500">Mevcut Değil</p>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Book;
