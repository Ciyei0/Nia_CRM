const { Sequelize, Op } = require('sequelize');

async function run() {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });

  const Ticket = sequelize.define('Ticket', {
    status: Sequelize.STRING,
    queueId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    companyId: Sequelize.INTEGER,
  });

  await sequelize.sync();

  // Create the exact ticket
  await Ticket.create({
    status: 'pending',
    queueId: null,
    userId: null,
    companyId: 1
  });

  let queueIds = [];
  let userId = 1; // Current user ID
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

  console.log("Found tickets:", tickets.length);
  if (tickets.length > 0) {
      console.log(tickets[0].toJSON());
  }

  sequelize.close();
}

run();
