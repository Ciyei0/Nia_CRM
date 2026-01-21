import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import Whatsapp from "../../models/Whatsapp";

const GetProfilePicUrl = async (
  number: string,
  companyId: number,
  whatsappId?: number
): Promise<string> => {
  let whatsapp: Whatsapp | null = null;

  if (whatsappId) {
    whatsapp = await Whatsapp.findByPk(whatsappId);
  }

  if (!whatsapp) {
    whatsapp = await GetDefaultWhatsApp(companyId);
  }

  if (whatsapp.channel === "whatsapp_cloud") {
    // Cloud API does not provide a direct way to get profile pic via this method easily found in docs yet, 
    // or requires permissions/different endpoint. For now, return default to avoid crash.
    return `${process.env.FRONTEND_URL}/nopicture.png`;
  }

  const wbot = getWbot(whatsapp.id);

  let profilePicUrl: string;
  try {
    profilePicUrl = await wbot.profilePictureUrl(`${number}@s.whatsapp.net`);
  } catch (error) {
    profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
  }

  return profilePicUrl;
};

export default GetProfilePicUrl;
