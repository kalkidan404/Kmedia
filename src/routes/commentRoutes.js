const express = require("express");

const {
    createComment,
    getComments,
    updateComment,
    deleteComment
} = require("../controller/commentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/post/:postId", authMiddleware, getComments);
router.post("/post/:postId", authMiddleware, createComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;