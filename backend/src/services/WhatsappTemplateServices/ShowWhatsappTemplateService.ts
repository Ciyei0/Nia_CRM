import AppError from "../../errors/AppError";
import WhatsappTemplate from "../../models/WhatsappTemplate";
import Whatsapp from "../../models/Whatsapp";

interface Request {
    id: number;
    companyId: number;
}

const ShowWhatsappTemplateService = async ({
    id,
    companyId
}: Request): Promise<WhatsappTemplate> => {
    const template = await WhatsappTemplate.findOne({
        where: { id, companyId },
        include: [
            {
                model: Whatsapp,
                as: "whatsapp",
                attributes: ["id", "name", "number", "channel"]
            }
        ]
    });

    if (!template) {
        throw new AppError("ERR_TEMPLATE_NOT_FOUND", 404);
    }

    return template;
};

export default ShowWhatsappTemplateService;
