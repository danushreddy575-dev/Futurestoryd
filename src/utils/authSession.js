export const clearAuthSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChanged"));
};

export const isAuthError = (err) => err.response?.status === 401;
