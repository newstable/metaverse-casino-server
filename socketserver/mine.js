const rand = require("random-seed").create();

const CreateRandomArray = (mineNum) => {
  var minePosition = [];
  var randomArray = [];
  for (var i = 0; i < mineNum; ) {
    var random_Num = getRandomInt(25);
    if (minePosition.indexOf(random_Num) != -1) {
      continue;
    } else {
      minePosition.push(random_Num);
      i++;
    }
  }
  for (var i = 0; i < 25; i++) {
    randomArray.push(0);
  }
  for (var i = 0; i < minePosition.length; i++) {
    randomArray[minePosition[i] - 1] = 1;
  }
  return randomArray;
};

function getRandomInt(max) {
  return rand.intBetween(1, max);
}

module.exports = { CreateRandomArray };
