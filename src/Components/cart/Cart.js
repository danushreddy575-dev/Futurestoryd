import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_SETUP_MESSAGE, API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { openBookDetails } from "../../utils/bookNavigation";
import { clearAuthSession, isAuthError } from "../../utils/authSession";
import "./Cart.css";

function Cart() {
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const fetchCart = useCallback(async () => {
    try {
      if (!API_URL) {
        setError(API_SETUP_MESSAGE);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/users/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data || []);
    } catch (err) {
      if (isAuthError(err)) {
        clearAuthSession();
        navigate("/");
        return;
      }

      setError(err.response?.data?.message || err.message);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      setError("");
      return;
    }

    fetchCart();
  }, [fetchCart, token]);

  const removeFromCart = async (productId) => {
    try {
      if (!API_URL) {
        setError(API_SETUP_MESSAGE);
        return;
      }

      const res = await axios.delete(
        `${API_URL}/api/users/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(res.data || []);
    } catch (err) { 
      if (isAuthError(err)) {
        clearAuthSession();
        navigate("/");
        return;
      }

      setError(err.response?.data?.message || err.message);
    }
  };

  const openCartBook = (item) => {
    openBookDetails(
      {
        id: item.productId,
        name: item.title,
        image: item.image,
        price: item.price,
        priceLabel: item.priceLabel || (item.price ? `₹${item.price}` : "Check store prices"),
        genre: "Saved Book",
        rating: item.rating || "Not available",
        quantity: item.quantity,
      },
      navigate
    );
  };

  return (
    <div className="container mt-4 wishlist-page">

      {error && (
        <p className="display-6 text-danger text-center">{error}</p>
      )}

      {!token && (
        <div className="wishlist-state-card wishlist-login-card">
          <span>Wishlist</span>
          <h2>Login to view your wishlist</h2>
          <p>
            Save books you want to buy, compare, or read later after signing in.
          </p>
        </div>
      )}

      {token && !error && cartItems.length === 0 && (
        <div className="wishlist-state-card">
          <span>Wishlist</span>
          <h4>Your wishlist is empty</h4>
          <p>Add books you want to buy, compare, or explore later.</p>
        </div>
      )}

      {token && cartItems.length > 0 && (
        <div className="wishlist-header">
          <div>
            <span>Saved Books</span>
            <h2>My Wishlist</h2>
          </div>
          <p>{cartItems.length} book{cartItems.length === 1 ? "" : "s"} saved</p>
        </div>
      )}

      {/* WISHLIST ITEMS */}
      <div className="wishlist-grid">
        {token && cartItems.map((item, index) =>(
          <div
            className="wishlist-card"
            key={item._id || `${item.productId}-${index}`}
            role="button"
            tabIndex="0"
            onClick={() => openCartBook(item)}
            onKeyDown={(e) => e.key === "Enter" && openCartBook(item)}
          >
            <img src={item.image} alt={item.title} />

            <div className="wishlist-card-body">
              <h5>{item.title}</h5>
              <p className="wishlist-price">
                {item.priceLabel || (item.price ? `₹${item.price}` : "Check store prices")}
              </p>
              <p className="wishlist-quantity">Quantity: {item.quantity}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(item.productId);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
