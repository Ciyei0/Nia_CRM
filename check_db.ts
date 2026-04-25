import db from "./backend/src/database/index"; // Import db manually or just sequelize
import Message from "./backend/src/models/Message";

async function run() {
  try {
    const messages = await Message.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      raw: true
    });
    console.log("LAST 10 MESSAGES:");
    for (let msg of messages) {
      console.log(`[${msg.createdAt}] id=${msg.id} body="${msg.body}" fromMe=${msg.fromMe} mediaType=${msg.mediaType} ticketId=${msg.ticketId}`);
    }
  } catch (e) {
    console.error(e);
  }
  process.exit();
}

run();
