import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Cart() {
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token");
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/cart",
        {
          headers: {

            
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      return;
    }

    fetchCart();
  }, [fetchCart, token]);

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/users/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(res.data || []);
    } catch (err) { 
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-4">

      {error && (
        <p className="display-6 text-danger text-center">{error}</p>
      )}




      {!error && cartItems.length === 0 && (
        <div className="text-center mt-5">
          <h4>Your cart is empty 🛒</h4>
          <p className="text-muted">Add some books to start reading!</p>
        </div>
      )}

      {/* CART ITEMS */}
      {cartItems.map((item, index) =>(
        <div
          className="card mb-3"
          style={{ maxWidth: "540px" }}
          key={item._id || `${item.productId}-${index}`}
        >
          <div className="row g-0">
 
            {/* Image */}
            <div className="col-md-4">
              <img
                src={item.image}
                className="img-fluid rounded-start"
                alt={item.title}
              />
            </div>

            {/* Details */}
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p>Quantity: {item.quantity}</p>
                <p className="fw-bold">₹{item.price}</p>

                <button
                  className="btn btn-danger mt-2"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cart;
