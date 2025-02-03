import React, { useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, FileText, Trash } from 'lucide-react';

interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onView
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="rounded-full p-2 hover:bg-gray-100"
        onClick={onToggle}
      >
        <MoreHorizontal size={18} className="text-gray-600" />
      </button>

      {isOpen && (
        <div
          className="absolute right-[-30px] mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg z-50"
        >
          <div className="border-b border-slate-100 p-2">
            <button
              onClick={onEdit}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
            >
              <Edit size={18} className="text-gray-600" />
              Düzenle
            </button>

            <button
              onClick={onView}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
            >
              <FileText size={18} className="text-gray-600" />
              Görüntüle
            </button>
          </div>

          <div className="px-2 py-1">
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-gray-50"
            >
              <Trash size={18} color="#DC2626" />
              Sil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
