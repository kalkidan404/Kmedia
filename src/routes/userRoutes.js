const express = require("express");

const {
    getUser,
    getUsers,
    updateUser,
    deleteAccount
} = require("../controller/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUser);
router.get("/all", authMiddleware, getUsers);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;