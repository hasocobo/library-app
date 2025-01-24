type TBook = {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  publishYear: number;
  pageCount: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
};

export default TBook;