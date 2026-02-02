// Mercado Pago Payment Service
// This service handles payment preference creation using Mercado Pago SDK

const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';
const MP_ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '';

export interface PaymentPreference {
    booking_id: string;
    title: string;
    amount: number;
    payer_email: string;
    payer_name: string;
}

export const mercadopagoService = {
    /**
     * Create a payment preference and return the init_point URL
     * This uses Mercado Pago's Checkout Pro (redirect to MP)
     */
    async createPaymentPreference(params: PaymentPreference): Promise<string> {
        try {
            const preference = {
                items: [
                    {
                        title: params.title,
                        quantity: 1,
                        unit_price: params.amount,
                        currency_id: 'ARS', // Argentine Peso
                    },
                ],
                payer: {
                    name: params.payer_name,
                    email: params.payer_email,
                },
                back_urls: {
                    success: `${window.location.origin}/booking/success`,
                    failure: `${window.location.origin}/booking/failure`,
                    pending: `${window.location.origin}/booking/pending`,
                },
                auto_return: 'approved' as const,
                external_reference: params.booking_id,
                statement_descriptor: 'BIKERS MTB',
                notification_url: undefined, // Can be configured later for webhooks
            };

            // Call Mercado Pago API to create preference
            const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(preference),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Mercado Pago API Error:', error);
                throw new Error('Error al crear la preferencia de pago');
            }

            const data = await response.json();

            // Return the init_point URL where user will be redirected
            return data.init_point;
        } catch (error) {
            console.error('Error creating payment preference:', error);
            throw error;
        }
    },

    /**
     * Get payment information by payment ID
     */
    async getPaymentInfo(paymentId: string) {
        try {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener información del pago');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting payment info:', error);
            throw error;
        }
    },

    /**
     * Get the public key for frontend SDK initialization
     */
    getPublicKey(): string {
        return MP_PUBLIC_KEY;
    },
};
