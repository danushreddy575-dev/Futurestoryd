import { useState, useEffect } from "react";
import axios from "axios";
import "./Allbooks.css";
import { useNavigate } from "react-router-dom";

import { formatBooks } from "../../utils/formatBooks";
import { addToCart } from "../../utils/addToCart";
import { getFallbackBooks } from "../../utils/fallbackBooks";
import { requireAuthCart } from "../../utils/requireAuthCart";
import {
  getRecentlyViewedBooks,
  openBookDetails,
  removeRecentlyViewedBook,
} from "../../utils/bookNavigation";
import { API_URL } from "../../config/api";

const BOOK_CACHE_KEY = "allBooksSectionsV6";

function Allbooks() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [ ,setLoading] = useState(false);
  const [fiction, setFiction] = useState([]);
  const [nonfiction, setNonfiction] = useState([]);
  const [comics, setComics] = useState([]);
  const [children, setChildren] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));

  const goToCart = (bookObj) => {
  requireAuthCart(bookObj, navigate, setError, addToCart);
};


  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    syncLoginState();
    window.addEventListener("authChanged", syncLoginState);

    return () => {
      window.removeEventListener("authChanged", syncLoginState);
    };
  }, []);


  useEffect(() => {
    const loadRecentBooks = () => {
      if (isLoggedIn) {
        setRecentBooks(getRecentlyViewedBooks());
      } else {
        setRecentBooks([]);
      }
    };

    loadRecentBooks();
    window.addEventListener("recentBooksChanged", loadRecentBooks);

    return () => {
      window.removeEventListener("recentBooksChanged", loadRecentBooks);
    };
  }, [isLoggedIn]);


  useEffect(() => {
  const fetchAll = async () => {
    try {
      setLoading(true);

      const cached = localStorage.getItem(BOOK_CACHE_KEY);

      if (cached) {
        try {
          const data = JSON.parse(cached);
          setFiction(data.fiction || []);
          setNonfiction(data.nonfiction || []);
          setComics(data.comics || []);
          setChildren(data.children || []);
          setLoading(false);
          return;
        } catch (cacheError) {
          localStorage.removeItem(BOOK_CACHE_KEY);
        }
      }

      if (!API_URL) {
        setFiction(getFallbackBooks("Fiction", 10));
        setNonfiction(getFallbackBooks("Nonfiction", 10));
        setComics(getFallbackBooks("Comics", 10));
        setChildren(getFallbackBooks("Children", 10));
        setLoading(false);
        return;
      }

      const [f, n, c, ch] = await Promise.all([
        axios.get(`${API_URL}/api/books?search=subject:fiction&maxResults=10`),
        axios.get(`${API_URL}/api/books?search=subject:nonfiction&maxResults=10`),
        axios.get(`${API_URL}/api/books?search=subject:comics&maxResults=10`),
        axios.get(`${API_URL}/api/books?search=subject:children&maxResults=10`)
      ]);

      const fictionData = formatBooks(f.data, "Fiction");
      const nonfictionData = formatBooks(n.data, "Nonfiction");
      const comicsData = formatBooks(c.data, "Comics");
      const childrenData = formatBooks(ch.data, "Children");

      setFiction(fictionData);
      setNonfiction(nonfictionData);
      setComics(comicsData);
      setChildren(childrenData);

      const hasFallbackData = [f, n, c, ch].some(
        (res) => res.headers["x-books-source"] === "fallback"
      );

      if (!hasFallbackData) {
        localStorage.setItem(
          BOOK_CACHE_KEY,
          JSON.stringify({
            fiction: fictionData,
            nonfiction: nonfictionData,
            comics: comicsData,
            children: childrenData
          })
        );
      }

      setLoading(false);
    } catch (err) {
      setFiction(getFallbackBooks("Fiction", 10));
      setNonfiction(getFallbackBooks("Nonfiction", 10));
      setComics(getFallbackBooks("Comics", 10));
      setChildren(getFallbackBooks("Children", 10));
      setError("");
      setLoading(false);
    }
  };

  fetchAll();
}, []);


  const renderSection = (title, books,className) => (
  <div className="section-wrapper">

    <h2 className={`section-title ${className}`}>
      {title}
    </h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {books.map((book) => (
          <div className="col text-center" key={book.id}>
            <div
              className="card h-80 card-margin book-card"
              role="button"
              tabIndex="0"
              onClick={() => openBookDetails(book, navigate)}
              onKeyDown={(e) => e.key === "Enter" && openBookDetails(book, navigate)}
            >
              <img
                src={book.image}
                alt="Book"
                className="profileimage book-card-image"
              />

              <div className="card-body book-card-body">
                <h6 className="book-card-title">{book.name}</h6>
                <p className="book-card-genre">{book.genre}</p>
                <p className="fw-bold book-card-price">{book.priceLabel}</p>
                <p className="text-warning book-card-rating">⭐ {book.rating}</p>

                <button
                  className="bt book-card-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCart(book);
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

  const renderRecentBooks = () => {
    if (!isLoggedIn) {
      return (
        <div className="recent-login-card">
          <span>Recently Viewed</span>
          <h2>Login to keep your book history</h2>
          <p>Your recently viewed books will appear here after you sign in.</p>
        </div>
      );
    }

    if (recentBooks.length === 0) return null;

    return (
      <div className="recent-books-section">
        <div className="recent-books-header">
          <h2>Recently Viewed</h2>
          <span>{recentBooks.length} saved locally</span>
        </div>

        <div className="recent-books-grid">
          {recentBooks.map((book) => (
            <div
              className="recent-book-card"
              key={book.id}
              role="button"
              tabIndex="0"
              onClick={() => openBookDetails(book, navigate)}
              onKeyDown={(e) => e.key === "Enter" && openBookDetails(book, navigate)}
            >
              <img src={book.image} alt={book.name} />
              <div>
                <h6>{book.name}</h6>
                <p>{book.authors?.[0] || book.genre}</p>
              </div>
              <button
                type="button"
                className="recent-book-remove"
                aria-label={`Remove ${book.name} from recently viewed`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentlyViewedBook(book.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4 allbooks-page">
      {error && (
        <p className="text-danger text-center">{error}</p>
      )}

      {renderRecentBooks()}
      {renderSection("Fiction Books",fiction,"fiction")}
      {renderSection("Nonfiction Books", nonfiction,"nonfiction")}
      {renderSection("Top Comics", comics,"comics")}
      {renderSection("Children Books", children,"children")}
    </div>
  );
}

export default Allbooks;
