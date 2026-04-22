import * as Sentry from "@sentry/node";
import { WAMessage, proto } from "@whiskeysockets/baileys";
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
  options?: any;
}

const SendWhatsAppMessage = async ({
  body,
  ticket,
  quotedMsg,
  isForwarded = false,
  options
}: Request): Promise<WAMessage> => {
  let wbotOptions = {};

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

      wbotOptions = {
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
    let content: any = {
      text: formatBody(body, ticket.contact),
      contextInfo: { forwardingScore: isForwarded ? 2 : 0, isForwarded: isForwarded ? true : false }
    };

    if (options) {
      if (options.items) {
        // Chatwoot style interactive buttons
        let buttons = [];
        
        if (options.items.length <= 3) {
          buttons = options.items.map((item: any, index: number) => ({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: item.title,
              id: String(item.value || `btn_${index}`)
            })
          }));
        } else {
          buttons = [{
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: options.menuTitle || "Seleccionar opción",
              sections: [{
                title: "Opciones disponibles",
                rows: options.items.map((item: any, index: number) => ({
                  title: item.title,
                  id: String(item.value || `btn_${index}`)
                }))
              }]
            })
          }];
        }

        content = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({ text: formatBody(body, ticket.contact) }),
                footer: proto.Message.InteractiveMessage.Footer.create({ text: "NiaCRM" }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: options.menuTitle ? options.menuTitle : "Opciones",
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: buttons
                })
              })
            }
          }
        };
      } else {
        // Merge any other options (like standard listMessage, etc) directly into content or wbotOptions
        Object.assign(content, options);
      }
    }

    const sentMessage = await wbot.sendMessage(number, content, wbotOptions);

    await ticket.update({ lastMessage: formatBody(body, ticket.contact) });
    return sentMessage;
  } catch (err) {
    Sentry.captureException(err);
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage;
