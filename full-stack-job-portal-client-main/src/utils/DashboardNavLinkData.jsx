import React from "react";

import { IoIosStats } from "react-icons/io";
import { RiMenuAddFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

const AdminLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "stats",
    path: "stats",
    icon: <IoIosStats />,
  },
  {
    text: "admin",
    path: "admin",
    icon: <FaUserShield />,
  },
  {
    text: "manage users",
    path: "manage-users",
    icon: <FaUsers />,
  },
];

const RecruiterLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "add job",
    path: "add-jobs",
    icon: <RiMenuAddFill />,
  },
  {
    text: "manage jobs",
    path: "manage-jobs",
    icon: <FaBriefcase />,
  },
  {
    text: "Applications",
    path: "my-jobs",
    icon: <FaBriefcase />,
  },
];

const UserLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "Browse Jobs",
    path: "/all-jobs",
    icon: <RiMenuAddFill />,
  },
  {
    text: "Applications",
    path: "my-jobs",
    icon: <FaBriefcase />,
  },
];

export { AdminLinks, RecruiterLinks, UserLinks };
