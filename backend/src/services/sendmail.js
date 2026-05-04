import nodemailer from 'nodemailer';

async function enviarEmail(from, to, subject, html) {
    try {
        if (!process.env.EMAIL_SEND || !process.env.EMAIL_PASSWORD) {
            throw new Error('Missing EMAIL_SEND or EMAIL_PASSWORD environment variables.');
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT ?? 587),
            secure: String(process.env.EMAIL_SECURE ?? 'false') === 'true',
            requireTLS: true,
            connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT ?? 15000),
            auth: {
                user: process.env.EMAIL_SEND,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.verify();

        await transporter.sendMail({
            from: `"${from}" <${process.env.EMAIL_SEND}>`,
            to,
            subject,
            html,
        });

        return true;
    } catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        return false;
    }
}

export default enviarEmail;