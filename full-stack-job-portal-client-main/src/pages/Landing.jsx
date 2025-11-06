import React, { useEffect, useRef } from "react";
import Wrapper from "../assets/css/wrappers/LandingPage";
import { Link } from "react-router-dom";
import heroImage from "../assets/media/ofc_img.jpg";
import Navbar from "../components/shared/Navbar";
import HowWorks from "../components/Home Page/HowWorks";
import Team from "../components/Home Page/Team";
import Brands from "../components/Home Page/Brands";

const Landing = () => {
  const navbarRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const navbarHeight = navbarRef.current.getBoundingClientRect().height;
    heroRef.current.style.minHeight = `calc(100vh - ${navbarHeight}px)`;
  }, []);

  // Connection test removed as server is working properly
  return (
    <>
      <Navbar navbarRef={navbarRef} />
      <Wrapper ref={heroRef}>
        <div className="hero-content">
          <h1>
            Find Your
            <br />
            <span className="fancy">Dream Job</span>
          </h1>
          <div className="hero-image">
            <img
              src={heroImage}
              alt="Office"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                console.error("Failed to load hero image");
              }}
            />
            <div className="hero-overlay">
              <Link className="btn" to="/all-jobs">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </Wrapper>
      <HowWorks />
      <Team />
      <Brands />
    </>
  );
};

export default Landing;
