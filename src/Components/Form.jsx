import React, { useState } from "react";

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        // Let Netlify handle the POST, but we can still prevent default page reload
        e.preventDefault();

        const form = e.target;

        // Create a hidden iframe to submit the form without navigating away
        const iframe = document.createElement("iframe");
        iframe.name = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        form.target = "hidden_iframe";

        // Listen for submission
        iframe.onload = () => {
            setSubmitted(true);
            document.body.removeChild(iframe);
        };

        form.submit();
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
                    onSubmit={handleSubmit}
                >
                    {/* Required for Netlify to detect the form */}
                    <input type="hidden" name="form-name" value="contact" />

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