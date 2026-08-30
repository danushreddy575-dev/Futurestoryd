import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_SETUP_MESSAGE, API_URL } from "../../config/api";
import { addToCart } from "../../utils/addToCart";
import { formatBooks } from "../../utils/formatBooks";
import { requireAuthCart } from "../../utils/requireAuthCart";
import { getFallbackSearchBooks } from "../../utils/fallbackBooks";
import { openBookDetails } from "../../utils/bookNavigation";
import "./SearchResults.css";

const buildSearchQuery = (query, searchBy, subject) => {
  const cleanQuery = query.trim();
  const cleanSubject = subject.trim();

  if (cleanSubject) return `subject:${cleanSubject}`;
  if (searchBy === "title") return `intitle:${cleanQuery}`;
  if (searchBy === "author") return `inauthor:${cleanQuery}`;
  if (searchBy === "subject") return `subject:${cleanQuery}`;

  return cleanQuery;
};

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("all");
  const [availability, setAvailability] = useState("");

  const goToCart = (bookObj) => {
    requireAuthCart(bookObj, navigate, setError, addToCart);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query.trim()) {
        setBooks([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          setBooks(getFallbackSearchBooks(query, 12));
          setError(API_SETUP_MESSAGE);
          return;
        }

        const search = buildSearchQuery(query, searchBy, "");
        const params = new URLSearchParams({
          search,
          maxResults: "30",
        });

        if (availability) params.set("filter", availability);

        const res = await axios.get(`${API_URL}/api/books?${params.toString()}`);

        setBooks(formatBooks(res.data, "Search"));
        setError("");
      } catch (err) {
        setBooks(getFallbackSearchBooks(query, 12));
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, searchBy, availability]);

  return (
    <div className="search-results-page">
      <h2 className="search-results-title">Search Results</h2>

      {query && <p className="search-results-query">"{query}"</p>}

      {query && (
        <div className="search-filter-panel">
          <div>
            <label>Search By</label>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
              <option value="all">Any Match</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="subject">Subject</option>
            </select>
          </div>

          <div>
            <label>Availability</label>
            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="">Any</option>
              <option value="ebooks">Ebooks</option>
              <option value="free-ebooks">Free ebooks</option>
              <option value="paid-ebooks">Paid ebooks</option>
              <option value="full">Full preview</option>
              <option value="partial">Partial preview</option>
            </select>
          </div>
        </div>
      )}

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="display-6 text-danger text-center">{error}</p>}

      {!loading && !error && query && books.length === 0 && (
        <p className="text-center">No books found.</p>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4 search-results-grid">
        {books.map((bookObj) => (
          <div className="col text-center" key={bookObj.id}>
            <div
              className="card search-book-card book-card"
              role="button"
              tabIndex="0"
              onClick={() => openBookDetails(bookObj, navigate)}
              onKeyDown={(e) => e.key === "Enter" && openBookDetails(bookObj, navigate)}
            >
              <img
                src={bookObj.image}
                alt={bookObj.name}
                className="search-book-image book-card-image"
              />

              <div className="card-body search-book-body book-card-body">
                <h5 className="search-book-title book-card-title">{bookObj.name}</h5>
                <p className="search-book-genre book-card-genre">{bookObj.genre}</p>
                <p className="fw-bold search-book-price book-card-price">{bookObj.priceLabel}</p>
                <p className="text-warning search-book-rating book-card-rating">⭐ {bookObj.rating}</p>

                <button
                  className="bt search-book-button book-card-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCart(bookObj);
                  }}
                >
                  Add To Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
