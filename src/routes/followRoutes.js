const express = require("express");

const {
    sendFollowRequest,
    respondToFollowRequest,
    getFollowRequests
} = require("../controller/followController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:userId", authMiddleware, sendFollowRequest);
router.get("/requests", authMiddleware, getFollowRequests);
router.put("/requests/:id", authMiddleware, respondToFollowRequest);

module.exports = router;