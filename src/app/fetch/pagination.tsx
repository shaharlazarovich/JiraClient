interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
  }
  
  const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
  
  export default Pagination;
  