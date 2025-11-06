import React from "react";
import styled from "styled-components";

import JobsListCom from "../components/AllJobsPage/JobsListCom";
import SearchAndFilter from "../components/AllJobsPage/SearchAndFilter";

import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllJobsPage/PaginationCom";

const AllJobs = () => {
  return (
    <>
      <Navbar />
      <Wrapper>
        <SearchAndFilter />
        <JobsListCom />
        <PaginationCom />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 80px; /* Account for fixed navbar height */

  @media screen and (max-width: 600px) {
    margin-top: 90px; /* Slightly more space on mobile for larger navbar */
  }
`;
export default AllJobs;
