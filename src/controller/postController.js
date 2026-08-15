const { prisma } = require("../config/prisma");

const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        const post = await prisma.post.create({
            data: {
                content,
                image: image || null,
                authorId: req.user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                },
                comments: true,
                likes: true
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                },
                comments: {
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
                },
                likes: true
            }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                author: true,
                comments: {
                    include: {
                        author: true
                    }
                },
                likes: true
            }
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own posts"
            });
        }

        const { content, image } = req.body;

        const updatedPost = await prisma.post.update({
            where: {
                id: post.id
            },
            data: {
                ...(content !== undefined && { content }),
                ...(image !== undefined && { image })
            }
        });

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await prisma.post.delete({
            where: {
                id: post.id
            }
        });

        res.json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};