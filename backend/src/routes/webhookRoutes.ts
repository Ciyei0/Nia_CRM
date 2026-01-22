import { Router, Request, Response } from "express";
import axios from "axios";
import * as WebhookController from "../controllers/WebhookController";

const webhookRoutes = Router();

// Facebook/WhatsApp Cloud API Webhook verification (GET)
webhookRoutes.get("/webhook/whatsapp", WebhookController.verify);

// Facebook/WhatsApp Cloud API Webhook messages (POST)
webhookRoutes.post("/webhook/whatsapp", WebhookController.receive);

// Debug endpoint to test n8n connectivity
webhookRoutes.get("/webhook/test-n8n", async (req: Request, res: Response) => {
    const testUrl = req.query.url as string;

    if (!testUrl) {
        return res.status(400).json({ error: "URL parameter required. Use ?url=YOUR_N8N_URL" });
    }

    console.log(`Testing connectivity to: ${testUrl}`);
    const startTime = Date.now();

    try {
        const response = await axios.post(testUrl, { test: "connectivity_test", timestamp: new Date().toISOString() }, {
            headers: { "Content-Type": "application/json" },
            timeout: 30000
        });

        const elapsed = Date.now() - startTime;
        return res.json({
            success: true,
            statusCode: response.status,
            responseData: response.data,
            elapsedMs: elapsed,
            message: "N8N webhook is reachable from this server!"
        });
    } catch (error: any) {
        const elapsed = Date.now() - startTime;

        if (error.response) {
            return res.json({
                success: false,
                statusCode: error.response.status,
                responseData: error.response.data,
                elapsedMs: elapsed,
                message: "N8N responded with error"
            });
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return res.json({
                success: false,
                error: "TIMEOUT",
                elapsedMs: elapsed,
                message: "Connection timed out - N8N server not reachable or too slow"
            });
        } else {
            return res.json({
                success: false,
                error: error.code || error.message,
                elapsedMs: elapsed,
                message: `Connection failed: ${error.message}`
            });
        }
    }
});

export default webhookRoutes;
