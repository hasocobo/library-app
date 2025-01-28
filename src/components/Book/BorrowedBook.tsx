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
              <div className="flex items-center gap-2 mt-2">
                <div className='size-6 flex justify-center items-center rounded-full bg-green-100'>
                  <i className="material-symbols-outlined text-green-600">
                    check_circle
                  </i>
                </div>
                <div className='text-slate-500 text-sm font-thin'>
                  İade Edildi
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <div className='size-6 flex justify-center items-center rounded-full bg-blue-100'>
                  <i className="material-symbols-outlined text-blue-600">
                    info
                  </i>
                </div>
                <div className='text-slate-500 text-sm font-thin'>
                  Son Teslim: <span className='text-slate-500 text-sm font-normal'>{bookElement.dueDate && new Date(bookElement.dueDate).toLocaleDateString()}</span>
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