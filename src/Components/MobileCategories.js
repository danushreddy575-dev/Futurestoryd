import "./MobileCategories.css";

function MobileCategories({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="mobile-cat-overlay" onClick={onClose}>
      <div
        className="mobile-cat"
        onClick={(e) => e.stopPropagation()}
      >
        <p>Fiction</p>
        <p>Non-Fiction</p>
        <p>Children</p>
        <p>Comics / Manga</p>
      </div>
    </div>
  );
}

export default MobileCategories;
