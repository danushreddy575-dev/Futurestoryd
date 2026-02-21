import { FaBookOpen, FaUserCircle, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MobileBottomNav.css";

function MobileBottomNav({ user, onLoginClick, onBooksClick }) {
  return (
    <div className="mobile-bottom-nav">

      {/* Books */}
      <div className="mobile-nav-link" onClick={onBooksClick}>
        <FaBookOpen />
        <span>Books</span>
      </div>

      {/* Login / Account */}
      {!user ? (
        <div onClick={onLoginClick} className="mobile-nav-link">
          <FaSignInAlt />
          <span>Login</span>
        </div>
      ) : (
        <Link to="/Account" className="mobile-nav-link">
          <FaUserCircle />
          <span>Account</span>
        </Link>
      )}

      {/* Cart */}
      <Link to="/Cart" className="mobile-nav-link">
        <FaShoppingCart />
        <span>Cart</span>
      </Link>

    </div>
  );
}

export default MobileBottomNav;
