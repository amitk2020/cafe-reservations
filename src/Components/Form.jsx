import React, { useState } from "react";

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const data = new FormData(form);

        // Encode the form data for Netlify
        const encodedData = new URLSearchParams(data).toString();

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encodedData,
        })
            .then(() => setSubmitted(true))
            .catch((err) => alert("Error submitting form: " + err));
    };

    return (
        <div className="reservation-form">
            {submitted ? (
                <p className="text-green-600 font-bold">
                    ✅ Thanks! Your message has been sent.
                </p>
            ) : (
                <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    className="reservation-form"
                    onSubmit={handleSubmit}
                >
                    {/* Hidden input for Netlify to detect the form */}
                    <input type="hidden" name="form-name" value="contact" />

                    {/* Honeypot field */}
                    <p hidden>
                        <label>
                            Don’t fill this out if you’re human: <input name="bot-field" />
                        </label>
                    </p>

                    <p>
                        <label>
                            Name <input type="text" name="name" required />
                        </label>
                    </p>
                    <p>
                        <label>
                            Email <input type="email" name="email" required />
                        </label>
                    </p>
                    <p>
                        <button type="submit">Send</button>
                    </p>
                </form>
            )}
        </div>
    );
};

export default ContactForm;