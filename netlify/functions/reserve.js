import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { error } = await supabase
      .from('cafe_reservations')
      .insert({
        name: data.name,
        email: data.email,
        date: data.date,
        time: data.time
      });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Reservation successful!' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}