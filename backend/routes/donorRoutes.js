const express = require("express");
const {
  getDonors,
  getMyDonorProfile,
  createDonorProfile,
  updateDonorProfile,
  deleteDonorProfile
} = require("../controllers/donorController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, getDonors);
router.get("/mine", protect, authorize("donor", "admin"), getMyDonorProfile);
router.post("/", protect, authorize("donor", "admin"), createDonorProfile);
router.put("/mine", protect, authorize("donor", "admin"), updateDonorProfile);
router.delete("/mine", protect, authorize("donor", "admin"), deleteDonorProfile);

module.exports = router;
