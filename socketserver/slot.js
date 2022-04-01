const rand = require("random-seed").create();
require("dotenv").config();

// Users List
const usersPoints = {};

const CreateRandomNumber = async () => {
  var randomNum = new Array();
  var skeletonRandomNum = new Array();
  for (var i = 0; i < 15; i++) {
    var rNum = rand.intBetween(1, 11);
    randomNum[i] = rNum;
  }
  for (var i = 0; i < 15; i++) {
    skeletonRandomNum[i] = randomNum[i] * -1;
  }
  return { skeletonRandomNum, randomNum };
};

const s_calcMatch = (randomNum, skeletonRandomNum, lines, betAmount) => {
  var totalMoney = 0;
  var paylines = new Array();
  try {
    for (var i = 1; i <= lines; i++) {
      var NumberStack = [];
      var money = 0;
      switch (i) {
        case 1:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 2:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 3:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 4:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 5:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 6:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 7:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 8:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 9:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 10:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[5] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 11:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 12:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 13:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 14:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 15:
          NumberStack.push(randomNum[9]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[5]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[9] = randomNum[9];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[5] = randomNum[5];
            paylines.push(i);
          }
          break;
        case 16:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 17:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[8]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[6]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[8] = randomNum[8];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[6] = randomNum[6];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 18:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 19:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 20:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 21:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 22:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[12]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[12] = randomNum[12];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 23:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[13]);
          NumberStack.push(randomNum[2]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[14] = randomNum[14];
            skeletonRandomNum[13] = randomNum[13];
            skeletonRandomNum[2] = randomNum[2];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
        case 24:
          NumberStack.push(randomNum[4]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[11]);
          NumberStack.push(randomNum[0]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[11] = randomNum[11];
            skeletonRandomNum[0] = randomNum[0];
            paylines.push(i);
          }
          break;
        case 25:
          NumberStack.push(randomNum[14]);
          NumberStack.push(randomNum[3]);
          NumberStack.push(randomNum[7]);
          NumberStack.push(randomNum[1]);
          NumberStack.push(randomNum[10]);
          money = countCheck(NumberStack, betAmount);
          if (money > 0) {
            skeletonRandomNum[4] = randomNum[4];
            skeletonRandomNum[3] = randomNum[3];
            skeletonRandomNum[7] = randomNum[7];
            skeletonRandomNum[1] = randomNum[1];
            skeletonRandomNum[10] = randomNum[10];
            paylines.push(i);
          }
          break;
      }
      totalMoney += money;
    }
  } catch (error) {
    console.log("s_calcuMatch:" + error);
  }
  return { totalMoney, paylines };
};

const countCheck = (NumberStack, betAmount) => {
  try {
    var setNum = 0;
    for (var i = 0; i < NumberStack.length; i++) {
      var bump = NumberStack[i];
      var count = 0;
      for (var j = 0; j < NumberStack.length; j++) {
        if (bump === NumberStack[j] || Math.abs(bump) === 11) {
          count++;
        }
      }
      if (count >= 3) {
        setNum = NumberStack[i];
        break;
      }
    }

    return levelCheck(setNum, count, betAmount);
  } catch (error) {
    console.log("error:" + error);
  }
};

const levelCheck = (number, count, betAmount) => {
  try {
    var money = 0;
    switch (number) {
      case 1:
        if (count === 3) money = 50 * betAmount;
        if (count === 4) money = 400 * betAmount;
        if (count === 5) money = 4000 * betAmount;
        break;
      case 2:
        if (count === 3) money = 40 * betAmount;
        if (count === 4) money = 200 * betAmount;
        if (count === 5) money = 2000 * betAmount;
        break;
      case 3:
        if (count === 3) money = 30 * betAmount;
        if (count === 4) money = 150 * betAmount;
        if (count === 5) money = 500 * betAmount;
        break;
      case 4:
        if (count === 3) money = 20 * betAmount;
        if (count === 400) money = 100 * betAmount;
        if (count === 5) money = 400 * betAmount;
        break;
      case 5:
      case 6:
        if (count === 3) money = 15 * betAmount;
        if (count === 400) money = 75 * betAmount;
        if (count === 5) money = 300 * betAmount;
        break;
      case 7:
      case 8:
        if (count === 3) money = 10 * betAmount;
        if (count === 400) money = 50 * betAmount;
        if (count === 5) money = 250 * betAmount;
        break;
      case 9:
      case 10:
        if (count === 3) money = 5 * betAmount;
        if (count === 400) money = 25 * betAmount;
        if (count === 5) money = 200 * betAmount;
        break;
      default:
        break;
    }
    return money;
  } catch {
    console.log("error here");
  }
};
module.exports = { CreateRandomNumber, s_calcMatch, countCheck, levelCheck };

// module.exports = {
//   StartSignal: async (req, res) => {
//     try {
//       const { token, totalBet, betValue, betLine } = req.body;

//       console.log("token: ", token);

//       let user = usersPoints[token];
//       if (user === undefined) {
//         usersPoints[token] = {
//           totalMoney: 0,
//           randomNum: [],
//           skeletonRandomNum: [],
//           paylines: [],
//           betBalance: 0,
//         };
//         user = usersPoints[token];
//       }
//       user.betBalance = betValue;

//       await CreateRandomNumber(user);
//       await calcMatch(user, parseInt(betLine));

//       try {
//         await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
//           token: token,
//           amount: totalBet,
//         });

//         await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
//           token: token,
//           amount: user.totalMoney,
//           winState: user.totalMoney ? true : false,
//         });
//       } catch (err) {
//         console.log(err);
//         res.json({
//           status: false,
//         });
//       }

//       res.json({
//         status: true,
//         winpaylines: user.paylines,
//         randomNums: user.skeletonRandomNum,
//         moneyResult: user.totalMoney,
//       });

//       user.totalMoney = 0;
//       user.paylines = [];
//       user.betBalance = 0;
//     } catch (err) {
//       console.log(err);
//       res.json({
//         status: false,
//       });
//     }
//   },
// };
