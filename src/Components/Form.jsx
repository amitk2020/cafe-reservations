import React from "react";

const ContactForm = () => {
    return (
        <div className="reservation-form">
            <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
            >
                {/* This hidden input is required for Netlify to detect the form */}
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
        </div>
    );
};

export default ContactForm;