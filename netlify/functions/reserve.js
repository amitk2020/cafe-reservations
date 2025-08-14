import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM_EMAIL = process.env.FROM_EMAIL; // e.g., "Cafe Bookings <bookings@yourdomain.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // your email

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);

        // Insert into Supabase
        const { error } = await supabase.from('cafe_reservations').insert({
            name: data.name,
            email: data.email,
            phone: data.phone,
            guests: data.guests ? parseInt(data.guests) : null,
            date: data.date,
            time: data.time,
            requests: data.requests
        });

        if (error) throw error;

        // Send email to admin
        await sendMail({
            to: ADMIN_EMAIL,
            subject: `New Cafe Reservation from ${data.name}`,
            html: `
                <p><b>Name:</b> ${data.name}</p>
                <p><b>Email:</b> ${data.email}</p>
                <p><b>Phone:</b> ${data.phone}</p>
                <p><b>Guests:</b> ${data.guests}</p>
                <p><b>Date:</b> ${data.date}</p>
                <p><b>Time:</b> ${data.time}</p>
                <p><b>Requests:</b> ${data.requests || "-"}</p>
            `
        });

        // Send confirmation email to customer
        await sendMail({
            to: data.email,
            subject: 'Your Cafe Reservation Confirmation',
            html: `
        <p>Hi ${data.name},</p>
        <p>Thank you for reserving a table with us!</p>
        <p><b>Date:</b> ${data.date}</p>
        <p><b>Time:</b> ${data.time}</p>
        <p>We look forward to seeing you at the cafe.</p>
      `
        });

        return { statusCode: 200, body: JSON.stringify({ message: 'Reservation successful! Confirmation sent.' }) };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: 'Reservation failed. Try again later.' }) };
    }
}

async function sendMail({ to, subject, html }) {
    const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
    const form = new URLSearchParams({
        from: FROM_EMAIL,
        to,
        subject,
        html
    });

    const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: form
    });

    if (!res.ok) console.error('Mailgun error:', await res.text());
}