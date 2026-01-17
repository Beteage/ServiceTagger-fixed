import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const environment = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID || 'test';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'test';

    if (process.env.NODE_ENV === 'production') {
        return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    }

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

export const client = () => {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
};
