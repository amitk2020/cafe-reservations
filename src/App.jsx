import { useState } from "react";
import "./App.css"; // We'll create this CSS file

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: "Submitting...", ok: null });
    const apiKey = import.meta.env.RESERVATION_API_KEY;
    try {
      const res = await fetch("/.netlify/functions/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ msg: data.message, ok: true });
        e.target.reset();
      } else {
        setStatus({ msg: data.error || "Submission failed.", ok: false });
      }
    } catch (err) {
      setStatus({ msg: "Network error. Try again.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Cafe Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Time
          <input type="time" name="time" value={form.time} onChange={handleChange} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Reserve"}
        </button>
      </form>

      {status && (
        <p className={`status-message ${status.ok === true ? "success" : status.ok === false ? "error" : ""}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}