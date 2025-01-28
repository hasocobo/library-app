const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[2/3] w-full rounded-lg bg-slate-200"></div>
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
      <div className="h-4 w-1/2 rounded bg-slate-200"></div>
    </div>
  </div>
);

export default BookSkeleton;
