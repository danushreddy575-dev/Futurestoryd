import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../../utils/addToCart";
import { API_URL } from "../../config/api";
import { formatBooks } from "../../utils/formatBooks";
import { openBookDetails } from "../../utils/bookNavigation";
import { clearAuthSession, isAuthError } from "../../utils/authSession";
import { requireAuthCart } from "../../utils/requireAuthCart";
import { getStoreLinks } from "../../utils/storeLinks";
import "./BookDetails.css";

const cleanDescription = (description) => {
  if (!description) return "";

  const element = document.createElement("div");
  element.innerHTML = description;
  return element.textContent || element.innerText || "";
};

const getSimilarSearch = (book) => {
  if (book.genre && !["Search", "General"].includes(book.genre)) {
    return `subject:${book.genre}`;
  }

  if (book.authors?.length > 0) {
    return `inauthor:${book.authors[0]}`;
  }

  return book.name || "books";
};

const normalizeText = (value) => String(value || "").toLowerCase();

const hasGenreMatch = (bookGenre, favoriteGenres = []) => {
  const genre = normalizeText(bookGenre).replace(/[^a-z]/g, "");

  return favoriteGenres.some((favorite) => {
    const normalizedFavorite = normalizeText(favorite).replace(/[^a-z]/g, "");

    return (
      genre.includes(normalizedFavorite) ||
      normalizedFavorite.includes(genre) ||
      (genre === "comics" && normalizedFavorite === "comicsmanga")
    );
  });
};

const getBookMatch = (book, profile, description) => {
  const reasons = [];
  let score = 38;
  const rating = Number(book.averageRating || book.rating);
  const pageCount = Number(book.pageCount);
  const favoriteGenres = profile?.favoriteGenres || [];
  const likedGenres =
    profile?.readingHistory
      ?.filter((item) => item.completed && item.rating >= 4)
      .map((item) => item.genre)
      .filter(Boolean) || [];

  if (profile && hasGenreMatch(book.genre, favoriteGenres)) {
    score += 28;
    reasons.push(`It matches your favorite ${book.genre} preference.`);
  } else if (profile && hasGenreMatch(book.genre, likedGenres)) {
    score += 20;
    reasons.push(`You rated similar ${book.genre} books highly before.`);
  } else if (book.genre && book.genre !== "Search") {
    score += 8;
    reasons.push(`It belongs to ${book.genre}, so it fits a clear reading category.`);
  }

  if (rating >= 4.2) {
    score += 18;
    reasons.push("It has a strong reader rating.");
  } else if (rating >= 3.7) {
    score += 10;
    reasons.push("It has a decent reader rating.");
  }

  if (pageCount > 0 && pageCount <= 350) {
    score += 10;
    reasons.push("The page count looks manageable for regular reading.");
  } else if (pageCount > 350) {
    score += 4;
    reasons.push("It is a longer book, better if you want a deeper read.");
  }

  if (profile?.favoriteBook) {
    const favoriteWords = normalizeText(profile.favoriteBook)
      .split(/\s+/)
      .filter((word) => word.length > 3);
    const searchableText = normalizeText(
      `${book.name} ${book.authors?.join(" ")} ${description}`
    );

    if (favoriteWords.some((word) => searchableText.includes(word))) {
      score += 14;
      reasons.push("It shares some signals with your favorite book.");
    }
  }

  if (description) {
    score += 6;
    reasons.push("It has enough description data to judge before buying.");
  }

  const matchScore = Math.min(score, 96);
  const verdict =
    matchScore >= 78
      ? "Strong match"
      : matchScore >= 60
      ? "Good match"
      : "Worth exploring";

  if (!profile) {
    reasons.unshift("Sign in and complete your profile for a more personal match.");
  }

  return {
    score: matchScore,
    verdict,
    reasons: reasons.slice(0, 4),
  };
};

const getDefaultReadingStatus = (book) => ({
  bookId: book?.id || "",
  bought: false,
  completed: false,
  rating: null,
});

