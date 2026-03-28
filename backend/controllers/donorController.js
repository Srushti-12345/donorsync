const Donor = require("../models/Donor");
const User = require("../models/User");

const getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, available } = req.query;
    const userFilters = { role: "donor" };

    if (bloodGroup) userFilters.bloodGroup = bloodGroup;
    if (available !== undefined) userFilters.isAvailable = available === "true";

    const donorUsers = await User.find(userFilters).select("-password");
    const donorIds = donorUsers.map((user) => user._id);

    const donorFilters = { user: { $in: donorIds } };
    if (city) donorFilters.city = city;

    const donors = await Donor.find(donorFilters)
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id }).populate(
      "user",
      "-password"
    );

    if (!donor) return res.status(404).json({ message: "Donor profile not found" });

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDonorProfile = async (req, res) => {
  try {
    const existing = await Donor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Donor profile already exists" });
    }

    const donor = await Donor.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate({ user: req.user._id }, req.body, {
      new: true
    }).populate("user", "-password");

    if (!donor) return res.status(404).json({ message: "Donor profile not found" });

    res.json({ message: "Donor profile updated", donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({ user: req.user._id });
    if (!donor) return res.status(404).json({ message: "Donor profile not found" });

    await User.findByIdAndUpdate(req.user._id, { role: "requester" });

    res.json({ message: "Donor profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDonors,
  getMyDonorProfile,
  createDonorProfile,
  updateDonorProfile,
  deleteDonorProfile
};
