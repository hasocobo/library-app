import TBook from "./Book";

type TBorrowedBook = TBook & {
  id: string,
  borrowerId: string,
  borrowerName: string,
  borrowingDate: Date,
  isReturned?: false,
  returningDate?: Date,
  dueDate?: Date,
  penaltyPrice?: number
}

export default TBorrowedBook;