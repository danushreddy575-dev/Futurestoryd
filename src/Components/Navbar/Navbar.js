import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Login from "../Login/Login";
import Register from "../Registration/Register";
import MobileBottomNav from "./MobileBottomNav";
import MobileCategories from "../MobileCategories";
import { FaUserCircle, FaShoppingCart, FaBookOpen } from "react-icons/fa";

function Navbar() {
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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
    const handleScroll = () => {
      if (window.innerWidth <= 768 && window.scrollY > 80) {
        setShowMobileCategories(true);
      } else {
        setShowMobileCategories(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    setUser(JSON.parse(storedUser));
    setShowLogin(false);

    window.dispatchEvent(new Event("authChanged"));
  };

  return (
    <div className="navi">
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: "#aeb6baff" }}
      >
        <div className="container-fluid">

          {/* LEFT LINKS (your old UI kept) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">
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

          {/* RIGHT SIDE */}
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
                to="/Cart"
                style={{ marginLeft: "15px" }}
              >
                <FaShoppingCart size={24} />
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
    />
    </div>
  );
}

export default Navbar;
