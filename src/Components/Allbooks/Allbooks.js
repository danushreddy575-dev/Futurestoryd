import { useState, useEffect } from "react";
import axios from "axios";
import "./Allbooks.css";
import { useNavigate } from "react-router-dom";

import { formatBooks } from "../../utils/formatBooks";
import { addToCart } from "../../utils/addToCart";
import { requireAuthCart } from "../../utils/requireAuthCart";


function Allbooks() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [ ,setLoading] = useState(false);
  const [fiction, setFiction] = useState([]);
  const [nonfiction, setNonfiction] = useState([]);
  const [comics, setComics] = useState([]);
  const [children, setChildren] = useState([]);

  const goToCart = (bookObj) => {
  requireAuthCart(bookObj, navigate, setError, addToCart);
};


  useEffect(() => {
  const fetchAll = async () => {
    try {
      setLoading(true);

      const cached = localStorage.getItem("allBooksSections");

      if (cached) {
        const data = JSON.parse(cached);
        setFiction(data.fiction);
        setNonfiction(data.nonfiction);
        setComics(data.comics);
        setChildren(data.children);
        setLoading(false);
        return;
      }

      const [f, n, c, ch] = await Promise.all([
        axios.get("https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=8"),
        axios.get("https://www.googleapis.com/books/v1/volumes?q=subject:nonfiction&maxResults=8"),
        axios.get("https://www.googleapis.com/books/v1/volumes?q=subject:comics&maxResults=8"),
        axios.get("https://www.googleapis.com/books/v1/volumes?q=subject:children&maxResults=8")
      ]);

      const fictionData = formatBooks(f.data.items, "Fiction");
      const nonfictionData = formatBooks(n.data.items, "Nonfiction");
      const comicsData = formatBooks(c.data.items, "Comics");
      const childrenData = formatBooks(ch.data.items, "Children");

      setFiction(fictionData);
      setNonfiction(nonfictionData);
      setComics(comicsData);
      setChildren(childrenData);

      localStorage.setItem(
        "allBooksSections",
        JSON.stringify({
          fiction: fictionData,
          nonfiction: nonfictionData,
          comics: comicsData,
          children: childrenData
        })
      );

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchAll();
}, []);


  const renderSection = (title, books,className) => (
  <div className="section-wrapper">

    <h2 className={`section-title ${className}`}>
      {title}
    </h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {books.map((book) => (
          <div className="col text-center" key={book.id}>
            <div className="card h-80 card-margin">
              <img
                src={book.image}
                alt="Book"
                className="profileimage"
              />

              <div className="card-body">
                <h6>{book.name}</h6>
                <p>{book.genre}</p>
                <p className="fw-bold">₹{book.price}</p>
                <p className="text-warning">⭐ {book.rating}</p>

                <button
                  className="bt"
                  onClick={() => goToCart(book)}
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

  return (
    <div className="container mt-4">
      {error && (
        <p className="text-danger text-center">{error}</p>
      )}

      {renderSection("Top Fiction Books",fiction,"fiction")}
      {renderSection("Top Nonfiction Books", nonfiction,"nonfiction")}
      {renderSection("Top Comics", comics,"comics")}
      {renderSection("Top Children Books", children,"children")}
    </div>
  );
}

export default Allbooks;
