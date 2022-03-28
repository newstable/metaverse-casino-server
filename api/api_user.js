require("dotenv").config;
const jwt = require("jsonwebtoken");
const { getHashPassword } = require("../utils");
const { UserController } = require("../controllers/userControl");
const config = require("../config");

module.exports = {
    registry: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const emailResult = await UserController.findUser({
                param: email,
                flag: 1,
            });
            if (emailResult.length !== 0) throw new Error("email");

            const nameResult = await UserController.findUser({
                param: name,
                flag: 2,
            });
            if (nameResult.length !== 0) throw new Error("name");

            const hashedPassword = await getHashPassword({
                param1: name,
                param2: password,
            });

            const registryResult = await UserController.createUser({
                name: name,
                password: hashedPassword,
                email: email,
            });

            if (registryResult)
                res.status(200).json({ success: true, msg: "Congratulation" });
            else throw new Error("database");
        } catch (err) {
            console.log(err.message);
            switch (err.message) {
                case "email":
                    res.json({
                        success: false,
                        msg: "email already exist",
                    });
                    break;
                case "name":
                    res.json({
                        success: false,
                        msg: "name already exist",
                    });
                    break;
                case "database":
                    res.json({
                        success: false,
                        msg: "Database Error",
                    });
                default:
                    res.json({
                        success: false,
                        msg: "Operation Error",
                    });
                    break;
            }
        }
    },
    Login: async (req, res) => {
        try {
            const { name, password } = req.body;

            const Result = await UserController.findUser({
                param: name,
                flag: 2,
            });

            if (Result.length === 0) {
                throw new Error("name");
            } else {
                const hashedPassword = await getHashPassword({
                    param1: name,
                    param2: password,
                });
                if (Result[0].password !== hashedPassword)
                    throw new Error("pass");
            }

            const resDoc = Result[0];

            const token = jwt.sign(resDoc, config.secretOrKey, {
                expiresIn: "144h",
            });

            res.json({
                success: true,
                token: token,
            });
        } catch (err) {
            console.log(err.message);
            switch (err.message) {
                case "name":
                    res.json({
                        success: false,
                        msg: "account not exist",
                    });
                    break;
                case "pass":
                    res.json({
                        success: false,
                        msg: "password is wrong",
                    });
                default:
                    res.json({
                        success: false,
                        msg: "Operation Error",
                    });
            }
        }
    },
    Check: async (req, res) => {
        try {
            const { user, password } = req.body;
            console.log(user,password,req.body)

            const Result = await UserController.findUser({
                param: user,
                flag: 2,
            });

            if (Result.length === 0) {
                throw new Error("name");
            } else {
                const hashedPassword = await getHashPassword({
                    param1: user,
                    param2: password,
                });
                if (Result[0].password !== hashedPassword) {
                    throw new Error("pass");
                }
            }

            const userID = Result[0].id;
            res.send(String(userID));
        } catch (err) {
            console.log(err.message);
            switch (err.message) {
                case "name":
                case "pass":
                    res.send("-1");
                    break;
                default:
                    res.send("-1");
                    break;
            }
        }
    },
};
