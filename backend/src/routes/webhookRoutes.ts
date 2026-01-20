import { Router } from "express";
import * as WebhookController from "../controllers/WebhookController";

const webhookRoutes = Router();

// Facebook/WhatsApp Cloud API Webhook verification (GET)
webhookRoutes.get("/webhook/whatsapp", WebhookController.verify);

// Facebook/WhatsApp Cloud API Webhook messages (POST)
webhookRoutes.post("/webhook/whatsapp", WebhookController.receive);

export default webhookRoutes;
