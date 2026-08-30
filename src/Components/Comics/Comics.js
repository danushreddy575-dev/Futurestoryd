import { useState, useEffect } from "react";
import axios from "axios";
import "./Comics.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/addToCart";
import { formatBooks } from "../../utils/formatBooks";
import { getFallbackBooks } from "../../utils/fallbackBooks";
import { requireAuthCart } from "../../utils/requireAuthCart";
import { openBookDetails } from "../../utils/bookNavigation";
import { API_URL } from "../../config/api";

const BOOK_CACHE_KEY = "comicsBooksV6";


function Comics() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const goToCart = (bookObj) => {
  requireAuthCart(bookObj, navigate, setError, addToCart);
};

  const [, setLoading] = useState(false);


  // fetch comics
  useEffect(() => {
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const cached = localStorage.getItem(BOOK_CACHE_KEY);

      if (cached) {
        setBooks(JSON.parse(cached));
        setLoading(false);
        return;
      }

      if (!API_URL) {
        setBooks(getFallbackBooks("Comics", 30));
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/books?search=subject:comics&maxResults=30`
      );

      const formatted = formatBooks(res.data, "Comics");

      setBooks(formatted);
      if (res.headers["x-books-source"] !== "fallback") {
        localStorage.setItem(BOOK_CACHE_KEY, JSON.stringify(formatted));
      }

      setLoading(false);
    } catch (err) {
      setBooks(getFallbackBooks("Comics", 30));
      setError("");
      setLoading(false);
    }
  };

  fetchBooks();
}, []);

  return (
    <div>
      {error && (
        <p className="display-6 text-danger text-center">{error}</p>
      )}

      <div className="row row-cols-1 row-cols-md-5 g-4">
        {books.map((bookObj) => (
          <div className="col text-center" key={bookObj.id}>
            <div
              className="card h-100 card-margin book-card"
              role="button"
              tabIndex="0"
              onClick={() => openBookDetails(bookObj, navigate)}
              onKeyDown={(e) => e.key === "Enter" && openBookDetails(bookObj, navigate)}
            >
              <img
                src={bookObj.image}
                alt="Book"
                className="profileimage book-card-image"
              />

              <div className="card-body book-card-body">
                <h5 className="book-card-title">{bookObj.name}</h5>
                <p className="book-card-genre">{bookObj.genre}</p>
                <p className="fw-bold book-card-price">{bookObj.priceLabel}</p>
                <p className="text-warning book-card-rating">⭐ {bookObj.rating}</p>

                <button
                  className="bt book-card-button"
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

export default Comics;
