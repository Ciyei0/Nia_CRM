require('dotenv').config();
const { index } = require('./dist/controllers/TicketController');
const { Sequelize } = require('sequelize');
const dbConfig = require('./dist/config/database');

async function run() {
  const req = {
    query: {
      pageNumber: "1",
      status: "pending",
      searchParam: "",
      showAll: undefined,
      queueIds: "[]",
      tags: "[]",
      users: "[]"
    },
    user: { id: 6, companyId: 1, profile: "admin" } // MOCK REQ.USER
  };

  const res = {
    status: function(s) {
      this.statusCode = s;
      return this;
    },
    json: function(data) {
      console.log("=== RESPUESTA DE LA API ===");
      console.log("Tickets encontrados:", data.tickets?.length || 0);
      if (data.tickets && data.tickets.length > 0) {
        console.log("Ticket ID 1 devuelto correctamente.");
      } else {
        console.log("¡LA API ESTA DEVOLVIENDO UN ARRAY VACIO!");
      }
      process.exit(0);
    }
  };

  try {
    await index(req, res);
  } catch (error) {
    console.error("Error en TicketController.index:", error);
    process.exit(1);
  }
}

run();
