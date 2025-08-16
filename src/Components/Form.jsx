import React from 'react'

const ContactForm = () => {
    return (
        <div className='reservation-form'>
            <form name="contact" method='post' netlify>
                <p>
                    <label>Name <input type="text" name="name" /></label>
                </p>
                <p>
                    <label>Email <input type="email" name="email" /></label>
                </p>
                <p>
                    <button type="submit">Send</button>
                </p>
            </form>
        </div>
    )
}

export default ContactForm