import emailjs from '@emailjs/browser';

// EmailJS Configuration
// TODO: Replace these with your actual EmailJS credentials from dashboard
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Template IDs - Create these templates in your EmailJS dashboard
const TEMPLATES = {
    WELCOME: import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME || '',
    BOOKING_CONFIRMATION: import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING || '',
    CHECKIN: import.meta.env.VITE_EMAILJS_TEMPLATE_CHECKIN || '',
    PAYMENT_CONFIRMATION: import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENT || '',
};

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const emailService = {
    /**
     * Send welcome email to new users
     */
    async sendWelcomeEmail(params: {
        user_name: string;
        user_email: string;
    }) {
        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                TEMPLATES.WELCOME,
                {
                    to_name: params.user_name,
                    to_email: params.user_email,
                    app_name: 'BIKERS MTB',
                },
                EMAILJS_PUBLIC_KEY
            );
            console.log('Welcome email sent:', response);
            return response;
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    },

    /**
     * Send booking confirmation email
     */
    async sendBookingConfirmation(params: {
        user_name: string;
        user_email: string;
        event_title: string;
        event_date: string;
        event_location: string;
        booking_id: string;
        participants_count: number;
        total_amount: number;
    }) {
        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                TEMPLATES.BOOKING_CONFIRMATION,
                {
                    to_name: params.user_name,
                    to_email: params.user_email,
                    event_title: params.event_title,
                    event_date: params.event_date,
                    event_location: params.event_location,
                    booking_id: params.booking_id,
                    participants_count: params.participants_count,
                    total_amount: params.total_amount,
                },
                EMAILJS_PUBLIC_KEY
            );
            console.log('Booking confirmation email sent:', response);
            return response;
        } catch (error) {
            console.error('Error sending booking confirmation:', error);
            throw error;
        }
    },

    /**
     * Send check-in notification email
     */
    async sendCheckinNotification(params: {
        user_name: string;
        user_email: string;
        event_title: string;
        event_date: string;
        checkin_time: string;
    }) {
        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                TEMPLATES.CHECKIN,
                {
                    to_name: params.user_name,
                    to_email: params.user_email,
                    event_title: params.event_title,
                    event_date: params.event_date,
                    checkin_time: params.checkin_time,
                },
                EMAILJS_PUBLIC_KEY
            );
            console.log('Check-in notification sent:', response);
            return response;
        } catch (error) {
            console.error('Error sending check-in notification:', error);
            throw error;
        }
    },

    /**
     * Send payment confirmation email
     */
    async sendPaymentConfirmation(params: {
        user_name: string;
        user_email: string;
        event_title: string;
        transaction_id: string;
        amount: number;
        payment_method: string;
        payment_date: string;
    }) {
        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                TEMPLATES.PAYMENT_CONFIRMATION,
                {
                    to_name: params.user_name,
                    to_email: params.user_email,
                    event_title: params.event_title,
                    transaction_id: params.transaction_id,
                    amount: params.amount,
                    payment_method: params.payment_method,
                    payment_date: params.payment_date,
                },
                EMAILJS_PUBLIC_KEY
            );
            console.log('Payment confirmation email sent:', response);
            return response;
        } catch (error) {
            console.error('Error sending payment confirmation:', error);
            throw error;
        }
    },
};
