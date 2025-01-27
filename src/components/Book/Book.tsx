import TBook from '../../types/Book';
import { Link } from 'react-router-dom';
import bookImage from '../../assets/cover.png';

const Book = ({ bookElement }: { bookElement: TBook }) => {
  console.log('Image URL:', bookElement.imageUrl);
  return (
    <div>
      <Link to={`/browse/${bookElement.bookId}`}>
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
            <p className="text-sm text-slate-500">{bookElement.publishYear}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Book;
