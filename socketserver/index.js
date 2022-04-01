const { user } = require("../config");
const { getHashPassword } = require("../utils");
const { UserController } = require("../controllers/userControl");
const { rotateValue, calcMatch } = require("./roulette");
const {
  CreateRandomNumber,
  s_calcMatch,
  countCheck,
  levelCheck,
} = require("./slot");
const { GetBallRandom, WinCheck, winMoney } = require("./keno");
const { CreateRandomArray } = require("./mine");

const errorCode = {
  30000: "server error",
  30001: "wrong username",
  30002: "wrong password",
  30003: "invalid name",
  30004: "invalid email",
  40001: "insufficient balance",
  40002: "invalid request",
};

const getErrorCode = (code) => (errorCode[code] ? code : 30000);

var users = {};
const usersPoints = {};

var state = "true";

// roulette datas
const rouletteIds = [0, 1, 2, 3, 4, 5];
var rewardInfos = {
  2: [1, 9, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 2, 47, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 2, 5, 91, 0, 0, 0, 0, 0, 0],
  5: [0, 0, 3, 12, 820, 0, 0, 0, 0, 0],
  6: [0, 0, 3, 4, 70, 1600, 0, 0, 0, 0],
  7: [0, 0, 1, 2, 21, 400, 7000, 0, 0, 0],
  8: [0, 0, 0, 2, 12, 100, 1650, 10000, 0, 0],
  9: [0, 0, 0, 1, 6, 44, 335, 4700, 10000, 0],
  10: [0, 0, 0, 0, 5, 24, 142, 1000, 4500, 10000],
};
var rouletteInfos = {};

