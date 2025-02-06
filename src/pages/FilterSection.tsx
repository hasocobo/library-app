import { useEffect, useState } from 'react';
import { Filter, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import api from '../api';
import TAuthor from '../types/Author';
import TGenre from '../types/Genre';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSection = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<TAuthor | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<TGenre | null>(null);
  const [authors, setAuthors] = useState<TAuthor[]>([]);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q');

  useEffect(() => {
    if (queryParam !== null) {
      setSelectedAuthor(null);
      setSelectedGenre(null);
      setSortDirection(null);
    }
  }, [queryParam]);
  

  useEffect(() => {
    handleFilter();
  }, [selectedAuthor, selectedGenre, sortDirection]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData, authorData] = await Promise.all([
          api.get('genres', {
            params: {
              PageSize: 50
            }
          }),
          api.get('authors', {
            params: {
              PageSize: 50
            }
          })
        ]);

        setAuthors(authorData.data);
        setGenres(genreData.data);

        const genreId = searchParams.get('genre');
        const authorId = searchParams.get('author');
        const sort = searchParams.get('sort');

        if (genreId)
          setSelectedGenre(
            genreData.data.find((genre) => genre.id === genreId) as TGenre
          );
        if (authorId) {
          setSelectedAuthor(
            authorData.data.find((author) => author.id === authorId) as TAuthor
          );
        }
        if (sort && (sort === 'asc' || sort === 'desc')) {
          setSortDirection(sort);
        }
      } catch (error) {
        console.error('error fetching filter data', error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    const newSearchParams = new URLSearchParams();

    if (selectedAuthor) newSearchParams.set('author', selectedAuthor.id);
    if (selectedGenre ) newSearchParams.set('genre', selectedGenre.id);
    if (sortDirection ) newSearchParams.set('sort', sortDirection);
    if ( queryParam && !selectedAuthor && !selectedGenre && !sortDirection) newSearchParams.set('q', queryParam)

    navigate({
      pathname: '/browse',
      search: newSearchParams.toString()
    });
  };

  const toggleAuthor = (author: TAuthor) => {
    setSelectedAuthor((prevAuthor) =>
      prevAuthor?.id === author.id ? null : author
    );
  };

  const toggleGenre = (genre: TGenre) => {
    setSelectedGenre((prevGenre) =>
      prevGenre?.id === genre.id ? null : genre
    );
  };

  return (
    <aside className="sticky top-0 w-60 shrink-0 space-y-4 bg-white p-4">
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-3 flex w-full items-center justify-between text-sm "
        >
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5 text-slate-500" />
            <p className='font-medium text-slate-500'>Filtrele</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`space-y-4 overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-slate-600">
              Sıralama
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setSortDirection(sortDirection === 'asc' ? null : 'asc')
                }
                className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                  sortDirection === 'asc'
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <SortAsc
                  className="mr-2 h-4 w-4"
                  strokeWidth={sortDirection === 'asc' ? 2.5 : 1.5}
                />
                <p className={sortDirection === 'asc' ? 'font-semibold' : ''}>
                  A-Z
                </p>
              </button>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === 'desc' ? null : 'desc')
                }
                className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                  sortDirection === 'desc'
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <SortDesc
                  className="mr-2 h-4 w-4"
                  strokeWidth={sortDirection === 'desc' ? 2.5 : 1.5}
                />
                <p className={sortDirection === 'desc' ? 'font-semibold' : ''}>
                  Z-A
                </p>
              </button>
            </div>
          </div>

          {/* Author section */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-slate-600">
              Yazarlar
            </h4>
            <div className="space-y-2">
              {authors &&
                authors.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-center rounded-xl hover:font-semibold"
                  >
                    <input
                      type="radio"
                      id={author.id}
                      name="author"
                      checked={selectedAuthor?.id === author.id}
                      onChange={() => toggleAuthor(author)}
                      className="mr-2 rounded text-slate-600 focus:ring-slate-500"
                    />
                    <label
                      htmlFor={author.id}
                      className={`text-sm text-slate-700 hover:cursor-pointer ${selectedAuthor?.id === author.id && 'font-semibold'}`}
                    >
                      {author.firstName + ' ' + author.lastName}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Genre section */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-slate-600">Türler</h4>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    selectedGenre?.id === genre.id
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Filters */}
          {(selectedAuthor || selectedGenre || sortDirection) && (
            <div className="mt-4 border-t pt-2">
              <div className="flex flex-wrap gap-2">
                {selectedAuthor && (
                  <div className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs">
                    {selectedAuthor.firstName + ' ' + selectedAuthor.lastName}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedAuthor(null)}
                    />
                  </div>
                )}
                {selectedGenre && (
                  <div className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs">
                    {selectedGenre.name}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedGenre(null)}
                    />
                  </div>
                )}
                {sortDirection && (
                  <div className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs">
                    {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSortDirection(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSection;
