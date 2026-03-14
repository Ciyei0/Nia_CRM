require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false
    }
);

async function setSuperAdmin() {
    try {
        await sequelize.authenticate();
        const [results, metadata] = await sequelize.query(`UPDATE "Users" SET super = true WHERE "companyId" = 1 RETURNING id;`);
        console.log(`Successfully granted Super Admin privileges to users in company ID 1. Affected rows: ${results.length}`);
    } catch (error) {
        console.error("Error setting super admin:", error);
    } finally {
        await sequelize.close();
    }
}

setSuperAdmin();
