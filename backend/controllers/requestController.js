const Request = require("../models/Request");
const Donor = require("../models/Donor");

const getRequests = async (req, res) => {
  try {
    let filters = {};

    if (req.user.role === "requester") {
      filters.requester = req.user._id;
    }

    if (req.user.role === "donor") {
      filters.status = { $in: ["Open", "In Progress"] };
    }

    const requests = await Request.find(filters)
      .populate("requester", "name email phone bloodGroup location")
      .populate({
        path: "matchedDonors",
        populate: {
          path: "user",
          select: "name email phone bloodGroup location"
        }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requester", "name email phone bloodGroup location")
      .populate({
        path: "matchedDonors",
        populate: {
          path: "user",
          select: "name email phone bloodGroup location"
        }
      });

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      requester: req.user._id
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const existing = await Request.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Request not found" });

    if (
      req.user.role === "requester" &&
      existing.requester.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update this request" });
    }

    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json({ message: "Request updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const existing = await Request.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Request not found" });

    if (
      req.user.role === "requester" &&
      existing.requester.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to delete this request" });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Status updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const matchDonorToRequest = async (req, res) => {
  try {
    const { donorId } = req.body;

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const alreadyMatched = request.matchedDonors.some(
      (item) => item.toString() === donorId
    );

    if (!alreadyMatched) {
      request.matchedDonors.push(donorId);
      request.status = "In Progress";
      await request.save();
    }

    const updated = await Request.findById(req.params.id).populate({
      path: "matchedDonors",
      populate: {
        path: "user",
        select: "name email phone bloodGroup location"
      }
    });

    res.json({ message: "Donor matched successfully", request: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  matchDonorToRequest
};
