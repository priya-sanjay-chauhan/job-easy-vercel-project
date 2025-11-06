import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { TfiLocationPin } from "react-icons/tfi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";

import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);

import { useUserContext } from "../../context/UserContext";

import { Link } from "react-router-dom";
import { postHandler } from "../../utils/FetchHandlers";
import Swal from "sweetalert2";

const JobCard = ({ job }) => {
  const date = dayjs(job?.jobDeadline).format("MMM Do, YYYY");
  const { user } = useUserContext();

  const handleApply = async (id) => {
    let currentDate = new Date();
    let date = currentDate.toISOString().slice(0, 10);
    const appliedJob = {
      applicantId: user?._id,
      recruiterId: job?.createdBy,
      jobId: id,
      status: "pending",
      dateOfApplication: date,
      resume: user?.resume || "",
    };
    try {
      const response = await postHandler({
        url: "/application/apply",
        body: appliedJob,
      });
      Swal.fire({
        icon: "success",
        title: "Hurray...",
        text: response?.data?.message,
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.response?.data?.error[0].msg,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error?.response?.data,
        });
      }
    }
  };
  return (
    <Wrapper>
      <div className="card-container">
        <div className="card-header">
          <div className="logo">
            {/* <img src="" alt="" /> */}
            <span>{job.company.charAt(1)}</span>
          </div>
          <div className="right">
            <h2 className="title">{job?.position}</h2>
            <h4 className="company">- {job?.company}</h4>
          </div>
        </div>
        <div className="middle-row">
          <div className="location" title="Last Date">
            <FaRegCalendarAlt className="mr-2 text-lg" />
            <span className="">{date}</span>
          </div>
          <div className="location">
            <TfiLocationPin className="mr-2 text-lg" />
            <span className="">{job?.jobLocation}</span>
          </div>
          <div className="type">
            <BsFillBriefcaseFill className="mr-2 text-lg" />
            <span className="capitalize">{job?.jobType}</span>
          </div>
          <div className="status capitalize">
            <TbTargetArrow className="mr-2 text-lg" />
            <span className={job?.jobStatus}>{job?.jobStatus}</span>
          </div>
        </div>
        <div className="end-row">
          <Link to={`/job/${job._id}`} className="detail-btn">
            details
          </Link>
          {user?.role === "user" && (
            <button className="apply-btn" onClick={() => handleApply(job._id)}>
              Apply
            </button>
          )}
          {user?._id === job?.createdBy && (
            <Link to={`/dashboard/edit-job/${job._id}`} className="detail-btn">
              edit
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .card-container {
    height: 100%;
    background: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 2rem 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .card-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(54, 55, 245, 0.15);
    border-color: rgba(54, 55, 245, 0.2);
  }
  .card-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgb(54, 55, 245), rgb(99, 102, 241));
    border-radius: 16px 16px 0 0;
  }
  .card-container .card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .card-container .logo {
    margin-right: 18px;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgb(54, 55, 245), rgb(99, 102, 241));
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 4px 20px rgba(54, 55, 245, 0.3);
  }
  .right .title {
    text-transform: capitalize;
    font-size: calc(18px + 0.3vw);
    font-weight: 700;
    color: #1f2937;
    line-height: 1.4;
    margin-bottom: 4px;
  }
  .right .company {
    display: inline-block;
    text-transform: capitalize;
    font-size: calc(13px + 0.15vw);
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 0.5px;
  }
  @media screen and (max-width: 550px) {
    .right .title {
      line-height: 18px;
    }
  }

  .middle-row {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: calc(0.6rem + 0.09vw);
    align-items: center;
  }

  .location,
  .type,
  .status {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    color: #4b5563;
    font-weight: 500;
  }

  .status span {
    background: rgba(54, 55, 245, 0.1);
    color: rgb(54, 55, 245);
    padding: 6px 16px;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    border: 1px solid rgba(54, 55, 245, 0.2);
  }
  .status span.pending {
    background: rgba(245, 158, 11, 0.1);
    color: rgb(245, 158, 11);
    border-color: rgba(245, 158, 11, 0.2);
  }
  .status span.declined {
    background: rgba(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
    border-color: rgba(239, 68, 68, 0.2);
  }
  .status span.interview {
    background: rgba(16, 185, 129, 0.1);
    color: rgb(16, 185, 129);
    border-color: rgba(16, 185, 129, 0.2);
  }
  .end-row {
    margin-top: calc(18px + 0.4vw);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .end-row .detail-btn {
    padding: 10px 24px;
    text-transform: capitalize;
    background: transparent;
    color: rgb(54, 55, 245);
    border: 2px solid rgb(54, 55, 245);
    border-radius: 25px;
    letter-spacing: 0.5px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .end-row .detail-btn:hover {
    background: rgb(54, 55, 245);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(54, 55, 245, 0.3);
  }
  .end-row .apply-btn {
    padding: 10px 24px;
    text-transform: capitalize;
    background: linear-gradient(135deg, rgb(54, 55, 245), rgb(99, 102, 241));
    color: white;
    border: 2px solid transparent;
    border-radius: 25px;
    letter-spacing: 0.5px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .end-row .apply-btn:hover {
    background: linear-gradient(135deg, rgb(99, 102, 241), rgb(54, 55, 245));
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(54, 55, 245, 0.4);
  }
`;
export default JobCard;
