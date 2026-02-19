import { Link } from "react-router-dom";
import { FaBookOpen, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "./MobileBottomNav.css";

function MobileBottomNav({ onBooksClick }) {
  return (
    <div className="mobile-bottom-nav">

      {/* Allbooks (opens categories drawer) */}
      <div onClick={onBooksClick}>
        <FaBookOpen />
        <span>Allbooks</span>
      </div>

      {/* Account */}
      <Link to="/Account" className="mobile-nav-link">
        <FaUserCircle />
        <span>Account</span>
      </Link>

      {/* Cart */}
      <Link to="/Cart" className="mobile-nav-link">
        <FaShoppingCart />
        <span>Cart</span>
      </Link>

    </div>
  );
}

export default MobileBottomNav;
