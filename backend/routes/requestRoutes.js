const express = require("express");
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  matchDonorToRequest
} = require("../controllers/requestController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, getRequests);
router.get("/:id", protect, getRequestById);
router.post("/", protect, authorize("requester", "admin"), createRequest);
router.put("/:id", protect, authorize("requester", "admin"), updateRequest);
router.delete("/:id", protect, authorize("requester", "admin", "admin"), deleteRequest);
router.patch("/:id/status", protect, authorize("admin", "requester"), updateRequestStatus);
router.patch("/:id/match", protect, authorize("admin"), matchDonorToRequest);

module.exports = router;
