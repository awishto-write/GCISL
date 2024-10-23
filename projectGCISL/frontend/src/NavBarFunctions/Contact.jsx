import React, { useState } from 'react';
import './Contact.css'; // Ensure the CSS styles remain consistent

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const formActionURL = `https://docs.google.com/forms/d/e/1FAIpQLSdrUD-KPmCrbfCmZd5qau1EgFFrsLAFiFN7ITeOTA-YcQDRhA/formResponse`;

    const data = new FormData();
    data.append('entry.1653249143', event.target.user_name.value);  // For Name
    data.append('entry.345674368', event.target.user_email.value); // For Email Address
    data.append('entry.2077810956', event.target.user_phone.value); // For Phone Number
    data.append('entry.1274324805', event.target.message.value);    // For Message

    fetch(formActionURL, {
      method: 'POST',
      mode: 'no-cors',  // 'no-cors' allows submission without a response from Google
      body: data
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);

         // Reset the form after 5 seconds
        setTimeout(() => {
          setSuccess(false); // Hide success message
          event.target.reset(); // Reset the form fields
        }, 5000);  // Adjust this timeout value to control the delay
      })
      .catch(() => {
        setLoading(false);
        alert('The form service is temporarily unavailable.');
      });
  };

  return (
    <section id="contact">
      <div className="section__container">
        <div className="section__row">
          <div className="contact__wrapper">
            {/* Left Side - Static Info */}
            <div className="contact__half contact__left">
              <h3 className="contact__title">Contact us!</h3>
              <p className="contact__para">
                Have questions or suggestions?<br />
                Please fill in this form to let our team know.<br />
                We highly value your input.
              </p>

              {/* Visual separator */}
              <div className="separator"></div>

              {/* Staff Contact Information */}
              <div className="staff__info-background">
                <div className="staff__info">
                  <div className="staff__member">
                    <img src={`${process.env.PUBLIC_URL}/darcie_Image.png`} alt="Darcie Bagott" className="staff__image" />
                    <div>
                      <p>Darcie Bagott</p>
                      <span>Program Specialist</span>
                      <a href="mailto:darcie.bagott@wsu.edu">darcie.bagott@wsu.edu</a> {/* Clickable email */}
                      <p>(509) 335-6387</p>
                    </div>
                  </div>
                  <div className="staff__member">
                    <img src={`${process.env.PUBLIC_URL}/cory_Image.png`} alt="Cory Bolkan" className="staff__image" />
                    <div>
                      <p>Cory Bolkan</p>
                      <span>Add position</span>
                      <a href="mailto:bolkan@wsu.edu">bolkan@wsu.edu</a> {/* Clickable email */}
                      <p>(360) 546-9336</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="contact__half contact__right">
              <form onSubmit={handleSubmit} id="contact__form">
                <div className="form__item">
                  <label className="form__item--label">Name*</label>
                  <input type="text" className="input" name="user_name" required />
                </div>
                <div className="form__item">
                  <label className="form__item--label">Email Address*</label>
                  <input type="email" className="input" name="user_email" required />
                </div>
                <div className="form__item">
                  <label className="form__item--label">Phone Number*</label>
                  <input type="text" className="input" name="user_phone" required />
                </div>
                <div className="form__item">
                  <label className="form__item--label">Message*</label>
                  <textarea className="input" name="message" required></textarea>
                </div>
                <button type="submit" id="contact__submit" className="form__submit">
                  Submit
                </button>
              </form>

              {/* Conditionally render loading or success overlay */}
              {loading && (
                <div className="contact__overlay contact__overlay--loading contact__overlay--visible">
                  <i className="fas fa-spinner"></i>
                </div>
              )}

              {success && (
                <div className="contact__overlay contact__overlay--success contact__overlay--visible">
                  <h1>Thank you for the message!<br /> I hope you have a nice day!</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};