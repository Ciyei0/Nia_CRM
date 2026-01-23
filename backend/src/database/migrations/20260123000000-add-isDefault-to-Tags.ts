import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("Tags", "isDefault", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("Tags", "isDefault");
    }
};
