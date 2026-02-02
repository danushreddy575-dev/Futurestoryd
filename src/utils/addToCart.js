import axios from "axios";

export const addToCart = async (bookObj, navigate, setError) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.id) {
      setError("Please login first");
      return;
    }

    const userId = storedUser.id;

    const res = await axios.get(`http://localhost:4000/Account/${userId}`);
    const userData = res.data;

    const exists = userData.cart?.some(item => item.id === bookObj.id);

    if (!exists) {
      const updatedCart = [...(userData.cart || []), bookObj];

      await axios.put(`http://localhost:4000/Account/${userId}`, {
        ...userData,
        cart: updatedCart,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, cart: updatedCart })
      );
    }

    navigate("/Cart");
  } catch (err) {
    setError(err.message);
  }
};
