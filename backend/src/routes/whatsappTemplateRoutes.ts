import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as WhatsappTemplateController from "../controllers/WhatsappTemplateController";

const whatsappTemplateRoutes = Router();

whatsappTemplateRoutes.get(
    "/whatsapp-templates",
    isAuth,
    WhatsappTemplateController.index
);

whatsappTemplateRoutes.post(
    "/whatsapp-templates",
    isAuth,
    WhatsappTemplateController.store
);

whatsappTemplateRoutes.get(
    "/whatsapp-templates/:id",
    isAuth,
    WhatsappTemplateController.show
);

whatsappTemplateRoutes.delete(
    "/whatsapp-templates/:id",
    isAuth,
    WhatsappTemplateController.remove
);

whatsappTemplateRoutes.post(
    "/whatsapp-templates/sync",
    isAuth,
    WhatsappTemplateController.sync
);

export default whatsappTemplateRoutes;
