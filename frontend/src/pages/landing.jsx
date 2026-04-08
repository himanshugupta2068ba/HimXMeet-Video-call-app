import React, { useContext } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { handleGuestLogin } = useContext(AuthContext);
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const isGuest = localStorage.getItem("isGuest") === "true";
  const profileName = isGuest
    ? localStorage.getItem("guestName") || "Guest"
    : localStorage.getItem("userName") || localStorage.getItem("userUsername") || "Profile";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestName");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    navigate("/auth?mode=login");
  };

  return (
    <div className="landingpageContainer">
      <nav className="navbar">
        <div className="navHeader">
          <button type="button" className="navAsButton" onClick={() => navigate('/')}>H i m X M e e t</button>
        </div>

        <div className="navlist">
          {isAuthenticated ? (
            <>
              <button type="button" className="navAsButton" onClick={() => navigate('/home')}>Home</button>
              <button type="button" className="navAsButton" onClick={() => navigate('/profile')}>{profileName}</button>
              <button type="button" className="navAsButton" onClick={() => navigate('/history')}>History</button>
              <button type="button" className="navAsButton" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button type="button" className="navAsButton" onClick={() => handleGuestLogin('Guest')}>Join as Guest</button>
              <Link to="/auth?mode=register" style={{ textDecoration: "none", color: "inherit" }}>
                Register
              </Link>
              <Link to="/auth?mode=login" style={{ textDecoration: "none", color: "inherit" }}>
                Login
              </Link>
            </>
          )}
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
            <Link to="/auth?mode=login" style={{ textDecoration: "none", color: "inherit" }}>
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
