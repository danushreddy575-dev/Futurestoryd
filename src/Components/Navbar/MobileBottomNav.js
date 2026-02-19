import { FaBookOpen, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "./MobileBottomNav.css";

function MobileBottomNav({ onBooksClick }) {
  return (
    <div className="mobile-bottom-nav">
      <div onClick={onBooksClick}>
        <FaBookOpen />
        <span>Allbooks</span>
      </div>

      <div>
        <FaUserCircle />
        <span>Account</span>
      </div>

      <div>
        <FaShoppingCart />
        <span>Cart</span>
      </div>
    </div>
  );
}

export default MobileBottomNav;
