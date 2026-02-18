import axios from "axios";
export const addToCart = async (bookObj, navigate, setError) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    await axios.post(
      "http://localhost:5000/api/users/cart",
      {
        productId: bookObj.id,
        title: bookObj.name,
        image: bookObj.image,   
        price: bookObj.price,
        quantity: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    navigate("/cart");
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
};
