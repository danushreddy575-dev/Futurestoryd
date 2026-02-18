export const requireAuthCart = (
  bookObj,
  navigate,
  setError,
  addToCart
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("Please login first");
    navigate("/login");
    return;
  }

  addToCart(bookObj, navigate, setError);
};
