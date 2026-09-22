const express = require("express");

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require("../controller/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPost);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;