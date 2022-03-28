
const patternNum = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const OtherBetSet = {
    row_1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    row_2: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    row_3: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    column_3: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    column_2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    column_1: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    RED: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    BLACK: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
    EVEN: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    ODD: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    half_1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    half_2: [
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    ],
};

const values = ["hlaf_1", "hlaf_2", "RED", "BLACK", "EVEN", "ODD"];

function rotateValue() {
    var randomNum = Math.floor(Math.random() * 37);
    var spinResult = patternNum[randomNum];
    return spinResult;
}

function calcMatch(betValue, spinResult) {
    var earnAmount = 0;
    let colorstate = 0;
    if (OtherBetSet["RED"].indexOf(spinResult) !== -1) {
        colorstate = 1;
    } else if (OtherBetSet["BLACK"].indexOf(spinResult) !== -1) {
        colorstate = 2;
    }
    for (let key in betValue) {
        let value = betValue[key];
        if (value > 0) {
            if (key.indexOf("-") === -1) {
                if (
                    key.indexOf("P_") !== -1 &&
                    key === "P_" + spinResult.toString()
                ) {
                    earnAmount += value * 36;
                } else if (
                    key.indexOf("P_") === -1 &&
                    OtherBetSet[key].indexOf(spinResult) !== -1
                ) {
                    let cofficient = values.indexOf(key) !== -1 ? 2 : 3;
                    earnAmount += value * cofficient;
                }
            } else {
                let name = key.split("-");
                for (let i = 0; i < name.length; i++) {
                    console.log("name.length", name.length);
                    if (
                        name[i].indexOf("P_") !== -1 &&
                        name[i] === "P_" + spinResult.toString()
                    ) {
                        earnAmount += value * (36 / name.length);
                    }
                }
            }
        }
    }
    return earnAmount;
}

module.exports = { rotateValue, calcMatch };