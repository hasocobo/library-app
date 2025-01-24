import { useParams } from "react-router-dom";

 const BookView = () => {
  const { bookId } = useParams()
  return (
    <div>
        {bookId}
    </div>
  )
}

export default BookView;