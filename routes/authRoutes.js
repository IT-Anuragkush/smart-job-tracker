const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const Job = require("../models/Job");

const router = express.Router();


// ======================
// Register Route
// ======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ======================
// Login Route
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    console.log("LOGIN SECRET:", process.env.JWT_SECRET);

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ======================
// Protected Route
// ======================
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

router.put("/profile", authMiddleware, async (req, res) => {
    try {
      const { name, email } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          email,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await Job.deleteMany({
      userId: req.user.id,
    });

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      user.password = hashedPassword;

      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// router.get("/reset-my-password", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash("123456", 10);

//     await User.updateOne(
//       { email: "anuragkush2001@gamil.com" },
//       { password: hashedPassword }
//     );

//     res.json({
//       success: true,
//       message: "Password reset to 123456",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

module.exports = router;