import React, { useState } from "react";

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch("/", {
            method: "POST",
            body: formData,
        })
            .then(() => setSubmitted(true))
            .catch((error) => alert(error));
    };

    if (submitted) {
        return <p className="text-green-600">✅ Thanks! Your message has been sent.</p>;
    }

    return (
        <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
        >
            <input type="hidden" name="form-name" value="contact" />

            <p hidden>
                <label>
                    Don’t fill this out: <input name="bot-field" />
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
    );
};

export default ContactForm;