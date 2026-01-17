import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

router.post('/', async (req, res) => {
    if (!WEBHOOK_SECRET) {
        console.error('LEMONSQUEEZY_WEBHOOK_SECRET not set');
        return res.status(500).send('Server configuration error');
    }

    try {
        const rawBody = (req as any).rawBody;
        const signature = req.get('X-Signature') || '';

        if (!rawBody) {
            console.error('Raw body not available for signature verification');
            return res.status(400).send('Raw body missing');
        }

        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error('Invalid Lemon Squeezy signature');
            return res.status(401).send('Invalid signature');
        }

        const event = JSON.parse(rawBody.toString());
        const eventName = event.meta.event_name;
        const data = event.data;

        console.log('Received Lemon Squeezy event:', eventName);

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const userId = event.meta.custom_data.user_id;
            const customerId = data.attributes.customer_id;
            const subscriptionId = data.id;
            const status = data.attributes.status;

            if (userId) {
                // Find user's tenant
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    await prisma.tenant.update({
                        where: { id: user.tenantId },
                        data: {
                            subscriptionStatus: status, // active, past_due, etc.
                            lemonSqueezyCustomerId: String(customerId),
                            lemonSqueezySubscriptionId: String(subscriptionId)
                        }
                    });
                    console.log(`Updated subscription for user ${userId} (Tenant ${user.tenantId}) to ${status}`);
                } else {
                    console.warn(`User ID ${userId} not found in webhook data`);
                }
            }
        } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const userId = event.meta.custom_data.user_id;
            if (userId) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    await prisma.tenant.update({
                        where: { id: user.tenantId },
                        data: {
                            subscriptionStatus: 'cancelled'
                        }
                    });
                    console.log(`Cancelled subscription for user ${userId}`);
                }
            }
        }

        res.send('Webhook received');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Webhook processing failed');
    }
});

export default router;
