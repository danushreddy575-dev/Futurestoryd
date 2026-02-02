import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Login from "../Login/Login";
import Register from "../Registration/Register";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";



function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  const [user, setUser] = useState(null);

  // check login on load
  useEffect(() => {
  const openLoginHandler = () => setShowLogin(true);

  const syncUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  syncUser();

  window.addEventListener("openLogin", openLoginHandler);
  window.addEventListener("storage", syncUser);

  return () => {
    window.removeEventListener("openLogin", openLoginHandler);
    window.removeEventListener("storage", syncUser);
  };
}, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    setUser(JSON.parse(storedUser));
    setShowLogin(false);
  };

  return (
    <div className="navi">
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: "#aeb6baff" }}
      >
        <div className="container-fluid">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" title="All Books">
              <FaBookOpen size={24} /> Allbooks
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
          <form className="d-flex ms-auto my-2 my-lg-0 search-form">
            <input
              className="form-control me-2"
              type="search"
              placeholder="🔍 Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
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
                title="Account"
              >
                <FaUserCircle size={28} />
              </Link>
            </li>
            )}


            <li className="nav-item">
            <Link
              className="nav-link"
              to="/Cart"
              style={{ marginLeft: "15px" }}
              title="Cart"
            >
              <FaShoppingCart size={24} />
            </Link>
            </li>

          </ul>
        </div>
      </nav>

      <Modal show={showLogin} onClose={() => setShowLogin(false)}>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </Modal>

      <Modal show={showRegister} onClose={() => setShowRegister(false)}>
        <Register
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </Modal>
    </div>
  );
}

export default Navbar;
