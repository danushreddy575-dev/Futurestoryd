const RECENTLY_VIEWED_KEY = "recentlyViewedBooks";
const MAX_RECENT_BOOKS = 6;

export const getRecentlyViewedBooks = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch (err) {
    return [];
  }
};

export const removeRecentlyViewedBook = (bookId) => {
  try {
    const nextBooks = getRecentlyViewedBooks().filter((book) => book.id !== bookId);

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextBooks));
    window.dispatchEvent(new Event("recentBooksChanged"));
  } catch (err) {
    window.dispatchEvent(new Event("recentBooksChanged"));
  }
};

const saveRecentlyViewedBook = (bookObj) => {
  try {
    const currentBooks = getRecentlyViewedBooks();
    const filteredBooks = currentBooks.filter((book) => book.id !== bookObj.id);
    const nextBooks = [bookObj, ...filteredBooks].slice(0, MAX_RECENT_BOOKS);

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextBooks));
    window.dispatchEvent(new Event("recentBooksChanged"));
  } catch (err) {
    // Opening the details page should not depend on browser storage being available.
  }
};

export const openBookDetails = (bookObj, navigate) => {
  sessionStorage.setItem("selectedBook", JSON.stringify(bookObj));
  saveRecentlyViewedBook(bookObj);
  navigate(`/Book/${encodeURIComponent(bookObj.id)}`);
};
