import { Request, Response } from "express";
import ImportContactsService from "../services/WbotServices/ImportContactsService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;

  try {
    await ImportContactsService(companyId);
  } catch (err) {
    return res.status(400).json({ error: "Não foi possível importar contatos. Verifique se existe uma conexão de WhatsApp padrão e conectada." });
  }

  return res.status(200).json({ message: "contacts imported" });
};
