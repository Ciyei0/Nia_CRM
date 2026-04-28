import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";
import Company from "./models/Company";
import { startQueueProcess } from "./queues";
import { TransferTicketQueue } from "./wbotTransferTicketQueue";
import cron from "node-cron";

const server = app.listen(process.env.PORT, async () => {
  try {
    const companies = await Company.findAll();
    
    // Start sessions in background to avoid blocking server startup
    // and handle individual failures gracefully
    companies.forEach(c => {
      StartAllWhatsAppsSessions(c.id).catch(err => {
        logger.error(`Error starting sessions for company ${c.id}:`, err);
      });
    });

    startQueueProcess();
    logger.info(`Server started on port: ${process.env.PORT}`);
  } catch (error) {
    logger.error("Critical error during server startup:", error);
    process.exit(1);
  }
});

process.on("uncaughtException", err => {
  logger.error(`${new Date().toUTCString()} uncaughtException:`, err.message);
  logger.error(err.stack);
  // Remove process.exit(1); to avoid abrupt shutdowns
});

process.on("unhandledRejection", (reason, p) => {
  logger.error(`${new Date().toUTCString()} unhandledRejection:`, reason, p);
  // Remove process.exit(1); to avoid abrupt shutdowns
});

cron.schedule("* * * * *", async () => {
  try {
    logger.info(`Serviço de transferência de tickets iniciado`);
    await TransferTicketQueue();
  } catch (error) {
    logger.error("Error in cron job:", error);
  }
});

initIO(server);

// Configure graceful shutdown to handle all outstanding promises
gracefulShutdown(server, {
  signals: "SIGINT SIGTERM",
  timeout: 30000, // 30 seconds
  onShutdown: async () => {
    logger.info("Gracefully shutting down...");
    // Add any other cleanup code here, if necessary
  },
  finally: () => {
    logger.info("Server shutdown complete.");
  }
});
