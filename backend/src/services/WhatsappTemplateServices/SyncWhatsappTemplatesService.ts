import axios from "axios";
import WhatsappTemplate from "../../models/WhatsappTemplate";
import Whatsapp from "../../models/Whatsapp";

interface Request {
    companyId: number;
    whatsappId: number;
}

interface MetaTemplate {
    id: string;
    name: string;
    status: string;
    category: string;
    language: string;
    components: any[];
}

const SyncWhatsappTemplatesService = async ({
    companyId,
    whatsappId
}: Request): Promise<{ synced: number; created: number }> => {
    const whatsapp = await Whatsapp.findOne({
        where: { id: whatsappId, companyId }
    });

    if (!whatsapp) {
        return { synced: 0, created: 0 };
    }

    const accessToken = whatsapp.facebookAccessToken || whatsapp.token;
    const wabaId = whatsapp.whatsappAccountId;

    if (!accessToken || !wabaId) {
        return { synced: 0, created: 0 };
    }

    let synced = 0;
    let created = 0;

    try {
        const url = `https://graph.facebook.com/v20.0/${wabaId}/message_templates`;

        const response = await axios.get(url, {
            params: {
                access_token: accessToken,
                limit: 100
            }
        });

        const metaTemplates: MetaTemplate[] = response.data.data || [];

        for (const metaTemplate of metaTemplates) {
            // Check if template exists locally
            let localTemplate = await WhatsappTemplate.findOne({
                where: {
                    companyId,
                    whatsappId,
                    name: metaTemplate.name
                }
            });

            if (localTemplate) {
                // Update status
                if (localTemplate.status !== metaTemplate.status) {
                    await localTemplate.update({
                        status: metaTemplate.status,
                        metaTemplateId: metaTemplate.id
                    });
                    synced++;
                }
            } else {
                // Extract body text from components
                let bodyText = "";
                let headerType = "NONE";
                let headerContent = "";
                let footerText = "";
                let buttons: any[] = [];

                for (const component of metaTemplate.components) {
                    if (component.type === "BODY") {
                        bodyText = component.text || "";
                    } else if (component.type === "HEADER") {
                        headerType = component.format || "TEXT";
                        headerContent = component.text || "";
                    } else if (component.type === "FOOTER") {
                        footerText = component.text || "";
                    } else if (component.type === "BUTTONS") {
                        buttons = component.buttons || [];
                    }
                }

                // Create local record for template created directly in Meta
                await WhatsappTemplate.create({
                    name: metaTemplate.name,
                    category: metaTemplate.category,
                    language: metaTemplate.language,
                    status: metaTemplate.status,
                    headerType,
                    headerContent,
                    bodyText,
                    footerText,
                    buttons: buttons.length > 0 ? JSON.stringify(buttons) : null,
                    metaTemplateId: metaTemplate.id,
                    companyId,
                    whatsappId
                });
                created++;
            }
        }
    } catch (error: any) {
        console.error("Meta API Sync Error:", error.response?.data || error.message);
    }

    return { synced, created };
};

export default SyncWhatsappTemplatesService;
