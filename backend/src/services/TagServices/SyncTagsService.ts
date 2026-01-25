import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";
import TicketTag from "../../models/TicketTag";
import { getIO } from "../../libs/socket";

interface Request {
  tags: Tag[];
  ticketId: number;
}

const SyncTags = async ({
  tags,
  ticketId
}: Request): Promise<Ticket | null> => {
  const ticket = await Ticket.findByPk(ticketId, { include: [Tag] });

  if (!ticket) {
    throw new Error("ERR_NO_TICKET_FOUND");
  }

  // Validar que tags sea un array
  if (!tags || !Array.isArray(tags)) {
    return ticket;
  }

  const tagList = tags.map(t => {
    // Soportar tanto { id: 1 } como simplemente 1
    const tagId = typeof t === 'number' ? t : t.id;
    return { tagId, ticketId };
  }).filter(t => t.tagId); // Filtrar entradas inválidas

  await TicketTag.destroy({ where: { ticketId } });

  if (tagList.length > 0) {
    await TicketTag.bulkCreate(tagList);
  }

  await ticket.reload();

  const io = getIO();
  io.to(ticket.status)
    .to("notification")
    .to(ticketId.toString())
    .emit(`company-${ticket.companyId}-ticket`, {
      action: "update",
      ticket
    });

  return ticket;
};

export default SyncTags;
