/** @format */

const UserController = {
    createUser: async (props) => {
        const { username, email, password, coin_current } = props;
        var command =
            "INSERT INTO account (username, email, password, coin_current ) VALUES (?, ?, ?, ?)";
        const result = await global.sql.query(command, [username, email, password,coin_current]);
        return result;
    },
    findUser: async (props) => {
        const { param, flag } = props;
        var command;
        switch (flag) {
            case 1: //email check
                command = "SELECT * FROM account WHERE email = ?";
                break;
            case 2: //name check
                command = "SELECT * FROM account WHERE username = ?";
            default:
                break;
        }
        const result = await global.sql.query(command, [param]);
        return result;
    },
    updatebalance: async (props) => {
        const { username, coin_current } = props;
        const command = "UPDATE account SET coin_current = ? WHERE username = ?"
        const result = await global.sql.query(command, [coin_current, username]);
        return result;
    }
};

module.exports = { UserController };
