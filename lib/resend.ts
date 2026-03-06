import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    try {
        const data = await resend.emails.send({
            from: 'NivaasDesk <notifications@nivaasdesk.com>',
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
};
