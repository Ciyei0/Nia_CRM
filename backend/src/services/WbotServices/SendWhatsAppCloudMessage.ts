import axios from "axios";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import Message from "../../models/Message";
import formatBody from "../../helpers/Mustache";
import CreateMessageService from "../../services/MessageServices/CreateMessageService";

interface Request {
    body: string;
    ticket: Ticket;
    quotedMsg?: Message;
}

const SendWhatsAppCloudMessage = async ({
    body,
    ticket,
    quotedMsg
}: Request): Promise<any> => {
    const whatsapp = ticket.whatsapp;

    let accessToken = whatsapp.facebookAccessToken || whatsapp.token;

    if (!accessToken) {
        throw new AppError("ERR_WAPP_CLOUD_TOKEN_MISSING");
    }

    let phoneNumberId = whatsapp.number;
    const whatsappAccountId = whatsapp.whatsappAccountId;

    // If number is missing but we have WABA ID, let's try to fetch the first phone number
    if (!phoneNumberId && whatsappAccountId) {
        try {
            const url = `https://graph.facebook.com/v20.0/${whatsappAccountId}/phone_numbers`;
            const response = await axios.get(url, {
                params: { access_token: accessToken }
            });

            if (response.data.data && response.data.data.length > 0) {
                // Use the first phone number found
                phoneNumberId = response.data.data[0].id; // id is the Phone Number ID

                // Optionally update the whatsapp model to save this number
                await whatsapp.update({ number: phoneNumberId });
            }
        } catch (error) {
            console.error("Error fetching phone number ID:", error);
        }
    }

    if (!phoneNumberId) {
        throw new AppError("ERR_WAPP_CLOUD_PHONE_ID_MISSING");
    }

    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    // Ticket contact number usually has DDI+DDD+Number. Cloud API expects country code + number.
    // We'll assume ticket.contact.number is in the correct format (e.g. 5511999999999)
    const recipientNumber = ticket.contact.number;

    let context = {};
    if (quotedMsg) {
        // Cloud API requires wamid.HB... ID.
        // If the message is from me, it might be stored, if from user, it is stored.
        // Assuming quotedMsg.id holds the correct WAMID for Cloud API messages too.
        context = {
            message_id: quotedMsg.id
        };
    }

    const textBody = formatBody(body, ticket.contact);

    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientNumber,
        type: "text",
        text: {
            body: textBody
        },
        ...(Object.keys(context).length > 0 && { context })
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const messageId = response.data.messages[0].id;

        const messageData = {
            id: messageId,
            ticketId: ticket.id,
            body: textBody,
            fromMe: true,
            read: true,
            mediaType: "chat",
            ack: 1,
            quotedMsgId: quotedMsg ? quotedMsg.id : undefined
        };

        await ticket.update({ lastMessage: textBody });

        await CreateMessageService({ messageData, companyId: ticket.companyId });

        return response.data;
    } catch (error: any) {
        console.error("Cloud API Send Error:", error.response?.data || error.message);
        throw new AppError("ERR_SENDING_WAPP_CLOUD_MSG");
    }
};

export default SendWhatsAppCloudMessage;
