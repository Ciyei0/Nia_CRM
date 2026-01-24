import axios from "axios";
import AppError from "../../errors/AppError";
import WhatsappTemplate from "../../models/WhatsappTemplate";
import Whatsapp from "../../models/Whatsapp";

interface Request {
    id: number;
    companyId: number;
}

const DeleteWhatsappTemplateService = async ({
    id,
    companyId
}: Request): Promise<void> => {
    const template = await WhatsappTemplate.findOne({
        where: { id, companyId }
    });

    if (!template) {
        throw new AppError("ERR_TEMPLATE_NOT_FOUND", 404);
    }

    // Try to delete from Meta API if we have the metaTemplateId
    if (template.metaTemplateId) {
        const whatsapp = await Whatsapp.findByPk(template.whatsappId);

        if (whatsapp) {
            const accessToken = whatsapp.facebookAccessToken || whatsapp.token;
            const wabaId = whatsapp.whatsappAccountId;

            if (accessToken && wabaId) {
                try {
                    const url = `https://graph.facebook.com/v20.0/${wabaId}/message_templates`;

                    await axios.delete(url, {
                        params: {
                            name: template.name,
                            access_token: accessToken
                        }
                    });
                } catch (error: any) {
                    console.error("Meta API Delete Error:", error.response?.data || error.message);
                    // Continue to delete locally even if Meta API fails
                }
            }
        }
    }

    // Delete local record
    await template.destroy();
};

export default DeleteWhatsappTemplateService;
