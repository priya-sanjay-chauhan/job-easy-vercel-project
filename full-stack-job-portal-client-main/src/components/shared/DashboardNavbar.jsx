import styled from "styled-components";
import { BiMenuAltLeft } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import Logo from "../Logo";
import { useDashboardContext } from "../../Layout/DashboardLayout";

const DashboardNavbar = () => {
  const { showSidebar, setShowSidebar, handleLogout } = useDashboardContext();
  return (
    <Wrapper>
      <div className="nav-container">
        <div className="start">
          <button
            className="toggler"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <BiMenuAltLeft className="icon" />
          </button>
        </div>
        <div className="center">
          <Logo />
        </div>
        <div className="end">
          <button className="logout" onClick={handleLogout}>
            <FiLogOut className="text-lg mr-1" /> logout
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem calc(1.5rem + 0.7vw);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-container {
    width: 100%;
    max-width: 1400px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .start .toggler {
    font-weight: 900;
    font-size: 28px;
    color: rgb(54, 55, 245);
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    width: max-content;
    padding: 3px;
    transition: all 0.3s linear;
  }

  .start .toggler:hover {
    background-color: rgb(54, 55, 245);
    color: var(--color-white);
  }

  .end .logout {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    color: rgb(54, 55, 245);
    letter-spacing: 0.5px;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.3s linear;
  }

  .end .logout:hover {
    background-color: rgb(54, 55, 245);
    color: var(--color-white);
  }

  @media (min-width: 992px) {
    position: sticky;
    top: 0;

    /* .nav-container {
            padding: 0 calc(1rem + 0.7vw);
        } */
  }
`;

export default DashboardNavbar;
