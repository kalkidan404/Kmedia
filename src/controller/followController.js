const { prisma } = require("../config/prisma");

const sendFollowRequest = async (req, res) => {
    try {
        const receiverId = Number(req.params.userId);

        if (receiverId === req.user.id) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const existingRequest = await prisma.followRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: req.user.id,
                    receiverId
                }
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Follow request already exists"
            });
        }

        const request = await prisma.followRequest.create({
            data: {
                senderId: req.user.id,
                receiverId
            }
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const respondToFollowRequest = async (req, res) => {
    try {
        const request = await prisma.followRequest.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!request) {
            return res.status(404).json({
                message: "Follow request not found"
            });
        }

        if (request.receiverId !== req.user.id) {
            return res.status(403).json({
                message: "You cannot respond to this request"
            });
        }

        const { status } = req.body;

        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const updatedRequest = await prisma.followRequest.update({
            where: {
                id: request.id
            },
            data: {
                status
            }
        });

        if (status === "ACCEPTED") {
            await prisma.follow.create({
                data: {
                    followerId: request.senderId,
                    followedId: request.receiverId
                }
            });
        }

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getFollowRequests = async (req, res) => {
    try {
        const requests = await prisma.followRequest.findMany({
            where: {
                receiverId: req.user.id,
                status: "PENDING"
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            }
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    sendFollowRequest,
    respondToFollowRequest,
    getFollowRequests
};