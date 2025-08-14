import { useState } from "react";
import "./App.css"; // Your CSS file

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    phone: "",
    guests: 1,
    requests: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: "Submitting...", ok: null });

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
        setForm({
          name: "",
          email: "",
          date: "",
          time: "",
          phone: "",
          guests: 1,
          requests: ""
        });
      } else {
        setStatus({ msg: data.error || "Submission failed.", ok: false });
      }
    } catch (err) {
      setStatus({ msg: "Network error. Try again.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container">
      <h2>Cafe Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={today}
            required
          />
        </label>

        <label>
          Time
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            min="08:00"
            max="22:00"
            required
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Number of Guests
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            min="1"
            max="20"
            required
          />
        </label>

        <label>
          Special Requests
          <textarea
            name="requests"
            value={form.requests}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Reserve"}
        </button>
      </form>

      {status && (
        <p
          className={`status-message ${status.ok === true ? "success" : status.ok === false ? "error" : ""
            }`}
        >
          {status.msg}
        </p>
      )}
    </div>
  );
}