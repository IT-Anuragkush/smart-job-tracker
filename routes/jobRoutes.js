const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);

    const job = await Job.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.user.id,
    });

    const stats = {
      total: jobs.length,
      applied: jobs.filter(job => job.status === "Applied").length,
      interview: jobs.filter(job => job.status === "Interview").length,
      offer: jobs.filter(job => job.status === "Offer").length,
      rejected: jobs.filter(job => job.status === "Rejected").length,
    };

    res.status(200).json({
      success: true,
      stats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, search, sort } = req.query;

    let query = {
      userId: req.user.id,
    };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by companyName or jobTitle
    if (search) {
      query.$or = [
        {
          companyName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          jobTitle: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    let jobsQuery = Job.find(query);

    // Sort
    if (sort === "newest") {
      jobsQuery = jobsQuery.sort("-createdAt");
    } else if (sort === "oldest") {
      jobsQuery = jobsQuery.sort("createdAt");
    }

    const jobs = await jobsQuery;

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;