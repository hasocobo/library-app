import TBook from "./Book";

type TGenre = {
  parentGenreId: string,
  id: string,
  name: string,
  parentGenreName: string,
  slug: string,
  books: TBook[]
}

export default TGenre;