import PaginationHeader from '../types/PaginationHeader';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Pagination = ({
  paginationHeader
}: {
  paginationHeader: PaginationHeader | null;
}) => {
  const page = paginationHeader?.PageNumber || 1;
  const totalPages = paginationHeader?.TotalPages || 1;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', newPage.toString());
    navigate(`?${currentParams.toString()}`);
  };

  // Generate page numbers, displaying first three pages, ellipsis, and last three pages
  const generatePageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 6) {
      // If there are 6 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first three pages, then ellipsis, then the last three pages
      pageNumbers.push(1, 2, 3);
      if (page < totalPages - 3) {
        pageNumbers.push('...');
      }
      // Add last three pages if applicable
      pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    }
    return pageNumbers;
  };

  return (
    <nav
      className="mt-8 flex items-center justify-center"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="group relative flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:text-slate-300"
        aria-label="Previous page"
      >
        <i className="material-symbols-outlined">navigate_before</i>
      </button>

      {/* Page Numbers Container */}
      <div className="flex items-center space-x-1">
        {generatePageNumbers().map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={index}
                className="flex size-10 items-center justify-center text-slate-400"
              >
                ⋯
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => handlePageChange(parseInt(pageNumber.toString()))}
              className={`relative flex size-10 items-center justify-center rounded-lg font-medium transition-colors ${
                pageNumber === page
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-current={pageNumber === page ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="group relative flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:text-slate-300"
        aria-label="Next page"
      >
        <i className="material-symbols-outlined">navigate_next</i>
      </button>
    </nav>
  );
};

export default Pagination;
