import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
export default function LandingPage(){
    return (
        <div className="landingpageContainer">
           <nav>
            <div className="navHeader">
                <h2>H i m X   M e e t</h2>
            </div>
            <div className="navlist">
                <p>Join as Guest</p>
                <p>Register</p>
                <div role="button">
                    <p>Login</p>
                </div>
            </div>
           </nav>
           <div className="landingmainContainer">
            <div>
                <h1>
                    <span style={{ color: "orange" }}>Connect</span> with your loved ones <br />
                </h1>
                <p style={{ fontSize: "1.5rem", color: "white" }}>Experience seamless communication like never before.</p>
                <div role="button " className="getStartedBtn">
                    <Link to={"/home"}><p style={{fontSize:"1.5rem"}}>Get Started</p></Link>
                </div>
                 </div>
            <div>
                <img src="/public/mobile.png" alt="Mobile" />
            </div>
           </div>
        </div>
    );
}
