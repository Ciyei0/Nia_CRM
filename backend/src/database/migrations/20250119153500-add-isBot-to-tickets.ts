import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("Tickets", "isBot", {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("Tickets", "isBot");
    }
};
