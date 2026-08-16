const express = require("express");

const {
    likePost,
    unlikePost
} = require("../controller/likeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/post/:postId", authMiddleware, likePost);
router.delete("/post/:postId", authMiddleware, unlikePost);

module.exports = router;