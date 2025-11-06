import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1250px;
  margin: 80px auto 0;
  padding: calc(1.5rem + 1.5vh) calc(1.2rem + 1.75vw) 0;
  margin-bottom: -4px; /* Remove any potential gap */

  .hero-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }

  .hero-image {
    position: relative;
    width: 100%;
    max-width: 1400px;
    height: 750px;
    border-radius: 15px 15px 0 0;
    margin-bottom: 0;
    overflow: hidden;
    align-self: center;
    background-color: #f3f4f6;
  }

  .hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-font-smoothing: subpixel-antialiased;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: calc(2.5rem + 1.75vw);
    font-weight: 800;
    letter-spacing: 2px;
    color: #1f2937;
    text-align: left;
    margin-left: calc(2rem + 1.75vw);
    line-height: 1;
  }

  h1 .fancy {
    display: inline-block;
    margin-top: 0.1em;
  }

  h1 .fancy {
    color: rgb(54, 55, 245);
  }

  .btn {
    text-decoration: none;
    text-transform: capitalize;
    font-weight: 500;
    font-size: calc(1.1rem + 0.2vw);
    color: var(--color-white);
    background-color: rgb(54, 55, 245);
    border: 2px solid rgb(54, 55, 245);
    padding: calc(8px + 0.15vw) calc(24px + 0.3vw);
    border-radius: 30px;
    transition: all 0.3s ease-in;
  }

  .btn:hover {
    background-color: transparent;
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media screen and (max-width: 768px) {
    .hero-image {
      height: 500px;
    }

    h1 {
      font-size: calc(1.5rem + 1.75vw);
      padding: 0 1rem;
    }

    .btn {
      font-size: 1rem;
      padding: 8px 20px;
    }
  }
`;

export default Wrapper;
