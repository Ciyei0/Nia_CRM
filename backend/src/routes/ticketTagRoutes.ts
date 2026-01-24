import express from "express";
import isAuth from "../middleware/isAuth";

import * as TicketTagController from "../controllers/TicketTagController";

const ticketTagRoutes = express.Router();

ticketTagRoutes.put("/ticket-tags/:ticketId/:tagId", isAuth, TicketTagController.store);
ticketTagRoutes.delete("/ticket-tags/:ticketId", isAuth, TicketTagController.remove);
ticketTagRoutes.delete("/ticket-tags/:ticketId/:tagId", isAuth, TicketTagController.removeTag);

export default ticketTagRoutes;