function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [similarBooks, setSimilarBooks] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [readerProfile, setReaderProfile] = useState(null);
  const [readingStatus, setReadingStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBookMatch, setAiBookMatch] = useState(null);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);

  useEffect(() => {
    const storedBook = sessionStorage.getItem("selectedBook");

    if (!storedBook) {
      setError("Book details are not available. Please open a book from the list.");
      return;
    }

    setBook(JSON.parse(storedBook));
  }, [id]);

  useEffect(() => {
    if (!book) return;

    const fetchSimilarBooks = async () => {
      try {
        setSimilarLoading(true);
        const queryResponse = await axios.post(`${API_URL}/api/ai/similar-queries`, {
          title: book.name,
          author: book.authors?.join(", "),
          genre: book.genre,
          description: cleanDescription(book.description),
        });
        const aiQuery = queryResponse.data.queries?.[0] || getSimilarSearch(book);
        const response = await axios.get(
          `${API_URL}/api/books?search=${encodeURIComponent(aiQuery)}&maxResults=8`
        );
        const books = formatBooks(response.data, book.genre || "Similar").filter(
          (item) => item.id !== book.id && item.name !== book.name
        );

        setSimilarBooks(books.slice(0, 4));
      } catch (err) {
        try {
          const fallbackSearch = getSimilarSearch(book);
          const response = await axios.get(
            `${API_URL}/api/books?search=${encodeURIComponent(fallbackSearch)}&maxResults=8`
          );
          const books = formatBooks(response.data, book.genre || "Similar").filter(
            (item) => item.id !== book.id && item.name !== book.name
          );

          setSimilarBooks(books.slice(0, 4));
        } catch (fallbackErr) {
          setSimilarBooks([]);
        }
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilarBooks();
  }, [book]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchReaderProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReaderProfile(res.data);
      } catch (err) {
        if (isAuthError(err)) {
          clearAuthSession();
        }
      }
    };

    fetchReaderProfile();
  }, []);

  useEffect(() => {
    if (!book) return;

    setAiDescription("");
    setAiLoading(false);
    setAiBookMatch(null);
    setAiMatchLoading(false);

    const token = localStorage.getItem("token");

    if (!token) {
      setReadingStatus(getDefaultReadingStatus(book));
      return;
    }

    const fetchReadingStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/users/reading-history/${encodeURIComponent(book.id)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReadingStatus(res.data);
      } catch (err) {
        if (isAuthError(err)) {
          clearAuthSession();
        }

        setReadingStatus(getDefaultReadingStatus(book));
      }
    };

    fetchReadingStatus();
  }, [book]);

  useEffect(() => {
    if (!book) return;

    const existingDescription = cleanDescription(book.description);

    if (existingDescription) return;

    const fetchAiDescription = async () => {
      try {
        setAiLoading(true);

        const res = await axios.post(`${API_URL}/api/ai/book-description`, {
          title: book.name,
          author: book.authors?.join(", "),
          genre: book.genre,
          pageCount: book.pageCount,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          existingDescription,
        });

        setAiDescription(res.data.description || "");
      } catch (err) {
        setAiDescription("");
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiDescription();
  }, [book]);

  useEffect(() => {
    if (!book || !readerProfile) return;

    const descriptionForMatch =
      cleanDescription(book.description) || aiDescription || "";

    const fetchAiBookMatch = async () => {
      try {
        setAiMatchLoading(true);

        const res = await axios.post(`${API_URL}/api/ai/personal-match`, {
          book: {
            title: book.name,
            author: book.authors?.join(", "),
            genre: book.genre,
            pageCount: book.pageCount,
            rating: book.averageRating || book.rating,
            description: descriptionForMatch,
          },
          profile: readerProfile,
        });

        setAiBookMatch(res.data);
      } catch (err) {
        setAiBookMatch(null);
      } finally {
        setAiMatchLoading(false);
      }
    };

    fetchAiBookMatch();
  }, [book, readerProfile, aiDescription]);

  if (error) {
    return <p className="display-6 text-danger text-center">{error}</p>;
  }

  if (!book) {
    return <p className="text-center">Loading...</p>;
  }

  const storeLinks = getStoreLinks(book);
  const description = cleanDescription(book.description);
  const authorText =
    book.authors?.length > 0 ? book.authors.join(", ") : "Author not available";
  const ratingText =
    book.averageRating || book.rating
      ? `${book.averageRating || book.rating}${book.ratingsCount ? ` (${book.ratingsCount} ratings)` : ""}`
      : "Not available";
  const bookMatch = aiBookMatch || getBookMatch(book, readerProfile, description || aiDescription);
  const shouldCheckStorePrice = book.price === null || book.priceLabel === "Check store prices";

  const goToCart = () => {
    requireAuthCart(book, navigate, setError, addToCart);
  };

  const scrollToStoreLinks = () => {
    document
      .getElementById("compare-buying-options")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveReadingStatus = async (updates) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatusMessage("Login to track bought, completed, and ratings.");
      return;
    }

    const nextStatus = {
      ...getDefaultReadingStatus(book),
      ...readingStatus,
      ...updates,
    };

    if (!nextStatus.completed) {
      nextStatus.rating = null;
    }

    try {
      setStatusSaving(true);
      setStatusMessage("");

      const res = await axios.put(
        `${API_URL}/api/users/reading-history/${encodeURIComponent(book.id)}`,
        {
          ...nextStatus,
          title: book.name,
          genre: book.genre,
          image: book.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReadingStatus(res.data);
      setReaderProfile((current) => {
        if (!current) return current;

        const currentHistory = current.readingHistory || [];
        const nextHistory = [
          res.data,
          ...currentHistory.filter((item) => item.bookId !== res.data.bookId),
        ];

        return {
          ...current,
          readingHistory: nextHistory,
        };
      });
      setStatusMessage("Reading status saved");
    } catch (err) {
      if (isAuthError(err)) {
        clearAuthSession();
        setStatusMessage("Session expired. Please login again.");
        return;
      }

      setStatusMessage(err.response?.data?.message || "Could not save reading status");
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="book-details-page">
      <button className="book-details-back" type="button" onClick={() => navigate(-1)}>
        Back to books
      </button>

      <div className="book-details-panel">
        <div className="book-details-cover-wrap">
          <img className="book-details-cover" src={book.image} alt={book.name} />
          {shouldCheckStorePrice ? (
            <button
              type="button"
              className="book-details-price book-details-price-button"
              onClick={scrollToStoreLinks}
            >
              {book.priceLabel}
            </button>
          ) : (
            <span className="book-details-price">{book.priceLabel}</span>
          )}
        </div>

        <div className="book-details-content">
          <div className="book-details-header">
            <p className="book-details-genre">{book.genre}</p>
            <h1>{book.name}</h1>
            <p className="book-details-author">By {authorText}</p>
          </div>

          <div className="book-details-actions">
            <button type="button" className="book-primary-action" onClick={goToCart}>
              Add To Wishlist
            </button>
            {book.previewLink && (
              <a href={book.previewLink} target="_blank" rel="noreferrer">
                Preview Book
              </a>
            )}
          </div>

          <div className="book-details-meta">
            <div>
              <span>Pages</span>
              <strong>{book.pageCount || "Not available"}</strong>
            </div>
            <div>
              <span>Rating</span>
              <strong>{ratingText}</strong>
            </div>
            <div>
              <span>Published</span>
              <strong>{book.publishedDate || "Not available"}</strong>
            </div>
            <div>
              <span>Publisher</span>
              <strong>{book.publisher || "Not available"}</strong>
            </div>
          </div>

          <p className="book-details-note">
            Prices are shown only when Google Books provides them. Use store links below to compare current prices.
          </p>

          <div className="book-match-card">
            <div>
              <span>
                {aiBookMatch
                  ? "AI Personal Match"
                  : aiMatchLoading
                  ? "Checking your taste"
                  : "Is this book for you?"}
              </span>
              <h2>{bookMatch.verdict}</h2>
            </div>
            <strong>{bookMatch.score}%</strong>
            <ul>
              {bookMatch.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="reading-status-card">
            <div className="reading-status-header">
              <div>
                <span>Reading Status</span>
                <h2>Track your progress</h2>
              </div>
              {statusSaving && <small>Saving...</small>}
            </div>

            <div className="reading-status-options">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(readingStatus?.bought)}
                  onChange={(e) => saveReadingStatus({ bought: e.target.checked })}
                />
                <span>Bought</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={Boolean(readingStatus?.completed)}
                  onChange={(e) => saveReadingStatus({ completed: e.target.checked })}
                />
                <span>Completed Reading</span>
              </label>
            </div>

            <div className="book-rating-control">
              <p>
                {readingStatus?.completed
                  ? "Rate this book"
                  : "Complete the book to unlock rating"}
              </p>
              <div>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={Number(readingStatus?.rating) >= value ? "active" : ""}
                    disabled={!readingStatus?.completed || statusSaving}
                    onClick={() => saveReadingStatus({ rating: value })}
                    aria-label={`Rate ${value} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {statusMessage && <p className="reading-status-message">{statusMessage}</p>}
          </div>

          <div className="book-details-description">
            <div className="book-description-header">
              <h2>Description</h2>
              {!description && aiDescription && <span>AI generated</span>}
            </div>
            {aiLoading ? (
              <p>Generating a helpful description...</p>
            ) : (
              <p>
                {description ||
                  aiDescription ||
                  "Description is not available for this book yet."}
              </p>
            )}
          </div>

          <div className="book-store-links" id="compare-buying-options">
            <div className="book-store-header">
              <div>
                <span>Manual Price Check</span>
                <h2>Compare Store Prices</h2>
              </div>
              <p>Prices open on external stores, so you always see the latest seller price.</p>
            </div>

            <div className="book-store-grid">
              {storeLinks.map((link) => (
                <a
                  className="book-store-card"
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{link.name}</strong>
                  <span>{link.description}</span>
                  <small>Open store</small>
                </a>
              ))}
            </div>
          </div>

          <div className="similar-books-section">
            <h2>Similar Books</h2>
            {similarLoading ? (
              <p className="similar-books-status">Finding similar books...</p>
            ) : similarBooks.length > 0 ? (
              <div className="similar-books-grid">
                {similarBooks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="similar-book-card"
                    onClick={() => openBookDetails(item, navigate)}
                  >
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                    <small>{item.authors?.[0] || item.genre}</small>
                  </button>
                ))}
              </div>
            ) : (
              <p className="similar-books-status">No similar books found right now.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
