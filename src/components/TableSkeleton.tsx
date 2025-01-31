const TableSkeleton = () => {
  const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-100">
          <tr className="text-gray-700">
            {/* Skeleton header cells */}
            {Array.from({ length: 4 }, (_, index) => (
              <th key={index} className="border p-3">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((row) => (
            <tr key={row} className="hover:bg-gray-50 p-3">
              {/* ID column - shorter width */}
              <td className="border p-3">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </td>
              {/* Name column - medium width */}
              <td className="border p-3">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </td>
              {/* Slug column - longer width */}
              <td className="border p-3">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              </td>
              {/* Parent ID column - medium width */}
              <td className="border p-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;