import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.sequelize.transaction(async t => {
            await queryInterface.addColumn(
                "Queues",
                "autoAssignmentEnabled",
                {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                { transaction: t }
            );

            await queryInterface.addColumn(
                "Queues",
                "assignOfflineUsers",
                {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                { transaction: t }
            );

            await queryInterface.addColumn(
                "Queues",
                "autoAssignUserIds",
                {
                    type: DataTypes.JSONB,
                    defaultValue: []
                },
                { transaction: t }
            );
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.sequelize.transaction(async t => {
            await queryInterface.removeColumn("Queues", "autoAssignmentEnabled", {
                transaction: t
            });
            await queryInterface.removeColumn("Queues", "assignOfflineUsers", {
                transaction: t
            });
            await queryInterface.removeColumn("Queues", "autoAssignUserIds", {
                transaction: t
            });
        });
    }
};
