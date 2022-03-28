const express = require("express");
const router = express.Router();
const User = require("./api_user");
const { userMiddleware } = require("../middleware");

module.exports = (router) => {
    // User API
    router.post("/registry", User.registry);
    // router.post("/login", userMiddleware, User.Login);
    router.post("/login", User.Login);
    router.post("/checkuser", User.Check);
};
