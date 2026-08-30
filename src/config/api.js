const LOCAL_API_URL = "http://localhost:5000";

const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();
const isLocalBrowser =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_URL = configuredApiUrl || (isLocalBrowser ? LOCAL_API_URL : "");

export const API_SETUP_MESSAGE =
  "Backend URL is not configured. Add REACT_APP_API_URL in your frontend deployment settings.";
