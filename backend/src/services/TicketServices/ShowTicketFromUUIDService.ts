import Ticket from "../../models/Ticket";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Queue from "../../models/Queue";
import Tag from "../../models/Tag";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketUUIDService = async (uuid: string): Promise<Ticket> => {
  let ticket: Ticket | null = null;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  
  if (uuidRegex.test(uuid)) {
    try {
      ticket = await Ticket.findOne({
        where: {
          uuid
        },
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "name", "number", "email", "profilePicUrl"],
            include: ["extraInfo"]
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name"]
          },
          {
            model: Queue,
            as: "queue",
            attributes: ["id", "name", "color"]
          },
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name"]
          },
          {
            model: Tag,
            as: "tags",
            attributes: ["id", "name", "color"]
          }
        ]
      });
    } catch (e) {
      // Ignore if database rejects the UUID format
    }
  } 

  if (!ticket) {
    // Fallback: try searching by numeric id, since sometimes the frontend navigates by id instead of uuid
    if (!isNaN(Number(uuid))) {
       ticket = await Ticket.findOne({
        where: {
          id: uuid
        },
        include: [
          {
            model: Contact,
            as: "contact",
            attributes: ["id", "name", "number", "email", "profilePicUrl"],
            include: ["extraInfo"]
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name"]
          },
          {
            model: Queue,
            as: "queue",
            attributes: ["id", "name", "color"]
          },
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name"]
          },
          {
            model: Tag,
            as: "tags",
            attributes: ["id", "name", "color"]
          }
        ]
      });
    }
  }

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketUUIDService;
