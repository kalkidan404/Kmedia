const { prisma } = require("../config/prisma");

const likePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId
                }
            }
        });

        if (existingLike) {
            return res.status(400).json({
                message: "You already liked this post"
            });
        }

        const like = await prisma.like.create({
            data: {
                userId: req.user.id,
                postId
            }
        });

        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const unlikePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);

        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId
                }
            }
        });

        res.json({
            message: "Post unliked"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    likePost,
    unlikePost
};