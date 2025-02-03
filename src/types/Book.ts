type TBook = {
  bookId: string;
  title: string;
  authorName: string;
  authorId: string;
  publishYear: number;
  pageCount: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  genreName?: string;
  genreId?: string
};

export default TBook;