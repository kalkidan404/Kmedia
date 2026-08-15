const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const followRoutes = require("./src/routes/followRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);
app.use("/follows", followRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Rmedia API is running"
    });
});

module.exports = app;