import { useState, useEffect } from "react";
import axios from "axios";

function Cart() {
  const [error, setError] = useState("");
  const [carties, setCarties] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get userId dynamically (e.g. from localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    } else {
      setError("User not logged in");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:4000/Account/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setCarties(response.data.cart || []);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [userId]);

  const removeFromCart = async (id) => {
    try {
      if (!id) throw new Error("Invalid id passed to removeFromCart");

      // get user first
      const userRes = await axios.get(
        `http://localhost:4000/Account/${userId}`
      );
      const userData = userRes.data;

      // filter cart
      const updatedCart = userData.cart.filter((item) => item.id !== id);

      // update db.json
      await axios.put(`http://localhost:4000/Account/${userId}`, {
        ...userData,
        cart: updatedCart,
      });

      // update UI
      setCarties(updatedCart);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      {error && (
        <p className="display-3 text-danger text-center">{error}</p>
      )}
      {carties.map((userObj) => (
        <div
          className="card mb-3"
          style={{ maxWidth: "540px" }}
          key={userObj.id}
        >
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={userObj.image}
                className="img-fluid rounded-start"
                alt={userObj.name}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{userObj.name}</h5>
                <p className="card-text">{userObj.genre}</p>
                <p className="card-text fw-bold">₹{userObj.price}</p>
                <p className="card-text text-warning">⭐ {userObj.rating}</p>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => removeFromCart(userObj.id)}
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
