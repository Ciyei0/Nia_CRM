import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { getIO } from "../../libs/socket";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import CreateMessageService from "../MessageServices/CreateMessageService";
import Whatsapp from "../../models/Whatsapp";

interface Request {
    media: Express.Multer.File;
    ticket: Ticket;
    body?: string;
}

const SendWhatsAppCloudMedia = async ({ media, ticket, body }: Request): Promise<any> => {
    try {
        const whatsapp = await Whatsapp.findByPk(ticket.whatsappId);

        if (!whatsapp) {
            throw new AppError("ERR_WAPP_NOT_INITIALIZED");
        }

        if (!whatsapp.facebookAccessToken) {
            throw new Error("Facebook Access Token is missing.");
        }

        // 1. Upload Media
        const form = new FormData();
        form.append("file", fs.createReadStream(media.path), {
            filename: media.originalname,
            contentType: media.mimetype
        });
        form.append("type", media.mimetype);
        form.append("messaging_product", "whatsapp");

        // Using 'number' field as phone_number_id based on previous file analysis
        const phoneNumberId = (whatsapp as any).number || (whatsapp as any).phoneNumberId;

        if (!phoneNumberId) {
            throw new Error("Phone ID not found in connection");
        }

        const uploadUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/media`;

        const uploadResponse = await axios.post(uploadUrl, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${whatsapp.facebookAccessToken}`
            }
        });

        const mediaId = uploadResponse.data.id;

        // 2. Send Message with Media ID
        const payload: any = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: ticket.contact.number,
            type: media.mimetype.split("/")[0] // image, video, audio, document
        };

        const type = media.mimetype.split("/")[0];

        // Adjust payload strictly based on type
        if (type === "image") {
            payload.image = { id: mediaId, caption: body };
        } else if (type === "video") {
            payload.video = { id: mediaId, caption: body };
        } else if (type === "audio") {
            payload.audio = { id: mediaId };
        } else if (type === "document" || type === "application" || type === "text") {
            // Multer might classify some docs as 'application' or 'text'
            payload.type = "document";
            payload.document = { id: mediaId, caption: body, filename: media.originalname };
        } else {
            // Fallback for unknown types - try to send as document
            payload.type = "document";
            payload.document = { id: mediaId, caption: body, filename: media.originalname };
        }

        const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

        const sendResponse = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${whatsapp.facebookAccessToken}`,
                "Content-Type": "application/json"
            }
        });

        const messageId = sendResponse.data.messages[0].id;

        // 3. Save to Database
        const messageData = {
            id: messageId,
            ticketId: ticket.id,
            body: body || media.originalname,
            fromMe: true,
            read: true,
            mediaType: type,
            mediaUrl: media.filename,
            ack: 1
        };

        await ticket.update({ lastMessage: body || media.originalname });

        const message = await CreateMessageService({ messageData, companyId: ticket.companyId });

        // 4. Emit Socket Event (Manual emit for visualization)
        const io = getIO();
        io.to(ticket.id.toString())
            .to(`company-${ticket.companyId}-${ticket.status}`)
            .to(`company-${ticket.companyId}-notification`)
            .emit(`company-${ticket.companyId}-appMessage`, {
                action: "create",
                message,
                ticket: ticket,
                contact: ticket.contact
            });

        return sendResponse.data;

    } catch (err: any) {
        console.error("Cloud Media Send Error:", err.response?.data || err.message);
        throw new AppError("ERR_SENDING_WAPP_MSG");
    }
};

export default SendWhatsAppCloudMedia;