const initInfos = () => {
  rouletteIds.map((id) => {
    rouletteInfos[id] = {
      rouletteRoom: [],
      rouletteBetInfos: {},
      NextRound: Date.now() + 30000,
    };
  });
};

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
      await UserController.updatebalance({
        username: user.username,
        coin_current: user.coin_current,
      });
      setTimeout(() => {
        rouletteBetInfos[socket.id] = {};
        rouletteInfos[index].rouletteRoom = [];
        socket.emit("end-roulette", { earnAmount: earnAmount, id: index });
      }, 3000);
    });
    io.emit("end-round-roulette", { spinResult: spinResult, id: index });
    rouletteInfos[index].NextRound = Date.now() + 30000;
  }, 30000);
};

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
  };

  io.on("connection", async (socket) => {
    console.log("socket connected: " + socket.id, totalUser);
    totalUser++;
    socket.on("disconnect", () => {
      totalUser--;
      if (!users[socket.id]) delete users[socket.id];
      console.log("socket disconnected: " + socket.id);
    });

    //auth
    socket.on("login", async (req) => {
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
        if (userData.password !== hashedPassword) throw new Error(30002);
        users[socket.id] = userData;
        socket.emit("loginSuccess");
      } catch (err) {
        console.log("loginError", err.message);
        socket.emit("loginError", getErrorCode(err.message));
      }
    });

    socket.on("signup", async (req) => {
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
          coin_current: 100000,
        });

        if (registryResult) socket.emit("signupSuccess");
        else throw new Error("reqbase");
      } catch (err) {
        console.log(err.message);
        socket.emit("signUpError", getErrorCode(err.message));
      }
    });

    socket.on("roll-dice", async (req) => {
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
          user.coin_current =
            Number(user.coin_current) + (9500 / number - 1) * betAmount;
        } else {
          //lose
          user.coin_current = Number(user.coin_current) - betAmount;
        }
        await UserController.updatebalance({
          username: user.username,
          coin_current: user.coin_current,
        });

        socket.emit("end-dice", {
          result: random,
          coin_current: user.coin_current,
          id: id,
        });
        console.log("bet success");
      } catch (err) {
        var code = getErrorCode(err.message);
        console.log("bet error", err.message, code, errorCode[code]);
        socket.emit("gameError", { code, message: errorCode[code] });
      }
    });

    //roulette
    socket.on("roulette-bet", async (req) => {
      if (state == "true") {
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
          if (
            betAmount + rouletteInfos[id].rouletteBetInfos[socket.id].totalBet >
            user.coin_current
          )
            return;
          await UserController.updatebalance({
            username: user.username,
            coin_current: user.coin_current - betAmount,
          });

          rouletteInfos[id].rouletteBetInfos[socket.id][planeName] =
            rouletteInfos[id].rouletteBetInfos[socket.id][planeName] ??
            0 + betAmount;

          console.log("bet success", {
            planeName: planeName,
            betAmount: betAmount,
          });
          io.emit("new Bet", { planeName: planeName, betAmount: betAmount });
        } catch (err) {
          console.log("roulette bet error");
        }
      }
    });

    socket.on("roulette-nextRound", (req) => {
      try {
        const { id } = req;
        var nextRound = rouletteInfos[id].NextRound - Date.now();
        console.log("nextRound", nextRound);
        socket.emit("roulette-round-start", { nextRound: nextRound });
      } catch (err) {
        console.log("roulette-nextRound", err.message);
      }
    });
    socket.on("stop_bet", (req) => {
      state = req;
    });

    //slotMachine
    socket.on("slotStart", async (req) => {
      try {
        var user = await userMiddleware(socket);
        if (!user) {
          console.log("bet error");
          return;
        }
        const { totalBet, lines, bet, id } = req;
        if (user.coin_current < totalBet) {
          socket.email("S_error_Balance", {});
        } else {
          const { skeletonRandomNum, randomNum } = await CreateRandomNumber();
          var { totalMoney, paylines } = s_calcMatch(
            randomNum,
            skeletonRandomNum,
            parseInt(lines),
            parseInt(bet)
          );
          socket.emit("slot_Front_result", {
            status: true,
            winpaylines: paylines,
            randomNums: skeletonRandomNum,
            moneyResult: totalMoney,
            id: id,
          });
        }
      } catch (err) {
        console.log("slot bet error");
      }
    });

    //Keno
    socket.on("keno_start", async (req) => {
      try {
        const { betValue, ChooseNumbers, ClickNumber, id } = req;
        var user = await userMiddleware(socket);
        if (!user) {
          console.log("bet error");
          return;
        }
        if (user.coin_current < betValue) {
          socket.emit("k_error_Balance", {});
        } else {
          usersPoints[user.username] = {
            RandomArray: [],
            ListArray: [],
            BallRandomNum: [],
            winCount: 0,
            MyWinmoney: 0,
            betBalance: 0,
            Clicknumber: 0,
          };
          let userData = usersPoints[user.username];
          userData.betBalance = betValue;
          userData.Clicknumber = ClickNumber;

          userData.RandomArray = ChooseNumbers.split(",");
          userData.ListArray = rewardInfos[ClickNumber];
          await GetBallRandom(userData);
          await WinCheck(userData);
          await winMoney(userData);
          console.log(userData.BallRandomNum);
          socket.emit("keno_result", {
            BallNumbers: userData.BallRandomNum,
            WinMoney: userData.MyWinmoney,
            Message: "Success",
            id: id,
          });
        }
      } catch (error) {
        console.log("failed:" + error);
      }
    });
    socket.on("k_myBalance", async (req) => {
      const { id } = req;
      var user = await userMiddleware(socket);
      if (!user) {
        console.log("bet error");
        return;
      }
      socket.emit("k_getBalance", { id: id, totalBalance: user.coin_current });
    });
    //Mine
    socket.on("start_Mine", async (req) => {
      try {
        const { betValue, BombNumber, state, id } = req;
        var user = await userMiddleware(socket);
        if (!user) {
          console.log("bet error");
          return;
        }
        if (user.coin_current < betValue) {
          socket.emit("error_Balance", {});
        } else {
          await UserController.updatebalance({
            username: user.username,
            coin_current: user.coin_current - betValue,
          });
          usersPoints[id] = {
            userName: {},
          };
          usersPoints[id].userName[user.username] = {
            betAmount: betValue,
            randomArray: [],
            nextTileProfitCross: 0.95 / ((25 - BombNumber) / 25),
            totalProfitCross: 0,
            gemNum: 25 - BombNumber,
            mineNum: BombNumber,
            isBetting: state,
            positionInfo: [],
            gameId: id,
          };
          let userData = usersPoints[id].userName[user.username];
          userData.randomArray = await CreateRandomArray(userData.mineNum);
          socket.emit("mine position", {
            mineNum: userData.mineNum,
            gemNum: userData.gemNum,
            nextTileProfitAmount:
              (userData.betAmount * 0.95) / ((25 - userData.mineNum) / 25),
            totalProfitAmount: 0,
            nextTileProfitCross: 0.95 / ((25 - userData.mineNum) / 25),
            totalProfitCross: 0,
            canCashOut: false,
            id: userData.gameId,
          });
        }
      } catch (error) {
        console.log("Mine_error:" + error);
      }
    });
    socket.on("card_click", async (req) => {
      const { clicked_Card, id } = req;
      var user = await userMiddleware(socket);
      if (!user) {
        console.log("bet error");
        return;
      }
      let userData = usersPoints[id].userName[user.username];
      if (userData.isBetting) {
        if (userData.gemNum == 1) {
          if (userData.randomArray[clicked_Card] == 0) {
            userData.totalProfitCross = userData.nextTileProfitCross;
            userData.nextTileProfitCross /=
              userData.gemNum / (userData.gemNum + userData.mineNum);
            socket.emit("end_cash_Out", {
              click_Cash: true,
              id: userData.gameId,
            });
          } else {
            userData.isBetting = false;
            socket.emit("card result", {
              isBetting: userData.isBetting,
              canCashOut: false,
              posIndex: req.posIndex,
              randomArray: userData.randomArray,
              amount: userData.amount,
              id: id,
            });
          }
        } else {
          if (userData.randomArray[clicked_Card] == 0) {
            userData.gemNum--;
            userData.totalProfitCross = userData.nextTileProfitCross;
            userData.nextTileProfitCross /=
              userData.gemNum / (userData.gemNum + userData.mineNum);

            socket.emit("card result", {
              isBetting: true,
              canCashOut: true,
              nextTileProfitAmount:
                userData.betAmount * userData.nextTileProfitCross,
              totalProfitAmount: userData.totalProfitCross * userData.betAmount,
              nextTileProfitCross: userData.nextTileProfitCross,
              totalProfitCross: userData.totalProfitCross,
              posIndex: clicked_Card,
              id: id,
            });
          } else if (userData.randomArray[clicked_Card] == 1) {
            userData.isBetting = false;
            socket.emit("card result", {
              isBetting: userData.isBetting,
              canCashOut: false,
              posIndex: req.posIndex,
              randomArray: userData.randomArray,
              amount: userData.amount,
              id: id,
            });
          }
        }
      }
    });
    socket.on("cash_Out", async (req) => {
      const { click_Cash, id } = req;
      try {
        var user = await userMiddleware(socket);
        if (!user) {
          console.log("bet error");
          return;
        }
        let userData = usersPoints[id].userName[user.username];
        await UserController.updatebalance({
          username: user.username,
          coin_current:
            user.coin_current + userData.totalProfitCross * userData.betAmount,
        });

        socket.emit("game result", {
          isBetting: false,
          randomArray: userData.randomArray,
          gameResult: true,
          totalProfitAmount: userData.totalProfitCross * userData.betAmount,
          totalProfitCross: userData.totalProfitCross,
          id: id,
        });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("m_myBalance", async (req) => {
      const { id } = req;
      var user = await userMiddleware(socket);
      if (!user) {
        console.log("bet error");
        return;
      }
      socket.emit("m_getBalance", { id: id, totalBalance: user.coin_current });
    });
  });
};
module.exports = { listen };
