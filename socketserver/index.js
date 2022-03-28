const { user } = require("../config");
const { getHashPassword } = require("../utils");
const { UserController } = require("../controllers/userControl");
const { rotateValue, calcMatch } = require("./roulette");

const errorCode = {
    30000: "server error",
    30001: "wrong username",
    30002: "wrong password",
    30003: "invalid name",
    30004: "invalid email",
    40001: "insufficient balance",
    40002: "invalid request"
}

const getErrorCode = (code) => errorCode[code] ? code : 30000;

var users = {};

// roulette datas
const rouletteIds = [
    0, 1, 2, 3, 4, 5
]
var rouletteInfos = {}

const initInfos = () => {
    rouletteIds.map((id) => {
        rouletteInfos[id] = {
            rouletteRoom: [],
            rouletteBetInfos: {},
            NextRound: Date.now() + 30000
        }
    });
}

const RouletteRound = (io, index) => {
    setInterval(() => {
        var players = rouletteInfos[index].rouletteRoom;
        var rouletteBetInfos = rouletteInfos[index].rouletteBetInfos;
        var spinResult = rotateValue();
        players.map(async (socket) => {
            var user = users[socket.id];
            if (!user) return;
            var earnAmount = calcMatch(rouletteBetInfos[socket.id], spinResult);
            user.coin_current = Number(user.coin_current) + earnAmount;
            await UserController.updatebalance({ username: user.username, coin_current: user.coin_current });
            setTimeout(() => {
                rouletteBetInfos[socket.id] = {};
                rouletteInfos[index].rouletteRoom = [];
                console.log("earnAmount", earnAmount);
                socket.emit("end-roulette", { earnAmount: earnAmount, id: index });
            }, 3000);
        });
        io.emit("end-round-roulette", { spinResult: spinResult, id: index });
        rouletteInfos[index].NextRound = Date.now() + 30000;
    }, 30000);
}

const listen = (io) => {
    var totalUser = 0;
    initInfos();

    // roulette rounds
    rouletteIds.map((id) => {
        RouletteRound(io, id);
    });

    const userMiddleware = async (socket, req) => {
        if (!users[socket.id]) {
            socket.emit("authError");
            return null;
        }

        const Result = await UserController.findUser({
            param: users[socket.id].username,
            flag: 2,
        });
        users[socket.id] = Result[0];
        return users[socket.id];
    }

    io.on("connection", async (socket) => {
        console.log('socket connected: ' + socket.id, totalUser);
        totalUser++;
        socket.on('disconnect', () => {
            totalUser--;
            if (!users[socket.id])
                delete users[socket.id];
            console.log('socket disconnected: ' + socket.id);
        });

        //auth
        socket.on('login', async (req) => {
            try {
                const { username, password } = req;
                console.log("login", username, password, req);
                const Result = await UserController.findUser({
                    param: username,
                    flag: 2,
                });
                if (Result.length === 0) {
                    throw new Error(30001);
                }
                const userData = Result[0];
                const hashedPassword = await getHashPassword({
                    param1: username,
                    param2: password,
                });
                if (userData.password !== hashedPassword)
                    throw new Error(30002);
                users[socket.id] = userData;
                socket.emit('loginSuccess');
            } catch (err) {
                console.log("loginError", err.message);
                socket.emit('loginError', getErrorCode(err.message))
            }
        });

        socket.on('signup', async (req) => {
            try {
                const { username, email, password } = req;

                const emailResult = await UserController.findUser({
                    param: email,
                    flag: 1,
                });
                if (emailResult.length !== 0) throw new Error(30004);

                const nameResult = await UserController.findUser({
                    param: username,
                    flag: 2,
                });
                if (nameResult.length !== 0) throw new Error(30005);

                const hashedPassword = await getHashPassword({
                    param1: username,
                    param2: password,
                });

                const registryResult = await UserController.createUser({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    coin_current: 100000
                });

                if (registryResult)
                    socket.emit('signupSuccess');
                else throw new Error("reqbase");
            } catch (err) {
                console.log(err.message);
                socket.emit('signUpError', getErrorCode(err.message))
            }
        });

        socket.on('roll-dice', async (req) => {
            try {
                var user = await userMiddleware(socket);
                if (!user) {
                    console.log("bet error");
                    return;
                }
                const { betAmount, number, id } = req;
                if (Number(user.coin_current) < Number(betAmount)) {
                    throw new Error(40001);
                }
                if (number < 1 || number > 9500) throw new Error(40002);

                var random = Math.floor(Math.random() * 10000);
                console.log(random);
                if (random <= number) {
                    //win
                    user.coin_current = Number(user.coin_current) + (9500 / number - 1) * betAmount;
                }
                else {
                    //lose
                    user.coin_current = Number(user.coin_current) - betAmount;
                }
                await UserController.updatebalance({ username: user.username, coin_current: user.coin_current });

                socket.emit("end-dice", { result: random, coin_current: user.coin_current, id: id });
                console.log("bet success");
            }
            catch (err) {
                var code = getErrorCode(err.message);
                console.log("bet error", err.message, code, errorCode[code]);
                socket.emit('gameError', { code, message: errorCode[code] })
            }
        });

        //roulette
        socket.on('roulette-bet', async (req) => {
            try {
                var user = await userMiddleware(socket);
                if (!user) {
                    console.log("bet error");
                    return;
                }
                const { planeName, betAmount, id } = req;
                if (!rouletteInfos[id].rouletteRoom.includes(socket)) {
                    rouletteInfos[id].rouletteRoom.push(socket);
                    rouletteInfos[id].rouletteBetInfos[socket.id] = {};
                }
                if (betAmount + rouletteInfos[id].rouletteBetInfos[socket.id].totalBet > user.coin_current) return;
                await UserController.updatebalance({ username: user.username, coin_current: user.coin_current - betAmount });

                rouletteInfos[id].rouletteBetInfos[socket.id][planeName] = rouletteInfos[id].rouletteBetInfos[socket.id][planeName] ?? 0 + betAmount;

                console.log("bet success", { planeName: planeName, betAmount: betAmount });
                io.emit("new Bet", { planeName: planeName, betAmount: betAmount });
            } catch (err) {
                console.log("roulette bet error");
            }
        });

        socket.on("roulette-nextRound", (req) => {
            try {
                const { id } = req;
                var nextRound = rouletteInfos[id].NextRound - Date.now();
                console.log("nextRound", nextRound);
                socket.emit("roulette-round-start", { nextRound: nextRound });
            } catch (err) {
                console.log("roulette-nextRound", err.message)
            }
        })
    })
}

module.exports = { listen }