import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";

interface IOnWhatsapp {
  jid: string;
  exists: boolean;
}

const checker = async (number: string, wbot: any) => {
  const [validNumber] = await wbot.onWhatsApp(`${number}@s.whatsapp.net`);

  logger.info(validNumber);

  return validNumber;
};

const CheckContactNumber = async (
  number: string,
  companyId: number,
  whatsappId?: number
): Promise<IOnWhatsapp> => {
  let whatsapp: Whatsapp | null = null;

  if (whatsappId) {
    whatsapp = await Whatsapp.findByPk(whatsappId);
  }

  if (!whatsapp) {
    whatsapp = await GetDefaultWhatsApp(companyId);
  }

  if (whatsapp.channel === "whatsapp_cloud") {
    // Cloud API does not support onWhatsApp check in the same way, assume valid or handle differently
    return {
      jid: `${number}@s.whatsapp.net`,
      exists: true
    };
  }

  const wbot = getWbot(whatsapp.id);
  const isNumberExit = await checker(number, wbot);

  if (!isNumberExit.exists) {
    throw new Error("ERR_CHECK_NUMBER");
  }
  return isNumberExit;
};

export default CheckContactNumber;
