import React from "react";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";

import Swal from "sweetalert2";
import { getAllHandler, deleteHandler } from "../utils/FetchHandlers";
import { useQuery } from "@tanstack/react-query";

const ManageUsers = () => {
  const { user: me } = useUserContext();
  const {
    isPending,
    isError,
    data: users,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllHandler(`Users`),
  });

  const deleteUserModal = (id) => {
    Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this user? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  const deleteUser = async (id) => {
    try {
      const response = await deleteHandler(`/Users/${id}`);
      refetch();
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted successfully",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to delete user",
        icon: "error",
      });
    }
  };

  if (isPending) {
    return <LoadingComTwo />;
  }
  if (isError) {
    return (
      <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
        Error: {error?.message || "Failed to load users"}
      </h2>
    );
  }

  if (!users || users.length === 0) {
    return (
      <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
        -- User List is Empty --
      </h2>
    );
  }
  return (
    <Wrapper>
      <div className="title-row">
        Manage Users
        <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
      </div>
      <div className="content-row">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              let i = index + 1 < 10 ? `0${index + 1}` : index + 1;
              return (
                <tr key={user._id}>
                  <td>{i}</td>
                  <td>{user?.username}</td>
                  <td>{user?.email}</td>
                  <td>{user?.role}</td>
                  <td className="action-row">
                    {user?._id !== me._id && (
                      <button
                        className="action delete"
                        onClick={() => deleteUserModal(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .title-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: calc(0.9rem + 0.4vw);
    text-transform: capitalize;
    letter-spacing: 1px;
    font-weight: 600;
    opacity: 0.85;
    color: var(--color-black);
    position: relative;
  }
  .title-row:before {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: calc(30px + 0.7vw);
    height: calc(2px + 0.1vw);
    background-color: var(--color-primary);
  }
  .content-row {
    overflow-x: auto;
    margin-top: calc(2rem + 0.5vw);
  }
  .table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  .table thead {
    background-color: var(--color-accent);
    color: var(--color-white);
    font-size: 14px;
    letter-spacing: 1px;
    font-weight: 400;
    text-transform: capitalize;
  }

  .table th,
  .table td {
    text-align: left;
    padding: 12px;
  }

  .table tbody tr {
    font-size: 15px;
    font-weight: 400;
    text-transform: capitalize;
    letter-spacing: 1px;
    transition: all 0.2s linear;
  }

  .table tbody tr:nth-child(even) {
    background-color: #00000011;
  }

  .table .action-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    column-gap: 12px;
  }
  .table .action-row .action {
    font-size: 16px;
    padding: 1px 8px;
    border-radius: 4px;
    color: #fff;
    text-transform: capitalize;
  }
  .action.delete {
    background-color: #dc2626;
    transition: background-color 0.2s ease;
  }
  .action.delete:hover {
    background-color: #b91c1c;
  }
`;

export default ManageUsers;
