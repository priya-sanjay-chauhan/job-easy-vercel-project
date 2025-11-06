import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/media/logo.jpg";
import styled from "styled-components";

const Logo = () => {
  return (
    <Wrapper>
      <Link to="/">
        <img src={logo} alt="Hunter logo" />
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 160px;
  @media screen and (max-width: 600px) {
    max-width: 120px;
  }
  a {
    text-decoration: none;
  }
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default Logo;
