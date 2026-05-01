import axios from "axios";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import WhatsappTemplate from "../../models/WhatsappTemplate";
import CreateMessageService from "../../services/MessageServices/CreateMessageService";

interface Request {
    ticket: Ticket;
    template: WhatsappTemplate;
    variables: string[];
}

const SendWhatsAppCloudTemplate = async ({
    ticket,
    template,
    variables
}: Request): Promise<any> => {
    const whatsapp = ticket.whatsapp;

    if (!whatsapp || whatsapp.channel !== "whatsapp_cloud") {
        throw new AppError("Solo se pueden enviar plantillas en conexiones de WhatsApp Cloud API");
    }

    const accessToken = whatsapp.facebookAccessToken || whatsapp.token;
    if (!accessToken) {
        throw new AppError("ERR_WAPP_CLOUD_TOKEN_MISSING");
    }

    const phoneNumberId = whatsapp.number;
    if (!phoneNumberId) {
        throw new AppError("ERR_WAPP_CLOUD_PHONE_ID_MISSING");
    }

    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    const components: any[] = [];

    if (variables && variables.length > 0) {
        components.push({
            type: "body",
            parameters: variables.map(v => ({
                type: "text",
                text: v
            }))
        });
    }

    // Handle header variables if needed (currently assuming only body variables are passed)
    // In a more complex version, we'd separate header and body variables

    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: ticket.contact.number,
        type: "template",
        template: {
            name: template.name,
            language: {
                code: template.language
            },
            ...(components.length > 0 && { components })
        }
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const messageId = response.data.messages[0].id;

        // Replace variables in bodyText for local storage
        let body = template.bodyText;
        variables.forEach((v, i) => {
            body = body.replace(`{{${i + 1}}}`, v);
        });

        const messageData = {
            id: messageId,
            ticketId: ticket.id,
            body: `[Plantilla: ${template.name}]\n${body}`,
            fromMe: true,
            read: true,
            mediaType: "chat",
            ack: 1
        };

        await ticket.update({ lastMessage: body });

        await CreateMessageService({ messageData, companyId: ticket.companyId });

        return response.data;
    } catch (error: any) {
        console.error("Cloud API Template Send Error:", error.response?.data || error.message);
        throw new AppError("Error al enviar la plantilla de WhatsApp Cloud");
    }
};

export default SendWhatsAppCloudTemplate;
