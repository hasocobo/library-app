import { Link } from 'react-router-dom';
import bookImage from '../../assets/cover.png';
import TBorrowedBook from '../../types/BorrowedBook';

const BorrowedBook = ({
  bookElement,
  link
}: {
  bookElement: TBorrowedBook;
  link: string;
}) => {
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
            {bookElement.isReturned ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-green-100">
                  <i className="material-symbols-outlined text-green-600">
                    check_circle
                  </i>
                </div>
                <div className="text-sm text-slate-500">
                  İade Edildi
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-blue-100">
                  <i className="material-symbols-outlined text-blue-600">
                    info
                  </i>
                </div>
                <div className="text-sm font-thin text-slate-500">
                  Son Teslim:{' '}
                  <span className="text-sm font-normal text-slate-500">
                    {bookElement.dueDate ?
                      new Date(bookElement.dueDate).toLocaleDateString(): "Belirtilmemiş"}
                  </span>
                </div>
              </div>
            )}
            <p className="text-sm text-slate-500">{bookElement.publishYear}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BorrowedBook;
