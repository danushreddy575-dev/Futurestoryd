import React from "react";
import "./Footer.css"
function Footer() {
  return (
    <footer className="text-dark text-center py-3 foot">
      <div className="container ">
        <p className="mb-1">
          © {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <div>
          <a href="/about" className="text-dark me-3">About</a>
          <a href="/contact" className="text-dark me-3">Contact</a>
          <a href="/privacy" className="text-dark">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
