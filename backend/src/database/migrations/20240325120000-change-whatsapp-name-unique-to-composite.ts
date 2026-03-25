import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // 1. Drop the existing global unique constraint on "name"
    // Note: The constraint name might vary depending on whether it was created as a constraint or index.
    // In Sequelize with unique: true, it often creates an index called "Whatsapps_name_key" or similar.
    // Let's try to remove the index/constraint safely.
    try {
      await queryInterface.removeConstraint("Whatsapps", "Whatsapps_name_key");
    } catch (e) {
      console.log("Constraint Whatsapps_name_key not found, skipping...");
    }

    try {
      await queryInterface.removeIndex("Whatsapps", "name");
    } catch (e) {
      console.log("Index name on Whatsapps not found, skipping...");
    }

    // 2. Add the composite unique index (name, companyId)
    await queryInterface.addIndex("Whatsapps", ["name", "companyId"], {
      name: "whatsapp_name_company_unique",
      unique: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    // 1. Drop the composite index
    await queryInterface.removeIndex("Whatsapps", "whatsapp_name_company_unique");

    // 2. Re-add the global unique constraint (this might fail if duplicates already exist)
    await queryInterface.addIndex("Whatsapps", ["name"], {
      name: "Whatsapps_name_key",
      unique: true
    });
  }
};
