import { Link } from "react-router-dom";
import "./MobileCategories.css";

function MobileCategories({ show }) {
  if (!show) return null;

  return (
    <div className="mobile-cat">
      <Link to="/Fiction">Fiction</Link>
      <Link to="/Nonfiction">Non-Fiction</Link>
      <Link to="/Childrenbook">Children</Link>
      <Link to="/Comics">Comics / Manga</Link>
    </div>
  );
}

export default MobileCategories;
