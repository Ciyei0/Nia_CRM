require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false
});

const Ticket = sequelize.define('Ticket', {
  status: Sequelize.STRING,
  queueId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  companyId: Sequelize.INTEGER,
  unreadMessages: Sequelize.INTEGER,
});

async function run() {
  try {
    let queueIds = [];
    let userId = 1;
    let status = "pending";
    let companyId = 1;

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

    const tickets = await Ticket.findAll({
      where: whereCondition
    });

    console.log("=== PRUEBA DE CONSULTA DE TICKETS ===");
    console.log("Total encontrados con filtro Pendiente:", tickets.length);
    if (tickets.length > 0) {
      console.log("Tickets:");
      console.table(tickets.map(t => t.toJSON()));
    } else {
      console.log("¡El filtro no devolvió ningún ticket!");
      console.log("Filtro usado:", JSON.stringify(whereCondition, Object.getOwnPropertySymbols(whereCondition).map(s => String(s))));
      
      // Try again without the Op.or block to see if that's the culprit
      console.log("\nProbando sin el filtro de userId/queueId...");
      const tickets2 = await Ticket.findAll({
        where: { status: "pending", companyId: 1 }
      });
      console.log("Encontrados sin filtro estricto:", tickets2.length);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

run();
