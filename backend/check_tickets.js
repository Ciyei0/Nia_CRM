require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false
});

async function checkTickets() {
  try {
    const [tickets] = await sequelize.query('SELECT id, status, "queueId", "userId", "companyId", "unreadMessages" FROM "Tickets" ORDER BY id DESC LIMIT 5;');
    console.log("Últimos 5 tickets:");
    console.table(tickets);
    
    const [users] = await sequelize.query('SELECT id, name, profile, "allTicket" FROM "Users" LIMIT 5;');
    console.log("Usuarios:");
    console.table(users);
  } catch (error) {
    console.error('Error al conectar:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTickets();
