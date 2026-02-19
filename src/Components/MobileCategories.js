import { Link } from "react-router-dom";
import "./MobileCategories.css";

function MobileCategories({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="mobile-cat-overlay" onClick={onClose}>
      <div className="mobile-cat" onClick={(e) => e.stopPropagation()}>

        <Link to="/Fiction" onClick={onClose}>Fiction</Link>
        <Link to="/Nonfiction" onClick={onClose}>Non-Fiction</Link>
        <Link to="/Childrenbook" onClick={onClose}>Children</Link>
        <Link to="/Comics" onClick={onClose}>Comics / Manga</Link>

      </div>
    </div>
  );
}

export default MobileCategories;
