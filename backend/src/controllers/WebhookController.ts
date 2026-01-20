import { Request, Response } from "express";
import Whatsapp from "../models/Whatsapp";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Message from "../models/Message";
import { getIO } from "../libs/socket";
import CreateOrUpdateContactService from "../services/ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";
import CreateMessageService from "../services/MessageServices/CreateMessageService";
import { logger } from "../utils/logger";

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

                // Find the WhatsApp connection by account ID
                const whatsapp = await Whatsapp.findOne({
                    where: {
                        whatsappAccountId,
                        channel: "whatsapp_cloud"
                    }
                });

                if (!whatsapp) {
                    logger.warn(`No WhatsApp Cloud connection found for account ID: ${whatsappAccountId}`);
                    continue;
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
                mediaUrl = message.image?.id; // Media ID to fetch later
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

        await CreateMessageService({ messageData, companyId: whatsapp.companyId });

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
