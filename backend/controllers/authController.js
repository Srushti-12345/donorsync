const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Donor = require("../models/Donor");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      bloodGroup,
      location,
      role,
      age,
      gender,
      city,
      state
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodGroup,
      location,
      role
    });

    if (role === "donor") {
      await Donor.create({
        user: user._id,
        age,
        gender,
        city: city || location,
        state: state || "Not specified"
      });
    }

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        location: user.location,
        role: user.role,
        isAvailable: user.isAvailable
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const donorProfile =
      req.user.role === "donor"
        ? await Donor.findOne({ user: req.user._id })
        : null;

    res.json({
      user: req.user,
      donorProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { signup, login, getMe };
