import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllHandler, deleteHandler } from "../utils/FetchHandlers";
import { MdWork, MdDelete, MdEdit, MdRefresh } from "react-icons/md";
import { FaEye, FaPlus } from "react-icons/fa";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import Swal from "sweetalert2";

const ManageJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch recruiter's jobs
  const {
    data: jobsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recruiter-jobs", currentPage, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      if (searchTerm) params.append("search", searchTerm);
      return getAllHandler(`/jobs/recruiter-jobs?${params.toString()}`);
    },
    retry: false, // Don't retry on auth failures
    onError: (error) => {
      console.error("Failed to fetch recruiter jobs:", error);
      if (error.response?.status === 401) {
        // Redirect to login if not authenticated
        navigate("/login");
      } else if (error.response?.status === 403) {
        // Show access denied message
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You must be logged in as a recruiter to access this page.",
        });
      }
    },
  });

  // Delete job mutation
  const deleteMutation = useMutation({
    mutationFn: (jobId) => deleteHandler(`/jobs/${jobId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiter-jobs"]);
      Swal.fire({
        icon: "success",
        title: "Job Deleted!",
        text: "Job has been successfully deleted.",
        timer: 3000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error?.response?.data?.message || "Failed to delete job.",
      });
    },
  });

  const handleDelete = (job) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${job.position}" at ${job.company}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(job._id);
      }
    });
  };

  if (isLoading) return <LoadingComTwo />;

  if (isError) {
    const errorStatus = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong!";

    return (
      <Wrapper>
        <div className="error-state">
          <h2>Unable to Load Jobs</h2>
          <p className="error-details">
            {errorStatus === 401 && "Please log in to access this page."}
            {errorStatus === 403 &&
              "You need recruiter permissions to access this page."}
            {errorStatus === 400 &&
              "Bad request - please check your authentication."}
            {!errorStatus && errorMessage}
          </p>
          <div className="error-actions">
            <button onClick={() => refetch()} className="retry-btn">
              <MdRefresh /> Try Again
            </button>
            <Link to="/login" className="login-btn">
              Go to Login
            </Link>
          </div>
        </div>
      </Wrapper>
    );
  }

  const jobs = jobsData?.result || [];
  const pagination = jobsData?.pagination || {};

  return (
    <Wrapper>
      <div className="header">
        <div className="title-section">
          <MdWork className="title-icon" />
          <h1>Manage Jobs</h1>
        </div>
        <Link to="/dashboard/add-jobs" className="add-btn">
          <FaPlus /> Add New Job
        </Link>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => refetch()} className="refresh-btn">
          <MdRefresh />
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <MdWork className="empty-icon" />
          <h3>No Jobs Found</h3>
          <p>You haven't created any jobs yet.</p>
          <Link to="/dashboard/add-jobs" className="create-btn">
            <FaPlus /> Create Your First Job
          </Link>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3>{job.position}</h3>
                  <span className={`status ${job.jobStatus}`}>
                    {job.jobStatus}
                  </span>
                </div>
                <div className="job-info">
                  <p className="company">{job.company}</p>
                  <p className="location">{job.jobLocation}</p>
                  <p className="type">{job.jobType}</p>
                </div>
                <div className="job-stats">
                  <span>Applications: {job.applicationCount || 0}</span>
                  <span>
                    Created: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="job-actions">
                  <Link
                    to={`/job/${job._id}`}
                    className="action-btn view"
                    target="_blank"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/dashboard/edit-job/${job._id}`}
                    className="action-btn edit"
                  >
                    <MdEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(job)}
                    className="action-btn delete"
                    disabled={deleteMutation.isLoading}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title-icon {
    font-size: 2rem;
    color: rgb(54, 55, 245);
  }

  h1 {
    font-size: 2rem;
    color: #333;
    margin: 0;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgb(54, 55, 245);
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .add-btn:hover {
    background: rgb(44, 45, 235);
    transform: translateY(-2px);
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: rgb(54, 55, 245);
  }

  .refresh-btn {
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
    color: #666;
  }

  .refresh-btn:hover {
    border-color: rgb(54, 55, 245);
    color: rgb(54, 55, 245);
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .job-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
  }

  .job-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
    font-weight: 600;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status.pending {
    background: #fef5e7;
    color: #d69e2e;
  }

  .status.interview {
    background: #c6f6d5;
    color: #22543d;
  }

  .status.declined {
    background: #fed7d7;
    color: #742a2a;
  }

  .job-info {
    margin-bottom: 1rem;
  }

  .job-info p {
    margin: 0.25rem 0;
    color: #666;
  }

  .company {
    font-weight: 600;
    color: #333 !important;
  }

  .job-stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .job-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn.view {
    color: #38a169;
  }

  .action-btn.view:hover {
    background: #f0fff4;
    border-color: #38a169;
  }

  .action-btn.edit {
    color: #d69e2e;
  }

  .action-btn.edit:hover {
    background: #fffbf0;
    border-color: #d69e2e;
  }

  .action-btn.delete {
    color: #e53e3e;
  }

  .action-btn.delete:hover {
    background: #fff5f5;
    border-color: #e53e3e;
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .page-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 0.375rem;
    cursor: pointer;
  }

  .page-btn:hover:not(:disabled) {
    background: #f7fafc;
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 500;
    color: #666;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    background: white;
    border-radius: 0.75rem;
    border: 2px dashed #e2e8f0;
  }

  .empty-icon {
    font-size: 4rem;
    color: #cbd5e0;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .create-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgb(54, 55, 245);
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
  }

  .create-btn:hover {
    background: rgb(44, 45, 235);
  }

  .error-state {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 0.75rem;
    border: 2px solid #fed7d7;
  }

  .error-details {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .retry-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
  }

  .retry-btn:hover {
    background: #c53030;
  }

  .login-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgb(54, 55, 245);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
  }

  .login-btn:hover {
    background: rgb(44, 45, 235);
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .jobs-grid {
      grid-template-columns: 1fr;
    }

    .controls {
      flex-direction: column;
    }
  }
`;

export default ManageJobs;
