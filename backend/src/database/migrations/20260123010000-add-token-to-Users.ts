import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("Users", "token", {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("Users", "token");
    }
};
