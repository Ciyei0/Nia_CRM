import WhatsappTemplate from "../../models/WhatsappTemplate";
import Whatsapp from "../../models/Whatsapp";

interface Request {
    companyId: number;
    whatsappId?: number;
}

interface Response {
    templates: WhatsappTemplate[];
}

const ListWhatsappTemplatesService = async ({
    companyId,
    whatsappId
}: Request): Promise<Response> => {
    const whereCondition: any = {
        companyId
    };

    if (whatsappId) {
        whereCondition.whatsappId = whatsappId;
    }

    const templates = await WhatsappTemplate.findAll({
        where: whereCondition,
        include: [
            {
                model: Whatsapp,
                as: "whatsapp",
                attributes: ["id", "name", "number", "channel"]
            }
        ],
        order: [["createdAt", "DESC"]]
    });

    return { templates };
};

export default ListWhatsappTemplatesService;
