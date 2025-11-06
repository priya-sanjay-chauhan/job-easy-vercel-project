import React from "react";
import { useJobContext } from "../../context/JobContext";
import LoadingComTwo from "../shared/LoadingComTwo";
import styled from "styled-components";
import JobCard from "./JobCard";

const JobsListCom = () => {
  const { jobLoading, jobs } = useJobContext();

  if (jobLoading) {
    return <LoadingComTwo />;
  }

  if (!jobs?.result?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Jobs Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We couldn't find any jobs matching your criteria. Try adjusting your
            filters or check back later for new opportunities.
          </p>
        </div>
      </div>
    );
  }
  return (
    <Wrapper>
      <h5 className="job-count">
        Shows
        <span className="fancy">
          {jobs?.result?.length < 10
            ? `0${jobs?.result?.length}`
            : jobs?.result?.length}
        </span>
        of total
        <span className="fancy">
          {jobs?.totalJobs < 10 ? `0${jobs?.totalJobs}` : jobs?.totalJobs}
        </span>
        Jobs
      </h5>

      <div className="list-container">
        {jobs?.result?.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  width: 100%;
  margin-top: 1.5rem;
  padding: 2rem;
  border-radius: 20px;
  min-height: 400px;

  .job-count {
    margin-bottom: 2rem;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
    padding: 1rem 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(54, 55, 245, 0.1);
  }
  .job-count .fancy {
    color: rgb(54, 55, 245);
    margin: 0 8px;
    font-size: 18px;
    font-weight: 700;
  }

  .list-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    justify-content: center;
    align-items: start;
    grid-gap: 2rem;
    padding: 1rem 0;
  }

  @media (max-width: 1200px) {
    .list-container {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      grid-gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .job-count {
      margin-bottom: 1.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 14px;
    }

    .job-count .fancy {
      font-size: 16px;
      margin: 0 6px;
    }

    .list-container {
      grid-template-columns: 1fr;
      grid-gap: 1.5rem;
      padding: 0;
    }
  }
`;

export default JobsListCom;
