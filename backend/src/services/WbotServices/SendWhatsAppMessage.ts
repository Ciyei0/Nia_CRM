import * as Sentry from "@sentry/node";
import { WAMessage } from "@whiskeysockets/baileys";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import SendWhatsAppCloudMessage from "./SendWhatsAppCloudMessage";

import formatBody from "../../helpers/Mustache";
import { map_msg } from "../../utils/global";

interface Request {
  body: string;
  ticket: Ticket;
  quotedMsg?: Message;
  isForwarded?: boolean;
}

const SendWhatsAppMessage = async ({
  body,
  ticket,
  quotedMsg,
  isForwarded = false
}: Request): Promise<WAMessage> => {
  let options = {};

  if ((!ticket.whatsapp || !ticket.whatsapp.channel) && ticket.whatsappId) {
    ticket.whatsapp = await Whatsapp.findByPk(ticket.whatsappId);
  }

  if (ticket.whatsapp && ticket.whatsapp.channel === "whatsapp_cloud") {
    // @ts-ignore
    return SendWhatsAppCloudMessage({ body, ticket, quotedMsg });
  }

  const wbot = await GetTicketWbot(ticket);


  const number = `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"
    }`;


  if (quotedMsg) {
    const chatMessages = await Message.findOne({
      where: {
        id: quotedMsg.id
      }
    });

    if (chatMessages) {
      const msgFound = JSON.parse(chatMessages.dataJson);

      options = {
        quoted: {
          key: msgFound.key,
          message: {
            extendedTextMessage: msgFound.message.extendedTextMessage
          }
        }
      };
    }

  }

  try {
    const sentMessage = await wbot.sendMessage(number, {
      text: formatBody(body, ticket.contact),
      // text: body, //formatBody(body, ticket.contact),
      contextInfo: { forwardingScore: isForwarded ? 2 : 0, isForwarded: isForwarded ? true : false }
    },
      {
        ...options
      }
    );

    await ticket.update({ lastMessage: formatBody(body, ticket.contact) });
    return sentMessage;
  } catch (err) {
    Sentry.captureException(err);
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage;
