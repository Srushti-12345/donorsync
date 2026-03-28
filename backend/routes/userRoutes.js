const express = require("express");
const {
  getUsers,
  getUserById,
  updateMyProfile,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.put("/me/profile", protect, updateMyProfile);

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
