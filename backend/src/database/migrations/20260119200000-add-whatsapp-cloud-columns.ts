import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn("Whatsapps", "channel", {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "baileys"
        });

        await queryInterface.addColumn("Whatsapps", "facebookAccessToken", {
            type: DataTypes.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn("Whatsapps", "facebookUserId", {
            type: DataTypes.STRING,
            allowNull: true
        });

        await queryInterface.addColumn("Whatsapps", "whatsappAccountId", {
            type: DataTypes.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Whatsapps", "channel");
        await queryInterface.removeColumn("Whatsapps", "facebookAccessToken");
        await queryInterface.removeColumn("Whatsapps", "facebookUserId");
        await queryInterface.removeColumn("Whatsapps", "whatsappAccountId");
    }
};
