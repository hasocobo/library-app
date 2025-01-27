type TBorrowedBook = {
  id: string,
  bookId: string,
  bookName: string,
  authorName: string,
  borrowerId: string,
  borrowerName: string,
  borrowingDate: Date,
  isReturned?: false,
  returningDate?: Date,
  dueDate?: Date,
  penaltyPrice?: number
}