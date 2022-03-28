const mysql = require("mysql2");
const util = require("util");
const config = require("../config");
const { delay } = require("../utils");

module.exports = function () {
    var con

    const connect = () => {
        con = mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            database: config.database,
            password: config.password,
            insecureAuth: true,
        });

        con.connect((err) => {
            // if (err) throw err;
            console.log("MYSQL Connected!");
        });

        con.on("error", (err) => {
            // throw err;
            console.log("error", err.message);
            (async () => {
                console.log("reconnect");
                await delay(2000);
                connect();
            })();
        });
    }

    connect();
    return {
        query(sql, args) {
            return util.promisify(con.query).call(con, sql, args);
        },
        close() {
            return util.promisify(con.end).call(con);
        },
    };
};
