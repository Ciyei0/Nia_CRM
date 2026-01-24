import axios from "axios";
import AppError from "../../errors/AppError";
import WhatsappTemplate from "../../models/WhatsappTemplate";
import Whatsapp from "../../models/Whatsapp";

interface TemplateButton {
    type: string;
    text?: string;
    url?: string;
    phone_number?: string;
}

interface Request {
    name: string;
    category: string;
    language: string;
    headerType?: string;
    headerContent?: string;
    bodyText: string;
    footerText?: string;
    buttons?: TemplateButton[];
    companyId: number;
    whatsappId: number;
}

const CreateWhatsappTemplateService = async ({
    name,
    category,
    language,
    headerType,
    headerContent,
    bodyText,
    footerText,
    buttons,
    companyId,
    whatsappId
}: Request): Promise<WhatsappTemplate> => {
    // Get the WhatsApp connection to use its credentials
    const whatsapp = await Whatsapp.findOne({
        where: { id: whatsappId, companyId }
    });

    if (!whatsapp) {
        throw new AppError("ERR_WAPP_NOT_FOUND");
    }

    const accessToken = whatsapp.facebookAccessToken || whatsapp.token;
    const wabaId = whatsapp.whatsappAccountId;

    if (!accessToken || !wabaId) {
        throw new AppError("ERR_WAPP_CLOUD_NOT_CONFIGURED");
    }

    // Build template components for Meta API
    const components: any[] = [];

    // Header component
    if (headerType && headerType !== "NONE" && headerContent) {
        if (headerType === "TEXT") {
            components.push({
                type: "HEADER",
                format: "TEXT",
                text: headerContent
            });
        } else {
            // For IMAGE, VIDEO, DOCUMENT - we use example URL
            components.push({
                type: "HEADER",
                format: headerType,
                example: {
                    header_handle: [headerContent]
                }
            });
        }
    }

    // Body component
    const bodyComponent: any = {
        type: "BODY",
        text: bodyText
    };

    // Extract variables from body (e.g., {{1}}, {{2}})
    const variableMatches = bodyText.match(/\{\{(\d+)\}\}/g);
    if (variableMatches && variableMatches.length > 0) {
        bodyComponent.example = {
            body_text: [variableMatches.map((_, i) => `Example ${i + 1}`)]
        };
    }
    components.push(bodyComponent);

    // Footer component
    if (footerText) {
        components.push({
            type: "FOOTER",
            text: footerText
        });
    }

    // Buttons component
    if (buttons && buttons.length > 0) {
        const buttonComponent: any = {
            type: "BUTTONS",
            buttons: buttons.map(btn => {
                if (btn.type === "QUICK_REPLY") {
                    return { type: "QUICK_REPLY", text: btn.text };
                } else if (btn.type === "URL") {
                    return { type: "URL", text: btn.text, url: btn.url };
                } else if (btn.type === "PHONE_NUMBER") {
                    return { type: "PHONE_NUMBER", text: btn.text, phone_number: btn.phone_number };
                }
                return btn;
            })
        };
        components.push(buttonComponent);
    }

    // Create template in Meta API
    let metaTemplateId: string | null = null;
    let status = "PENDING";

    try {
        const url = `https://graph.facebook.com/v20.0/${wabaId}/message_templates`;

        const payload = {
            name: name.toLowerCase().replace(/\s+/g, "_"),
            category: category.toUpperCase(),
            language: language,
            components
        };

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        metaTemplateId = response.data.id;
        status = response.data.status || "PENDING";
    } catch (error: any) {
        console.error("Meta API Error:", error.response?.data || error.message);

        // Still create local template but mark as failed
        status = "FAILED";

        const errorMessage = error.response?.data?.error?.message || error.message;
        throw new AppError(`ERR_META_API: ${errorMessage}`);
    }

    // Create local template record
    const template = await WhatsappTemplate.create({
        name: name.toLowerCase().replace(/\s+/g, "_"),
        category: category.toUpperCase(),
        language,
        status,
        headerType: headerType || "NONE",
        headerContent,
        bodyText,
        footerText,
        buttons: buttons ? JSON.stringify(buttons) : null,
        metaTemplateId,
        companyId,
        whatsappId
    });

    return template;
};

export default CreateWhatsappTemplateService;
