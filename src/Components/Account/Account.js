import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_SETUP_MESSAGE, API_URL } from "../../config/api";
import { clearAuthSession, isAuthError } from "../../utils/authSession";
import { GENRE_OPTIONS } from "../../utils/profileOptions";
import "./Account.css";

function Account() {
  const [member, setMember] = useState(null);
  const [profileForm, setProfileForm] = useState({
    favoriteGenres: [],
    favoriteBook: "",
    readingGoal: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const syncProfileForm = (user) => {
    setProfileForm({
      favoriteGenres: user.favoriteGenres || [],
      favoriteBook: user.favoriteBook || "",
      readingGoal: user.readingGoal || "",
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        if (!API_URL) {
          clearAuthSession();
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${API_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMember(res.data);
        syncProfileForm(res.data);
      } catch (err) {
        if (isAuthError(err)) {
          clearAuthSession();
          navigate("/");
          return;
        }

        throw err;
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  const toggleGenre = (genre) => {
    setProfileForm((current) => {
      const hasGenre = current.favoriteGenres.includes(genre);

      return {
        ...current,
        favoriteGenres: hasGenre
          ? current.favoriteGenres.filter((item) => item !== genre)
          : [...current.favoriteGenres, genre],
      };
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setSaving(true);
      setMessage("");

      if (!API_URL) {
        setMessage(API_SETUP_MESSAGE);
        return;
      }

      const res = await axios.put(
        `${API_URL}/api/users/me`,
        {
          ...profileForm,
          readingGoal: Number(profileForm.readingGoal) || 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMember(res.data);
      syncProfileForm(res.data);
      setMessage("Profile preferences saved");
    } catch (err) {
      if (isAuthError(err)) {
        clearAuthSession();
        navigate("/");
        return;
      }

      setMessage(err.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!member) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5 account-page">
      <div className="account-layout">
        <div className="account-summary-card">
          <span className="account-kicker">Reader Space</span>
          <div className="account-avatar">
            {member.username?.charAt(0)?.toUpperCase()}
          </div>
          <h2>{member.username}</h2>
          <p>{member.email}</p>

          <div className="account-stats">
            <div>
              <span>Books I want to read this year</span>
              <strong>{member.readingGoal || 0} books</strong>
            </div>
            <div>
              <span>Favorite</span>
              <strong>{member.favoriteBook || "Not set"}</strong>
            </div>
          </div>

          <button
            className="btn btn-outline-danger mt-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <form className="account-preferences-card" onSubmit={handleProfileSave}>
          <div className="account-heading">
            <span>Personal Shelf</span>
            <h3>Reading Profile</h3>
            <p className="account-helper">
              These preferences will help personalize recommendations later.
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label">Favorite Genres</label>
            <div className="account-genre-grid">
              {GENRE_OPTIONS.map((genre) => (
                <label className="account-genre-choice" key={genre}>
                  <input
                    type="checkbox"
                    checked={profileForm.favoriteGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="account-form-grid">
            <div>
              <label className="form-label">Favorite Book</label>
              <input
                type="text"
                className="form-control"
                name="favoriteBook"
                value={profileForm.favoriteBook}
                onChange={handleProfileChange}
                placeholder="Atomic Habits"
              />
            </div>

            <div>
              <label className="form-label">Books I want to read this year</label>
              <input
                type="number"
                min="0"
                className="form-control"
                name="readingGoal"
                value={profileForm.readingGoal}
                onChange={handleProfileChange}
                placeholder="How many books would you like to read this year?"
              />
            </div>
          </div>

          {message && <p className="account-message">{message}</p>}

          <button className="account-save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Account;
