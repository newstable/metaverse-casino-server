require("dotenv").config();

module.exports = {
    host: "localhost",
    port: 3306,
    user: "atavism",
    database: "master",
    password: "atavism",
    secretOrKey: process.env.TOKEN_SECRET,
};
