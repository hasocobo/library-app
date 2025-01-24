import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TBook from '../../types/Book';
import bookImage from '../../assets/cover.png';

const exampleBook: TBook = {
 id: 'fallback-book-001',
 title: 'Untitled Book',
 authorName: 'Unknown Author',
 authorId: 'unknown-author-id',
 publishYear: new Date().getFullYear(),
 pageCount: 0,
 quantity: 0,
 description: 'No description available for this book.',
 imageUrl: '../../assets/cover.png',
 genreName: 'Uncategorized'
};

const BookView = () => {
 const [book, setBook] = useState<TBook | null>(exampleBook);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const { bookId } = useParams();

 useEffect(() => {
   const fetchBookDetails = async () => {
     try {
       setLoading(true);
       setError(null);
       const response = await axios.get<TBook>(
         `http://localhost:5109/api/v1/books/${bookId}`
       );
       setBook(response.data);
       setLoading(false);
     } catch (err) {
       setError(
         axios.isAxiosError(err)
           ? err.response?.data?.message ||
               'An error occurred while fetching book details'
           : 'An unexpected error occurred'
       );
       setLoading(false);
     }
   };
   if (bookId) {
     fetchBookDetails();
   }
 }, [bookId]);

 if (loading) {
   return (
     <div className="mx-auto flex h-screen items-center justify-center p-4">
       <div role="status">
         Loading book details...
       </div>
     </div>
   );
 }

 if (!book) {
   return <div className="mx-auto p-4">No book found</div>;
 }

 return (
   <div className="mx-auto max-w-5xl p-4">
     <div className="flex flex-col md:flex-row gap-8">
       <div className="md:w-1/3">
         <img
           src={book.imageUrl}
           alt={`Cover of ${book.title}`}
           className="h-[500px] w-full object-cover shadow-lg"
           onError={(e) => {
             const imgElement = e.target as HTMLImageElement;
             imgElement.src = bookImage;
           }}
         />
         <div className="mt-4 space-y-2">
           <h2 className="text-2xl font-bold">{book.title}</h2>
           <p className="text-xl text-gray-700">by {book.authorName}</p>
           <div className="space-y-1 text-sm text-gray-600">
             <p>Published: {book.publishYear}</p>
             <p>Genre: {book.genreName}</p>
           </div>
         </div>
       </div>
       <div className="md:w-2/3">
         <section className="prose max-w-none">
           <h3 className="mb-4 text-xl font-semibold">Book Description</h3>
           <p className="text-base leading-relaxed">{book.description}</p>
         </section>
         <section className="mt-6 rounded-md bg-gray-50 p-4">
           <h3 className="mb-4 text-xl font-semibold">
             Additional Information
           </h3>
           <div className="flex flex-wrap gap-2">
             {book.pageCount && (
               <p>
                 <strong>Page Count:</strong> {book.pageCount}
               </p>
             )}
           </div>
         </section>
       </div>
     </div>
   </div>
 );
};

export default BookView;