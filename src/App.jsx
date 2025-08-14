import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/.netlify/functions/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Café Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Time</label>
        <input type="time" name="time" value={form.time} onChange={handleChange} required />

        <button type="submit">Reserve</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}