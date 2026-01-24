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
}: Request): Promise<{ synced: number; created: number; error?: string }> => {
    const whatsapp = await Whatsapp.findOne({
        where: { id: whatsappId, companyId }
    });

    if (!whatsapp) {
        console.log("SyncTemplates: WhatsApp connection not found", { whatsappId, companyId });
        return { synced: 0, created: 0, error: "Conexión no encontrada" };
    }

    const accessToken = whatsapp.facebookAccessToken || whatsapp.token;
    const wabaId = whatsapp.whatsappAccountId;

    console.log("SyncTemplates: Checking credentials", {
        hasAccessToken: !!accessToken,
        wabaId,
        whatsappName: whatsapp.name
    });

    if (!accessToken || !wabaId) {
        console.log("SyncTemplates: Missing credentials");
        return { synced: 0, created: 0, error: "Faltan credenciales de Meta (Access Token o WABA ID)" };
    }

    let synced = 0;
    let created = 0;

    try {
        // First, try to get the real WABA ID from the Phone Number ID
        // The whatsappAccountId might be a Phone Number ID, not the WABA ID
        let realWabaId = wabaId;

        try {
            console.log("SyncTemplates: Checking if ID is Phone Number ID or WABA ID...");
            const phoneInfoUrl = `https://graph.facebook.com/v20.0/${wabaId}?fields=id,display_phone_number,verified_name`;

            const phoneInfoResponse = await axios.get(phoneInfoUrl, {
                params: { access_token: accessToken }
            });

            // If it has display_phone_number, it's a Phone Number ID, we need to get WABA ID
            if (phoneInfoResponse.data.display_phone_number) {
                console.log("SyncTemplates: Detected Phone Number ID, fetching WABA ID...");

                // Get the WABA ID from phone number
                const wabaUrl = `https://graph.facebook.com/v20.0/${wabaId}?fields=whatsapp_business_account`;
                const wabaResponse = await axios.get(wabaUrl, {
                    params: { access_token: accessToken }
                });

                if (wabaResponse.data.whatsapp_business_account?.id) {
                    realWabaId = wabaResponse.data.whatsapp_business_account.id;
                    console.log("SyncTemplates: Found WABA ID:", realWabaId);
                }
            }
        } catch (phoneError: any) {
            // If query fails, assume the ID is already a WABA ID
            console.log("SyncTemplates: Could not determine ID type, using as WABA ID");
        }

        const url = `https://graph.facebook.com/v20.0/${realWabaId}/message_templates`;

        console.log("SyncTemplates: Fetching from Meta API", { url, realWabaId });

        const response = await axios.get(url, {
            params: {
                access_token: accessToken,
                limit: 100
            }
        });

        console.log("SyncTemplates: Meta API Response", {
            templateCount: response.data?.data?.length || 0
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

                for (const component of metaTemplate.components || []) {
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
                    bodyText: bodyText || "Contenido no disponible",
                    footerText,
                    buttons: buttons.length > 0 ? JSON.stringify(buttons) : null,
                    metaTemplateId: metaTemplate.id,
                    companyId,
                    whatsappId
                });
                created++;
                console.log("SyncTemplates: Created template", { name: metaTemplate.name });
            }
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error("SyncTemplates: Meta API Error", {
            error: errorMessage,
            errorCode: error.response?.data?.error?.code,
            errorType: error.response?.data?.error?.type
        });
        return { synced, created, error: errorMessage };
    }

    return { synced, created };
};

export default SyncWhatsappTemplatesService;
