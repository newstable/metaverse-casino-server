const rand = require("random-seed").create();

const GetBallRandom = async (userData) => {
  for (var i = 0; i < 20; ) {
    var rNum = rand.intBetween(1, 80);
    if (userData.BallRandomNum.indexOf(rNum) !== -1) {
      continue;
    }
    userData.BallRandomNum[i] = rNum;
    i++;
  }
};

const WinCheck = async (userData) => {
  for (var i = 0; i < userData.Clicknumber; i++) {
    var num = userData.RandomArray[i] * 1;
    if (userData.BallRandomNum.indexOf(num) !== -1) {
      userData.winCount++;
    }
  }
};

const winMoney = async (userData) => {
  userData.MyWinmoney =
    userData.betBalance * userData.ListArray[userData.winCount - 1];
};

module.exports = { GetBallRandom, WinCheck, winMoney };
