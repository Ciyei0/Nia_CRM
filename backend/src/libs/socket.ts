import { Server as SocketIO } from "socket.io";
import { Server } from "http";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import User from "../models/User";
import Queue from "../models/Queue";
import Ticket from "../models/Ticket";
import { verify } from "jsonwebtoken";
import crypto from "crypto";
import { CounterManager } from "./counter";

// Supabase JWKS public key for ES256 JWT verification
const supabaseJwk = {
  alg: "ES256", crv: "P-256", kty: "EC",
  x: "0M7-DAkDn6jZhUEy97JMNbvHRKwdqryvNn-llHfEdlQ",
  y: "3ATQIXByx9I2AK5FCvNtfWpoQBxPZfndPUVs24hJxPk"
};
const supabasePublicKey = crypto.createPublicKey({ key: supabaseJwk, format: "jwk" })
  .export({ type: "spki", format: "pem" }) as string;

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, "https://niacrmbot.com", "https://www.niacrmbot.com"]
        : ["https://niacrmbot.com", "https://www.niacrmbot.com"]
    }
  });

  io.on("connection", async socket => {
    logger.info("Client Connected");
    const { token } = socket.handshake.query;
    let tokenData = null;
    try {
      tokenData = verify(token as string, supabasePublicKey, { algorithms: ["ES256"] });
      logger.debug(tokenData, "io-onConnection: tokenData");
    } catch (error) {
      logger.warn(`[libs/socket.ts] Error decoding token: ${error?.message}`);
      socket.disconnect();
      return io;
    }
    const counters = new CounterManager();

    let user: User = null;

    // Supabase JWTs use 'email' to identify the user, not 'id'.
    // Look up the local user by their email, matching what isAuth.ts does.
    const userEmail = (tokenData as any).email;

    if (userEmail) {
      user = await User.findOne({ where: { email: userEmail }, include: [Queue] });
      if (user) {
        user.online = true;
        await user.save();
      } else {
        logger.info(`onConnect: User with email ${userEmail} not found`);
        socket.disconnect();
        return io;
      }
    } else {
      // Fallback: legacy token with 'id' field
      const legacyId = (tokenData as any).id;
      if (legacyId && legacyId !== "undefined" && legacyId !== "null") {
        user = await User.findByPk(legacyId, { include: [Queue] });
        if (user) {
          user.online = true;
          await user.save();
        } else {
          logger.info(`onConnect: User ${legacyId} not found`);
          socket.disconnect();
          return io;
        }
      } else {
        logger.info("onConnect: Missing userId or email in token");
        socket.disconnect();
        return io;
      }
    }

    socket.join(`company-${user.companyId}-mainchannel`);
    socket.join(`user-${user.id}`);

    socket.on("joinChatBox", async (ticketId: string) => {
      if (!ticketId || ticketId === "undefined") {
        return;
      }
      Ticket.findByPk(ticketId).then(
        (ticket) => {
          if (ticket && ticket.companyId === user.companyId
            && (ticket.userId === user.id || user.profile === "admin")) {
            let c: number;
            if ((c = counters.incrementCounter(`ticket-${ticketId}`)) === 1) {
              socket.join(ticketId);
            }
            logger.debug(`joinChatbox[${c}]: Channel: ${ticketId} by user ${user.id}`)
          } else {
            logger.info(`Invalid attempt to join channel of ticket ${ticketId} by user ${user.id}`)
          }
        },
        (error) => {
          logger.error(error, `Error fetching ticket ${ticketId}`);
        }
      );
    });

    socket.on("leaveChatBox", async (ticketId: string) => {
      if (!ticketId || ticketId === "undefined") {
        return;
      }

      let c: number;
      // o último que sair apaga a luz

      if ((c = counters.decrementCounter(`ticket-${ticketId}`)) === 0) {
        socket.leave(ticketId);
      }
      logger.debug(`leaveChatbox[${c}]: Channel: ${ticketId} by user ${user.id}`)
    });

    socket.on("joinNotification", async () => {
      let c: number;
      if ((c = counters.incrementCounter("notification")) === 1) {
        if (user.profile === "admin") {
          socket.join(`company-${user.companyId}-notification`);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} joined queue ${queue.id} channel.`);
            socket.join(`queue-${queue.id}-notification`);
          });
          if (user.allTicket === "enabled") {
            socket.join("queue-null-notification");
          }

        }
      }
      logger.debug(`joinNotification[${c}]: User: ${user.id}`);
    });

    socket.on("leaveNotification", async () => {
      let c: number;
      if ((c = counters.decrementCounter("notification")) === 0) {
        if (user.profile === "admin") {
          socket.leave(`company-${user.companyId}-notification`);
        } else {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} leaved queue ${queue.id} channel.`);
            socket.leave(`queue-${queue.id}-notification`);
          });
          if (user.allTicket === "enabled") {
            socket.leave("queue-null-notification");
          }
        }
      }
      logger.debug(`leaveNotification[${c}]: User: ${user.id}`);
    });

    socket.on("joinTickets", (status: string) => {
      if (counters.incrementCounter(`status-${status}`) === 1) {
        if (user.profile === "admin") {
          logger.debug(`Admin ${user.id} of company ${user.companyId} joined ${status} tickets channel.`);
          socket.join(`company-${user.companyId}-${status}`);
        } else if (status === "pending") {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} joined queue ${queue.id} pending tickets channel.`);
            socket.join(`queue-${queue.id}-pending`);
          });
          if (user.allTicket === "enabled") {
            socket.join("queue-null-pending");
          }
        } else {
          logger.debug(`User ${user.id} cannot subscribe to ${status}`);
        }
      }
    });

    socket.on("leaveTickets", (status: string) => {
      if (counters.decrementCounter(`status-${status}`) === 0) {
        if (user.profile === "admin") {
          logger.debug(`Admin ${user.id} of company ${user.companyId} leaved ${status} tickets channel.`);
          socket.leave(`company-${user.companyId}-${status}`);
        } else if (status === "pending") {
          user.queues.forEach((queue) => {
            logger.debug(`User ${user.id} of company ${user.companyId} leaved queue ${queue.id} pending tickets channel.`);
            socket.leave(`queue-${queue.id}-pending`);
          });
          if (user.allTicket === "enabled") {
            socket.leave("queue-null-pending");
          }
        }
      }
    });

    socket.emit("ready");
  });
  return io;
};

export const getIO = (): SocketIO => {
  if (!io) {
    throw new AppError("Socket IO not initialized");
  }
  return io;
};
