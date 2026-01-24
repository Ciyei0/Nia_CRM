import { Request, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";

import ListWhatsappTemplatesService from "../services/WhatsappTemplateServices/ListWhatsappTemplatesService";
import CreateWhatsappTemplateService from "../services/WhatsappTemplateServices/CreateWhatsappTemplateService";
import ShowWhatsappTemplateService from "../services/WhatsappTemplateServices/ShowWhatsappTemplateService";
import DeleteWhatsappTemplateService from "../services/WhatsappTemplateServices/DeleteWhatsappTemplateService";
import SyncWhatsappTemplatesService from "../services/WhatsappTemplateServices/SyncWhatsappTemplatesService";

type IndexQuery = {
    whatsappId?: string;
};

type StoreData = {
    name: string;
    category: string;
    language: string;
    headerType?: string;
    headerContent?: string;
    bodyText: string;
    footerText?: string;
    buttons?: any[];
    whatsappId: number;
};

type SyncData = {
    whatsappId: number;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
    const { companyId } = req.user;
    const { whatsappId } = req.query as IndexQuery;

    const { templates } = await ListWhatsappTemplatesService({
        companyId,
        whatsappId: whatsappId ? parseInt(whatsappId, 10) : undefined
    });

    return res.json({ templates });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
    const { companyId } = req.user;
    const data = req.body as StoreData;

    const schema = Yup.object().shape({
        name: Yup.string().required("Template name is required"),
        category: Yup.string().required("Category is required"),
        language: Yup.string().required("Language is required"),
        bodyText: Yup.string().required("Body text is required"),
        whatsappId: Yup.number().required("WhatsApp connection is required")
    });

    try {
        await schema.validate(data);
    } catch (err: any) {
        throw new AppError(err.message);
    }

    const template = await CreateWhatsappTemplateService({
        ...data,
        companyId
    });

    const io = getIO();
    io.to(`company-${companyId}-mainchannel`).emit(`company-${companyId}-whatsapptemplate`, {
        action: "create",
        template
    });

    return res.status(200).json(template);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { companyId } = req.user;

    const template = await ShowWhatsappTemplateService({
        id: parseInt(id, 10),
        companyId
    });

    return res.status(200).json(template);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { companyId } = req.user;

    await DeleteWhatsappTemplateService({
        id: parseInt(id, 10),
        companyId
    });

    const io = getIO();
    io.to(`company-${companyId}-mainchannel`).emit(`company-${companyId}-whatsapptemplate`, {
        action: "delete",
        id
    });

    return res.status(200).json({ message: "Template deleted" });
};

export const sync = async (req: Request, res: Response): Promise<Response> => {
    const { companyId } = req.user;
    const { whatsappId } = req.body as SyncData;

    if (!whatsappId) {
        throw new AppError("WhatsApp connection is required");
    }

    const result = await SyncWhatsappTemplatesService({
        companyId,
        whatsappId
    });

    const io = getIO();
    io.to(`company-${companyId}-mainchannel`).emit(`company-${companyId}-whatsapptemplate`, {
        action: "sync"
    });

    return res.status(200).json({
        message: `Synced ${result.synced} templates, created ${result.created} new`,
        ...result
    });
};
