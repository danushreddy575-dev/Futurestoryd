import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./footer/Footer";
import "./Root.css";

function Root() {
  return (
    <div className="d-flex flex-column min-vh-100" id="root">
      <header>
        <Navbar className="navbar sticky-top bg-light shadow-sm" />
      </header>
      <main className="flex-grow-1 container mt-4">
        <Outlet /> 
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default Root;
