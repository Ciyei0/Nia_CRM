import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert("Settings", [
      {
        key: "viewregister",
        value: "disabled",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "allowregister",
        value: "disabled",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Settings", {
      key: ["viewregister", "allowregister"],
      companyId: 1
    });
  }
};
