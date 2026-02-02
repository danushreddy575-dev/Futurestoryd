export const requireAuthCart = (bookObj, navigate, setError, addToCartFn) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || !storedUser.id) {
    window.dispatchEvent(new Event("openLogin"));
    return;
  }

  addToCartFn(bookObj, navigate, setError);
};
