import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("WhatsappTemplates", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "es"
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "PENDING"
            },
            headerType: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "NONE"
            },
            headerContent: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            bodyText: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            footerText: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            buttons: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            metaTemplateId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            companyId: {
                type: DataTypes.INTEGER,
                references: { model: "Companies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
            },
            whatsappId: {
                type: DataTypes.INTEGER,
                references: { model: "Whatsapps", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("WhatsappTemplates");
    }
};
