import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Childrenbook.css";
import { useNavigate } from 'react-router-dom';

import { addToCart } from "../../utils/addToCart";
import { formatBooks } from "../../utils/formatBooks";
import { requireAuthCart } from "../../utils/requireAuthCart";


function Childrenbook() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [books, setBooks] = useState([]); 

  const goToCart = (bookObj) => {
  requireAuthCart(bookObj, navigate, setError, addToCart);
};


  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const cached = localStorage.getItem("childrenBooks");

      //  if cached → instant load
      if (cached) {
        setBooks(JSON.parse(cached));
        return;
      }

      //  first time only → call API
      const res = await axios.get(
        "https://www.googleapis.com/books/v1/volumes?q=subject:children&maxResults=20"
      );

      const formatted = formatBooks(res.data.items, "Children");

      setBooks(formatted);

      // ✅ save cache
      localStorage.setItem(
        "childrenBooks",
        JSON.stringify(formatted)
      );

    } catch (err) {
      setError(err.message);
    }
  };

  fetchBooks();
}, []);


  return (
    <div>
      {error && (
        <p className="display-6 text-danger text-center">{error}</p>
      )}

      <div className="row row-cols-1 row-cols-md-5 g-4">
        {books.map(bookObj => (   
          <div className="col text-center" key={bookObj.id}>
            <div className="card h-100 card-margin">
              <img src={bookObj.image} alt="Book" className="profileimage" />

              <div className="card-body">
                <h5>{bookObj.name}</h5>
                <p>{bookObj.genre}</p>
                <p className="fw-bold">₹{bookObj.price}</p>
                <p className="text-warning">⭐ {bookObj.rating}</p>

                <button
                  className="bt"
                  onClick={() => goToCart(bookObj)}
                >
                  Add To Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Childrenbook;
