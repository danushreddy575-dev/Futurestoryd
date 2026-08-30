function BookSkeleton({ count = 8, className = "row-cols-1 row-cols-sm-2 row-cols-lg-5" }) {
  return (
    <div className={`row g-4 book-skeleton-grid ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div className="col text-center" key={`book-skeleton-${index}`}>
          <div className="book-card book-skeleton-card" aria-hidden="true">
            <div className="book-skeleton-cover" />
            <div className="book-card-body book-skeleton-body">
              <span className="book-skeleton-line title" />
              <span className="book-skeleton-line short" />
              <span className="book-skeleton-line price" />
              <span className="book-skeleton-line rating" />
              <span className="book-skeleton-button" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookSkeleton;
