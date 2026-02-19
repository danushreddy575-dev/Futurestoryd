import { Link } from "react-router-dom";
import { FaBookOpen, FaUserCircle, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import "./MobileBottomNav.css";

function MobileBottomNav({ user, onLoginClick }) {
  return (
    <div className="mobile-bottom-nav">

      {/* Allbooks → navigate only */}
      <Link to="/" className="mobile-nav-link">
        <FaBookOpen />
        <span>Allbooks</span>
      </Link>

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
