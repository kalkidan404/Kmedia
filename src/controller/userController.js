const { prisma } = require("../config/prisma");

const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                createdAt: true,
                posts: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req.user.id
                }
            },
            select: {
                id: true,
                name: true,
                profileImage: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, profileImage } = req.body;

        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                ...(name && { name }),
                ...(profileImage !== undefined && { profileImage })
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true
            }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.user.id
            }
        });

        res.json({
            message: "Account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getUser,
    getUsers,
    updateUser,
    deleteAccount
};