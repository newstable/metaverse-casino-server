const sha256 = require("sha256");

const getHashPassword = async (req) => {
    const { param1, param2 } = req;

    return sha256.x2(param1 + param2);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    getHashPassword,
    delay
};
