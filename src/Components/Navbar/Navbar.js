import "./Navbar.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Login from "../Login/Login";
import Register from "../Registration/Register";
import MobileBottomNav from "./MobileBottomNav";
import MobileCategories from "../MobileCategories";
import { API_URL } from "../../config/api";
import { FaUserCircle, FaHeart, FaSearch } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState(null);
  const closeLogin = () => setShowLogin(false);
  const closeRegister = () => setShowRegister(false);

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  }; 


  useEffect(() => {
    const syncUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      setUser(token && storedUser ? JSON.parse(storedUser) : null);
    };

    syncUser();

    window.addEventListener("authChanged", syncUser);

    return () => {
      window.removeEventListener("authChanged", syncUser);
    };
  }, []);

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/books?search=${encodeURIComponent(query)}&maxResults=5`
        );

        const titles = (res.data || [])
          .map((item) => item.volumeInfo?.title)
          .filter(Boolean)
          .filter((title, index, list) => list.indexOf(title) === index)
          .slice(0, 5);

        setSuggestions(titles);
        setShowSuggestions(titles.length > 0);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);


  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    setUser(JSON.parse(storedUser));
    setShowLogin(false);

    window.dispatchEvent(new Event("authChanged"));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    searchBooks(searchText);
  };

  const searchBooks = (value) => {
    const query = value.trim();
    if (!query) return;

    navigate(`/Search?q=${encodeURIComponent(query)}`);
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="navi">
      <nav
        className="navbar navbar-expand-lg fixed-top"
      >
        <div className="container-fluid">

          <Link className="brand-logo" to="/" aria-label="FutureStoryd home">
            <span className="brand-future">Future</span>
            <span className="brand-storyd">Storyd</span>
          </Link>

          {/* SECTION LINKS */}
          <ul className="navbar-nav nav-section-links mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Allbooks
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Fiction">Fiction</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Nonfiction">Non-Fiction</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Comics">Comics/manga</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Childrenbook">Children</Link>
            </li>

          </ul>

          {/* RIGHT SIDE */}
          <form className="nav-search-form" onSubmit={handleSearch}>
            <input
              className="nav-search-input"
              type="search"
              placeholder="Search books"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              aria-label="Search books"
            />
            <button className="nav-search-button" type="submit" aria-label="Search">
              <FaSearch size={14} />
            </button>

            {showSuggestions && (
              <div className="nav-search-suggestions">
                {suggestions.map((title) => (
                  <button
                    className="nav-search-suggestion"
                    key={title}
                    type="button"
                    onMouseDown={() => searchBooks(title)}
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </form>

          <ul className="navbar-nav mb-2 mb-lg-0">

            {!user && (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ marginLeft: "15px", cursor: "pointer" }}
                  onClick={() => setShowLogin(true)}
                >
                  ➡️ Login
                </span>
              </li>
            )}

            {user && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/Account"
                  style={{ marginLeft: "15px" }}
                >
                  <FaUserCircle size={28} />
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/Wishlist"
                style={{ marginLeft: "15px" }}
              >
                <FaHeart size={24} />
              </Link>
            </li>

          </ul>
        </div>
      </nav>


    {/* LOGIN MODAL */}
    <Modal show={showLogin} onClose={closeLogin}>
      <Login
        onClose={closeLogin}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={switchToRegister}
      />
    </Modal>
    {/* REGISTER MODAL */}
    <Modal show={showRegister} onClose={closeRegister}>
      <Register
        onClose={closeRegister}
        onSwitchToLogin={switchToLogin}
      />
    </Modal>

    <MobileBottomNav
      user={user}
      onLoginClick={() => setShowLogin(true)}
      onBooksClick={() => setShowMobileCategories(true)}
    />

    <MobileCategories
      show={showMobileCategories}
      onClose={() => setShowMobileCategories(false)}
    />

    </div>
  );
}

export default Navbar;
