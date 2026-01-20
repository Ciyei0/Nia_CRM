import axios from "axios";
import fs from "fs";
import path from "path";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";

interface Request {
    mediaId: string;
    whatsapp: Whatsapp;
}

const DownloadWhatsAppMedia = async ({ mediaId, whatsapp }: Request): Promise<string> => {
    try {
        if (!whatsapp.facebookAccessToken) {
            throw new Error("No Facebook Access Token found for this connection.");
        }

        // 1. Get Media URL
        const metadataUrl = `https://graph.facebook.com/v18.0/${mediaId}`;
        const metadataResponse = await axios.get(metadataUrl, {
            headers: {
                Authorization: `Bearer ${whatsapp.facebookAccessToken}`
            }
        });

        const mediaUrl = metadataResponse.data.url;
        const mimeType = metadataResponse.data.mime_type;
        const extension = mimeType.split("/")[1].split(";")[0]; // e.g., image/jpeg -> jpeg

        // 2. Download Media
        const mediaResponse = await axios.get(mediaUrl, {
            responseType: "stream",
            headers: {
                Authorization: `Bearer ${whatsapp.facebookAccessToken}`
            }
        });

        // 3. Save to Disk
        const fileName = `${mediaId}-${new Date().getTime()}.${extension}`;
        const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");
        const filePath = path.join(publicFolder, fileName);

        const writer = fs.createWriteStream(filePath);

        mediaResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(fileName));
            writer.on("error", reject);
        });

    } catch (err: any) {
        logger.error(`Error downloading media from Cloud API: ${err.message}`);
        throw new Error("ERR_DOWNLOAD_MEDIA_CLOUD");
    }
};

export default DownloadWhatsAppMedia;
