import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landingpageContainer">
        
      {/* Navbar */}
      <nav className="navbar">
        <div className="navHeader">
          <h2 style={{ color: "#ff1900" }}>H i m X M e e t</h2>
        </div>

        {/* Nav list (desktop + mobile responsive) */}
        <div className="navlist">
          <Link to="/abx" style={{ textDecoration: "none", color: "inherit" }}>
            <p>Join as Guest</p>
          </Link>
          <Link to="/auth" style={{ textDecoration: "none", color: "inherit" }}>
            Register
          </Link>
          <Link to="/auth" style={{ textDecoration: "none", color: "inherit" }}>
            Login
          </Link>
        </div>
      </nav>

      {/* Main Landing Content */}
      <div className="landingmainContainer">
        <div className="landingText">
          <h1>
            <span style={{ color: "red" }}>Connect</span> with your loved ones <br />
          </h1>
          <p style={{ fontSize: "1.2rem", color: "white" }}>
            Experience seamless communication like never before.
          </p>
          <div role="button" className="getStartedBtn">
            <Link to="/auth">
              <p style={{ fontSize: "1.2rem" }}>Get Started</p>
            </Link>
          </div>
        </div>

        <div className="landingImage">
          <img src="/mobile.png" alt="Mobile" />
        </div>
      </div>
    </div>
  );
}
