const JobModel = require("../Model/JobModel");
const ApplicationModel = require("../Model/ApplicationModel");

const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports.getAllJobs = async (req, res, next) => {
  try {
    const filters = { ...req.query }; // to make a copy so that original don't moidfied

    // exclude
    const excludeFields = ["sort", "page", "limit", "fields", "search"];
    excludeFields.forEach((field) => delete filters[field]);

    const queries = {};

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
    }
    if (req.query.limit) {
      const limit = req.query.limit.split(",").join(" ");
      queries.limit = limit;
    }
    if (req.query.search) {
      const searchQuery = req.query.search;
      filters.$or = [
        {
          company: {
            $regex: new RegExp(".*" + searchQuery + ".*", "i"),
          },
        },
        {
          position: {
            $regex: new RegExp(".*" + searchQuery + ".*", "i"),
          },
        },
        {
          jobStatus: {
            $regex: new RegExp(".*" + searchQuery + ".*", "i"),
          },
        },
        {
          jobType: {
            $regex: new RegExp(".*" + searchQuery + ".*", "i"),
          },
        },
        {
          jobLocation: {
            $regex: new RegExp(".*" + searchQuery + ".*", "i"),
          },
        },
        // Add more fields as needed
      ];
    }
    if (req.query.page) {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 6);
      const skip = (page - 1) * limit;

      queries.skip = skip;
      queries.limit = limit;
      queries.page = page;
    }

    const { result, totalJobs, pageCount, page } = await getData(
      filters,
      queries
    );

    // response
    if (result.length !== 0) {
      res.status(200).json({
        status: true,
        result,
        totalJobs,
        currentPage: page,
        pageCount,
      });
    } else {
      next(createError(500, "Job List is empty"));
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

const getData = async (filters, queries) => {
  let sortCriteria = {};

  if (queries.sortBy) {
    switch (queries.sortBy) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "a-z":
        sortCriteria = { position: 1 };
        break;
      case "z-a":
        sortCriteria = { position: -1 };
        break;
      default:
        // Default sorting criteria if none of the options match
        sortCriteria = { createdAt: -1 };
        break;
    }
  } else {
    // Default sorting criteria if sortBy parameter is not provided
    sortCriteria = { createdAt: -1 };
  }
  const result = await JobModel.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .sort(sortCriteria)
    .select(queries.fields);

  // it not depend on previous one, its document number will be based on filter passing here
  const totalJobs = await JobModel.countDocuments(filters);
  const pageCount = Math.ceil(totalJobs / queries.limit);
  return { result, totalJobs, pageCount, page: queries.page };
};

module.exports.getSingleJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      next(createError(400, "Invalid Job ID format"));
    }
    const result = await JobModel.findById(id);
    if (!result) {
      next(createError(500, "Job not found"));
    } else {
      res.status(200).json({
        status: true,
        result,
      });
    }
  } catch (error) {
    next(createError(500, `something wrong: ${error.message}`));
  }
};

