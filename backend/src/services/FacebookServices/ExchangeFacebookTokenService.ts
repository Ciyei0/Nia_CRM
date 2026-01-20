import axios from "axios";
import AppError from "../../errors/AppError";

interface TokenExchangeResult {
    accessToken: string;
    userId: string;
    whatsappAccountId: string;
}

/**
 * Exchanges a Facebook OAuth code for a long-lived access token
 * and retrieves WhatsApp Business Account information.
 */
const ExchangeFacebookTokenService = async (
    code: string,
    redirectUri: string
): Promise<TokenExchangeResult> => {
    const appId = process.env.REACT_APP_FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
        throw new AppError("Facebook App credentials not configured", 500);
    }

    try {
        // Step 1: Exchange code for short-lived access token
        const tokenUrl = `https://graph.facebook.com/v20.0/oauth/access_token`;
        const tokenResponse = await axios.get(tokenUrl, {
            params: {
                client_id: appId,
                client_secret: appSecret,
                redirect_uri: redirectUri,
                code: code
            }
        });

        const shortLivedToken = tokenResponse.data.access_token;

        // Step 2: Exchange short-lived token for long-lived token
        const longLivedUrl = `https://graph.facebook.com/v20.0/oauth/access_token`;
        const longLivedResponse = await axios.get(longLivedUrl, {
            params: {
                grant_type: "fb_exchange_token",
                client_id: appId,
                client_secret: appSecret,
                fb_exchange_token: shortLivedToken
            }
        });

        const longLivedToken = longLivedResponse.data.access_token;

        // Step 3: Get user ID from the token
        const meUrl = `https://graph.facebook.com/v20.0/me`;
        const meResponse = await axios.get(meUrl, {
            params: { access_token: longLivedToken }
        });

        const userId = meResponse.data.id;

        // Step 4: Get WhatsApp Business Account ID
        const businessUrl = `https://graph.facebook.com/v20.0/${userId}/businesses`;
        const businessResponse = await axios.get(businessUrl, {
            params: { access_token: longLivedToken }
        });

        let whatsappAccountId = "";

        // Try to find WhatsApp Business Account
        if (businessResponse.data.data && businessResponse.data.data.length > 0) {
            const businessId = businessResponse.data.data[0].id;
            console.log(`Found Business ID: ${businessId}`);

            // 1. Try "Owned" WABAs
            const wabaUrl = `https://graph.facebook.com/v20.0/${businessId}/owned_whatsapp_business_accounts`;
            try {
                const wabaResponse = await axios.get(wabaUrl, {
                    params: { access_token: longLivedToken }
                });

                if (wabaResponse.data.data && wabaResponse.data.data.length > 0) {
                    whatsappAccountId = wabaResponse.data.data[0].id;
                    console.log(`Found Owned WABA ID: ${whatsappAccountId}`);
                } else {
                    console.log("No owned WABAs found. Checking client WABAs...");
                    // 2. Fallback to "Client" WABAs (Shared)
                    const clientWabaUrl = `https://graph.facebook.com/v20.0/${businessId}/client_whatsapp_business_accounts`;
                    const clientWabaResponse = await axios.get(clientWabaUrl, {
                        params: { access_token: longLivedToken }
                    });

                    if (clientWabaResponse.data.data && clientWabaResponse.data.data.length > 0) {
                        whatsappAccountId = clientWabaResponse.data.data[0].id;
                        console.log(`Found Client WABA ID: ${whatsappAccountId}`);
                    }
                }
            } catch (wabaError) {
                console.log("Error fetching WhatsApp Business Account:", wabaError);
            }
        } else {
            console.log("No businesses found for this user.");
        }

        return {
            accessToken: longLivedToken,
            userId,
            whatsappAccountId
        };

    } catch (error: any) {
        console.error("Facebook token exchange error:", error.response?.data || error.message);
        throw new AppError(
            error.response?.data?.error?.message || "Failed to exchange Facebook token",
            400
        );
    }
};

export default ExchangeFacebookTokenService;
