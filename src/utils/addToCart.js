import axios from "axios";
import { API_URL } from "../config/api";
import { clearAuthSession, isAuthError } from "./authSession";

export const addToCart = async (bookObj, navigate, setError) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    await axios.post(
      `${API_URL}/api/users/cart`,
      {
        productId: bookObj.id,
        title: bookObj.name,
        image: bookObj.image,   
        price: bookObj.price,
        priceLabel: bookObj.priceLabel,
        quantity: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    navigate("/Wishlist");
  } catch (err) {
    if (isAuthError(err)) {
      clearAuthSession();
      navigate("/");
      return;
    }

    setError(err.response?.data?.message || err.message);
  }
};
