const express = require("express");
const JobRouter = express.Router(); // create a router

// Controllers
const JobController = require("../Controller/JobController");
const { checkJobInput } = require("../Validation/JobDataRules");
const {
  inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

const {
  userAuthorizationHandler,
} = require("./../Middleware/UserAuthorizationMiddleware");
const {
  authenticateUser,
} = require("./../Middleware/UserAuthenticationMiddleware");

// Routes
JobRouter.route("/")
  .get(JobController.getAllJobs)
  .post(
    authenticateUser,
    userAuthorizationHandler("recruiter"),
    checkJobInput,
    inputValidationMiddleware,
    JobController.addJob
  )
  .delete(JobController.deleteAllJobs);

// Routes for recruiter job management
JobRouter.get(
  "/recruiter-jobs",
  authenticateUser,
  userAuthorizationHandler("recruiter"),
  JobController.getRecruiterJobs
);

JobRouter.get(
  "/recruiter-stats",
  authenticateUser,
  userAuthorizationHandler("recruiter"),
  JobController.getRecruiterJobStats
);

JobRouter.route("/:id")
  .get(JobController.getSingleJob)
  .patch(
    authenticateUser,
    userAuthorizationHandler("recruiter"),
    checkJobInput,
    inputValidationMiddleware,
    JobController.updateSingleJob
  )
  .delete(
    authenticateUser,
    userAuthorizationHandler("recruiter"),
    JobController.deleteSingleJob
  );

module.exports = JobRouter;

// Extra----------------------------
// JobRouter.get("/", JobController.getAllJobs); //Get all jobs
// JobRouter.post("/", JobController.addJob); //Add all jobs
// JobRouter.get("/:id", JobController.getSingleJob); //Get Single all jobs
