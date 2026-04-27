require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: true
});

const Ticket = sequelize.define('Ticket', {
  status: Sequelize.STRING,
  queueId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  companyId: Sequelize.INTEGER,
});

async function testQuery() {
  try {
    let queueIds = [];
    let userId = 1;
    let companyId = 1;
    let status = "pending";

    let whereCondition = {
      [Op.or]: [{ userId }, { status: "pending" }],
      queueId: { [Op.or]: [queueIds, null] }
    };

    if (status) {
      whereCondition = {
        ...whereCondition,
        status
      };
    }
    
    whereCondition.companyId = companyId;

    console.log("Where condition:", JSON.stringify(whereCondition, Object.getOwnPropertySymbols(whereCondition).map(s => String(s))));

    const tickets = await Ticket.findAll({
      where: whereCondition,
      limit: 5
    });

    console.log("Tickets:", tickets.length);
  } catch (e) {
    console.error(e);
  } finally {
    sequelize.close();
  }
}

testQuery();
