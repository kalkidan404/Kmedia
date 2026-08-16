const { prisma } = require("../config/prisma");

const createComment = async (req, res) => {
    try {
        const { content } = req.body;

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: req.user.id,
                postId: Number(req.params.postId)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: Number(req.params.postId)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.authorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own comments"
            });
        }

        const updatedComment = await prisma.comment.update({
            where: {
                id: comment.id
            },
            data: {
                content: req.body.content
            }
        });

        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.authorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }

        await prisma.comment.delete({
            where: {
                id: comment.id
            }
        });

        res.json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};