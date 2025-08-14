import { createClient } from '@supabase/supabase-js';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    url: 'https://api.mailgun.net'
});

export async function handler(event) {
    try {
        // 1️⃣ Check API key
        const apiKey = event.headers['x-api-key'];
        if (apiKey !== process.env.RESERVATION_API_KEY) {
            return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
        }

        const data = JSON.parse(event.body);

        // Optional: Add reCAPTCHA verification here if you have the token
        // const token = data.token;

        // 2️⃣ Insert into Supabase
        const { error } = await supabase.from('cafe_reservations').insert({
            name: data.name,
            email: data.email,
            date: data.date,
            time: data.time,
            phone: data.phone,
            guests: data.guests,
            requests: data.requests
        });

        if (error) throw error;

        // 3️⃣ Send email to admin
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.FROM_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Reservation',
            text: `New reservation:\nName: ${data.name}\nEmail: ${data.email}\nDate: ${data.date}\nTime: ${data.time}\nPhone: ${data.phone}\nGuests: ${data.guests}\nRequests: ${data.requests}`
        });

        // 4️⃣ Send confirmation to customer
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.FROM_EMAIL,
            to: data.email,
            subject: 'Reservation Confirmed',
            text: `Hello ${data.name},\nYour reservation for ${data.date} at ${data.time} is confirmed.\nSee you soon!`
        });

        return { statusCode: 200, body: JSON.stringify({ message: 'Reservation successful!' }) };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
}