import { Request, Response } from "express";
import Whatsapp from "../models/Whatsapp";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Message from "../models/Message";
import { getIO } from "../libs/socket";
import CreateOrUpdateContactService from "../services/ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";
import CreateMessageService from "../services/MessageServices/CreateMessageService";
import ShowQueueIntegrationService from "../services/QueueIntegrationServices/ShowQueueIntegrationService";
import Queue from "../models/Queue";
import { logger } from "../utils/logger";
import request from "request";

// Verify token for webhook validation (Facebook sends a GET request)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "niacrm_webhook_token";

/**
 * GET /webhook/whatsapp
 * Facebook sends a GET request to verify the webhook URL
 */
export const verify = async (req: Request, res: Response): Promise<Response> => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    logger.info("WhatsApp Webhook verification request received");

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            logger.info("WhatsApp Webhook verified successfully");
            return res.status(200).send(challenge);
        }
    }

    logger.warn("WhatsApp Webhook verification failed - invalid token");
    return res.sendStatus(403);
};

/**
 * POST /webhook/whatsapp
 * Facebook sends incoming messages via POST
 */
export const receive = async (req: Request, res: Response): Promise<Response> => {
    try {
        const body = req.body;

        logger.info(`WhatsApp Webhook received: ${JSON.stringify(body)}`);

        // Check if this is a WhatsApp message
        if (body.object !== "whatsapp_business_account") {
            return res.sendStatus(404);
        }

        // Process each entry
        if (body.entry && Array.isArray(body.entry)) {
            for (const entry of body.entry) {
                const whatsappAccountId = entry.id;
                logger.info(`Webhook Analysis: Received WABA ID: ${whatsappAccountId}`);

                // Find the WhatsApp connection by account ID
                const whatsapp = await Whatsapp.findOne({
                    where: {
                        whatsappAccountId,
                        channel: "whatsapp_cloud"
                    }
                });

                if (!whatsapp) {
                    logger.error(`CRITICAL: No WhatsApp Cloud connection found for account ID: ${whatsappAccountId} in DB.`);
                    continue;
                } else {
                    logger.info(`Webhook Analysis: Connection found! ID: ${whatsapp.id}, Name: ${whatsapp.name}`);
                }

                // Process changes (messages, status updates, etc.)
                if (entry.changes && Array.isArray(entry.changes)) {
                    for (const change of entry.changes) {
                        if (change.field === "messages") {
                            const value = change.value;

                            // Get metadata
                            const phoneNumberId = value.metadata?.phone_number_id;
                            const displayPhoneNumber = value.metadata?.display_phone_number;

                            // Process incoming messages
                            if (value.messages && Array.isArray(value.messages)) {
                                for (const message of value.messages) {
                                    await processIncomingMessage(
                                        whatsapp,
                                        message,
                                        value.contacts,
                                        phoneNumberId
                                    );
                                }
                            }

                            // Process message status updates
                            if (value.statuses && Array.isArray(value.statuses)) {
                                for (const status of value.statuses) {
                                    await processMessageStatus(whatsapp, status);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Always respond with 200 OK to acknowledge receipt
        return res.sendStatus(200);
    } catch (error) {
        logger.error(`WhatsApp Webhook error: ${error}`);
        // Still return 200 to prevent Facebook from retrying
        return res.sendStatus(200);
    }
};

/**
 * Process an incoming message from WhatsApp Cloud API
 */
async function processIncomingMessage(
    whatsapp: Whatsapp,
    message: any,
    contacts: any[],
    phoneNumberId: string
): Promise<void> {
    try {
        const from = message.from; // Sender's phone number
        const messageId = message.id;
        const timestamp = message.timestamp;
        const messageType = message.type;

        // Extract contact info
        let contactName = from;
        if (contacts && contacts.length > 0) {
            const contact = contacts.find((c: any) => c.wa_id === from);
            if (contact && contact.profile) {
                contactName = contact.profile.name || from;
            }
        }

        logger.info(`Processing message from ${from} (${contactName}): ${messageType}`);

        // Create or update contact
        const contactData = await CreateOrUpdateContactService({
            name: contactName,
            number: from,
            isGroup: false,
            companyId: whatsapp.companyId
        });

        // Find or create ticket
        const ticket = await FindOrCreateTicketService(
            contactData,
            whatsapp.id,
            0, // unreadMessages
            whatsapp.companyId,
            undefined // queueId
        );


        // Extract message body based on type
        let body = "";
        let mediaUrl = null;
        let mediaType = null;

        switch (messageType) {
            case "text":
                body = message.text?.body || "";
                break;
            case "image":
                body = message.image?.caption || "[Imagen]";
                mediaType = "image";
                mediaUrl = message.image?.id;
                break;
            case "video":
                body = message.video?.caption || "[Video]";
                mediaType = "video";
                mediaUrl = message.video?.id;
                break;
            case "audio":
                body = "[Audio]";
                mediaType = "audio";
                mediaUrl = message.audio?.id;
                break;
            case "document":
                body = message.document?.filename || "[Documento]";
                mediaType = "document";
                mediaUrl = message.document?.id;
                break;
            case "sticker":
                body = "[Sticker]";
                mediaType = "sticker";
                mediaUrl = message.sticker?.id;
                break;
            case "location":
                body = `[Ubicación: ${message.location?.latitude}, ${message.location?.longitude}]`;
                break;
            case "contacts":
                body = "[Contacto compartido]";
                break;
            case "button":
                body = message.button?.text || "[Botón]";
                break;
            case "interactive":
                if (message.interactive?.button_reply) {
                    body = message.interactive.button_reply.title || "[Respuesta]";
                } else if (message.interactive?.list_reply) {
                    body = message.interactive.list_reply.title || "[Selección de lista]";
                }
                break;
            default:
                body = `[Mensaje tipo: ${messageType}]`;
        }

        // If it's a media message, download the file
        if (mediaUrl && mediaType) {
            try {
                const DownloadWhatsAppMedia = require("../services/WbotServices/DownloadWhatsAppMedia").default;
                const fileName = await DownloadWhatsAppMedia({ mediaId: mediaUrl, whatsapp });
                mediaUrl = fileName; // Update mediaUrl with the local filename
            } catch (error) {
                logger.error(`Failed to download media for message ${messageId}: ${error}`);
                body += " (Error al descargar multimedia)";
                mediaUrl = null; // Prevent saving invalid ID
            }
        }

        // Create message in database
        const messageData = {
            id: messageId,
            ticketId: ticket.id,
            contactId: contactData.id,
            body,
            fromMe: false,
            read: false,
            mediaType: mediaType || (messageType === "text" ? null : messageType),
            mediaUrl,
            companyId: whatsapp.companyId
        };



        logger.info(`WebhookController: Calling CreateMessageService for message ${messageId}`);
        await CreateMessageService({ messageData, companyId: whatsapp.companyId });
        logger.info(`WebhookController: CreateMessageService finished for message ${messageId}`);


        // Update ticket with last message
        await ticket.update({
            lastMessage: body,
            unreadMessages: ticket.unreadMessages + 1
        });

        // Emit socket event for real-time updates
        const io = getIO();
        io.to(`company-${whatsapp.companyId}-open`)
            .to(`company-${whatsapp.companyId}-${ticket.id}`)
            .emit(`company-${whatsapp.companyId}-ticket`, {
                action: "update",
                ticket
            });

        logger.info(`Message saved: ${messageId} for ticket ${ticket.id}`);

        // Integration Logic (N8N / Webhook)
        let integrationId = whatsapp.integrationId;

        // Prioritize Queue Integration if ticket is assigned to a queue
        if (ticket.queueId) {
            const queue = await Queue.findByPk(ticket.queueId);
            if (queue && queue.integrationId) {
                integrationId = queue.integrationId;
                logger.info(`WebhookController: Found Ticket Queue Integration ID: ${integrationId}`);
            }
        }

        if (integrationId) {
            try {
                const integration = await ShowQueueIntegrationService(integrationId, whatsapp.companyId);

                logger.info(`WebhookController: Integration Detail - ID: ${integration.id}, Name: ${integration.name}, Type: ${integration.type}, URL: ${integration.urlN8N}`);

                const integrationType = integration.type ? integration.type.toLowerCase() : "";

                // Check for n8n, webhook, or webhooks (plural/mixed case)
                if (integrationType === "n8n" || integrationType.includes("webhook")) {
                    if (integration.urlN8N) {
                        const options = {
                            method: "POST",
                            url: integration.urlN8N,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            json: {
                                ...message,
                                fromMe: false,
                                contact: contactData,
                                ticket: ticket,
                                type: messageType,
                                body,
                                source: "whatsapp_cloud_webhook"
                            }
                        };

                        logger.info(`WebhookController: Sending POST to: ${integration.urlN8N}`);

                        request(options, function (error, response) {
                            if (error) {
                                logger.error(`WebhookController: Error sending to integration: ${error}`);
                            } else {
                                logger.info(`WebhookController: Sent to integration. StatusCode: ${response ? response.statusCode : "unknown"}`);
                            }
                        });
                    } else {
                        logger.warn(`WebhookController: Integration type matches but NO URL defined.`);
                    }
                } else {
                    logger.warn(`WebhookController: Integration type '${integration.type}' not handled by this logic.`);
                }
            } catch (error) {
                logger.error(`WebhookController: Error handling integration: ${error}`);
            }
        } else {
            logger.info("WebhookController: No integration assigned to Connection or Queue associated with this ticket.");
        }
    } catch (error) {
        logger.error(`Error processing incoming message: ${error}`);
    }
}

/**
 * Process message status updates (sent, delivered, read)
 */
async function processMessageStatus(
    whatsapp: Whatsapp,
    status: any
): Promise<void> {
    try {
        const messageId = status.id;
        const statusType = status.status; // sent, delivered, read, failed

        logger.info(`Message status update: ${messageId} -> ${statusType}`);

        // Find and update the message
        const message = await Message.findOne({
            where: { id: messageId }
        });

        if (message) {
            let ack = 0;
            switch (statusType) {
                case "sent":
                    ack = 1;
                    break;
                case "delivered":
                    ack = 2;
                    break;
                case "read":
                    ack = 3;
                    break;
                case "failed":
                    ack = -1;
                    break;
            }

            await message.update({ ack });

            // Emit socket event
            const io = getIO();
            io.to(`company-${whatsapp.companyId}-${message.ticketId}`)
                .emit(`company-${whatsapp.companyId}-appMessage`, {
                    action: "update",
                    message
                });
        }
    } catch (error) {
        logger.error(`Error processing message status: ${error}`);
    }
}
