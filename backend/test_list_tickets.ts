import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize-typescript";
import dbConfig from "./src/config/database";
import Ticket from "./src/models/Ticket";
import Contact from "./src/models/Contact";
import Queue from "./src/models/Queue";
import User from "./src/models/User";
import Tag from "./src/models/Tag";
import TicketTag from "./src/models/TicketTag";
import Whatsapp from "./src/models/Whatsapp";
import Message from "./src/models/Message";
import ListTicketsService from "./src/services/TicketServices/ListTicketsService";

const sequelize = new Sequelize(dbConfig);

const models = [
  Contact,
  Ticket,
  Message,
  Queue,
  User,
  Tag,
  TicketTag,
  Whatsapp
];

sequelize.addModels(models);

async function run() {
  try {
    const result = await ListTicketsService({
      searchParam: "",
      pageNumber: "1",
      queueIds: [],
      tags: [],
      users: [],
      status: "pending",
      date: undefined,
      updatedAt: undefined,
      showAll: undefined,
      userId: "1", // simulating user ID 1
      withUnreadMessages: undefined,
      companyId: 1
    });

    console.log("ListTicketsService Result:");
    console.log("Count:", result.count);
    console.log("Tickets length:", result.tickets.length);
    if (result.tickets.length > 0) {
      console.log("First ticket:", result.tickets[0].toJSON());
    } else {
      console.log("No tickets found. Why?");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

run();