module.exports.addJob = async (req, res, next) => {
  const jobData = req.body;
  try {
    // Log incoming request data
    console.log("Adding new job. User:", req.user?._id);
    console.log("Job data:", jobData);

    if (!req.user || !req.user._id) {
      return next(createError(401, "User not authenticated"));
    }

    // Check if job exists with company and position
    const isJobExists = await JobModel.findOne({
      company: jobData.company,
      position: jobData.position,
    });

    if (isJobExists) {
      return next(
        createError(400, "A job with this company and position already exists")
      );
    }

    // Explicitly set the createdBy field
    jobData.createdBy = req.user._id;

    const newJob = new JobModel(jobData);
    console.log("Created new job model:", newJob);

    const result = await newJob.save();
    console.log("Job saved successfully:", result._id);

    res.status(201).json({
      status: true,
      message: "Job created successfully",
      result,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    next(createError(500, `Failed to create job: ${error.message}`));
  }
};

module.exports.updateSingleJob = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    console.log("=== updateSingleJob called ===");
    console.log("Job ID:", id);
    console.log(
      "User:",
      req.user ? { id: req.user._id, role: req.user.role } : "No user"
    );
    console.log("Update data:", data);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid Job ID format"));
    }

    // Check if job exists and belongs to the current user
    const job = await JobModel.findOne({
      _id: id,
      createdBy: req.user._id,
    });

    if (!job) {
      console.log("Job not found or user doesn't have permission");
      return next(
        createError(
          404,
          "Job not found or you don't have permission to update it"
        )
      );
    }

    console.log("Job found, proceeding with update");
    const updatedJob = await JobModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    console.log("Job updated successfully:", updatedJob._id);
    res.status(200).json({
      status: true,
      message: "Job Updated Successfully",
      result: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    next(createError(500, `Failed to update job: ${error.message}`));
  }
};

module.exports.deleteSingleJob = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid Job ID format"));
    }

    // Check if job exists and belongs to the current user
    const job = await JobModel.findOne({
      _id: id,
      createdBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found or you don't have permission to delete it",
      });
    }

    // Get application count before deletion for response
    const applicationCount = await ApplicationModel.countDocuments({
      jobId: id,
    });

    // Start transaction to ensure data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete associated applications first
      const deletedApplications = await ApplicationModel.deleteMany(
        { jobId: id },
        { session }
      );

      // Delete the job
      const deletedJob = await JobModel.findByIdAndDelete(id, { session });

      await session.commitTransaction();
      session.endSession();

      console.log(`Job deleted: ${job.position} at ${job.company}`);
      console.log(
        `Deleted ${deletedApplications.deletedCount} associated applications`
      );

      res.status(200).json({
        status: true,
        message: `Job deleted successfully${
          applicationCount > 0
            ? ` along with ${applicationCount} applications`
            : ""
        }`,
        data: {
          deletedJob: {
            id: deletedJob._id,
            position: deletedJob.position,
            company: deletedJob.company,
          },
          deletedApplicationsCount: deletedApplications.deletedCount,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error deleting job:", error.message);
    next(createError(500, `Failed to delete job: ${error.message}`));
  }
};

module.exports.deleteAllJobs = async (req, res, next) => {
  try {
    result = await JobModel.deleteMany({});
    res.status(201).json({
      status: true,
      result,
    });
  } catch (error) {
    next(createError(500, `something wrong: ${error.message}`));
  }
};

// Get jobs created by the current recruiter
module.exports.getRecruiterJobs = async (req, res, next) => {
  try {
    console.log("=== getRecruiterJobs called ===");
    console.log(
      "Request user:",
      req.user
        ? {
            id: req.user._id,
            role: req.user.role,
            username: req.user.username,
          }
        : "No user"
    );
    console.log("Query params:", req.query);

    // Safety check for user authentication
    if (!req.user || !req.user._id) {
      console.log("ERROR: No authenticated user found");
      return next(createError(401, "Authentication required"));
    }

    if (req.user.role !== "recruiter") {
      console.log("ERROR: User is not a recruiter, role:", req.user.role);
      return next(createError(403, "Only recruiters can access this endpoint"));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build search filter
    const searchQuery = req.query.search;
    const baseFilter = { createdBy: req.user._id };

    if (searchQuery) {
      baseFilter.$or = [
        { position: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
        { jobLocation: { $regex: searchQuery, $options: "i" } },
        { jobType: { $regex: searchQuery, $options: "i" } },
        { jobStatus: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Add status filter if provided
    if (req.query.status && req.query.status !== "all") {
      baseFilter.jobStatus = req.query.status;
    }

    // Get jobs with application count
    const jobs = await JobModel.aggregate([
      { $match: baseFilter },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          pendingCount: {
            $size: {
              $filter: {
                input: "$applications",
                cond: { $eq: ["$$this.status", "pending"] },
              },
            },
          },
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get total count for pagination
    const totalJobs = await JobModel.countDocuments(baseFilter);
    const totalPages = Math.ceil(totalJobs / limit);

    console.log(
      `Recruiter jobs found: ${jobs.length} out of ${totalJobs} total`
    );

    res.status(200).json({
      status: true,
      result: jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
      message:
        jobs.length === 0 ? "No jobs found" : `Found ${jobs.length} jobs`,
    });
  } catch (error) {
    console.error("Error in getRecruiterJobs:", error.message);
    next(createError(500, `Failed to fetch recruiter jobs: ${error.message}`));
  }
};

// Get job statistics for the current recruiter
module.exports.getRecruiterJobStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await JobModel.aggregate([
      { $match: { createdBy: userId } },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          pendingJobs: {
            $sum: { $cond: [{ $eq: ["$jobStatus", "pending"] }, 1, 0] },
          },
          interviewJobs: {
            $sum: { $cond: [{ $eq: ["$jobStatus", "interview"] }, 1, 0] },
          },
          declinedJobs: {
            $sum: { $cond: [{ $eq: ["$jobStatus", "declined"] }, 1, 0] },
          },
          totalApplications: { $sum: { $size: "$applications" } },
        },
      },
    ]);

    const result =
      stats.length > 0
        ? stats[0]
        : {
            totalJobs: 0,
            pendingJobs: 0,
            interviewJobs: 0,
            declinedJobs: 0,
            totalApplications: 0,
          };

    res.status(200).json({
      status: true,
      result,
    });
  } catch (error) {
    console.error("Error getting recruiter job stats:", error.message);
    next(createError(500, `Failed to get job statistics: ${error.message}`));
  }
};
