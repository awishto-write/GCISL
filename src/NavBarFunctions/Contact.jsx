// import React from 'react';

// export default function Contact() {
//   return (
//     <div className="contact-page">
//       <h1>Contact Us</h1>
//       <p>If you have any questions or need further information, feel free to contact us at: </p>
//       <p>Email: gciconnect@wsu.edu</p>
//       <p>Phone: (123) 456-7890</p>
//       <p>We are always happy to hear from you!</p>
//     </div>
//   );
// }

//
// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser'; // Use emailjs for form submission
// import './Contact.css'; // Import the CSS file

// const Contact = () => {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setLoading(true);

//     emailjs
//       .sendForm(
//         'service_wp048se',
//         'template_si8f8fp',
//         event.target,
//         'IoiwiKiSBN_lWY9MM'
//       )
//       .then(() => {
//         setLoading(false);
//         setSuccess(true);
//       })
//       .catch(() => {
//         setLoading(false);
//         alert('The email service is temporarily unavailable. Please contact me directly at malidzulfiqar@gmail.com');
//       });
//   };

//   return (
//     <section id="contact">
//       <div className="section__container">
//         <div className="section__row">
//           <div className="contact__wrapper">
//             <div className="contact__half contact__left">
//               <h3 className="contact__title">Contact us!</h3>
//               <p className="contact__para">
//                 Have questions or suggestions?
//                 <br />
//                 Please fill in this form to let our team know.
//                 <br />
//                 We highly value your input.
//               </p>
//             </div>

//             <div className="contact__half contact__right">
//               <form onSubmit={handleSubmit} id="contact__form">
//                 <div className="form__item">
//                   <label className="form__item--label">Name*</label>
//                   <input type="text" className="input" name="user_name" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Email Address*</label>
//                   <input type="email" className="input" name="user_email" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Phone Number*</label>
//                   <input type="text" className="input" name="user_phone" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Message*</label>
//                   <textarea className="input" name="message" required></textarea>
//                 </div>
//                 <button type="submit" id="contact__submit" className="form__submit">
//                   Submit
//                 </button>
//               </form>

//               {/* Overlay for loading state */}
//               {loading && (
//                 <div className="contact__overlay contact__overlay--loading contact__overlay--visible">
//                   <i className="fas fa-spinner"></i>
//                 </div>
//               )}

//               {/* Overlay for success state */}
//               {success && (
//                 <div className="contact__overlay contact__overlay--success contact__overlay--visible">
//                   <h1>
//                     Thank you for the message!
//                     <br />
//                     I hope you have a nice day!
//                   </h1>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;

//
// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import './Contact.css'; // Ensure the CSS styles remain consistent

// const Contact = () => {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setLoading(true);

//     emailjs
//       .sendForm(
//         'service_wp048se',
//         'template_si8f8fp',
//         event.target,
//         'IoiwiKiSBN_lWY9MM'
//       )
//       .then(() => {
//         setLoading(false);
//         setSuccess(true);
//       })im
//       .catch(() => {
//         setLoading(false);
//         alert('The email service is temporarily unavailable.');
//       });
//   };

//   return (
//     <section id="contact">
//       <div className="section__container">
//         <div className="section__row">
//           <div className="contact__wrapper">
//             {/* Left Side - Static Info */}
//             <div className="contact__half contact__left">
//               <h3 className="contact__title">Contact us!</h3>
//               <p className="contact__para">
//                 Have questions or suggestions?<br />
//                 Please fill in this form to let our team know.<br />
//                 We highly value your input.
//               </p>

//               {/* Staff Contact Information */}
//               <div className="staff__info">
//                 <div className="staff__member">
//                   <img src="../../public/darcie_Image.png" alt="Darcie Bagott" className="staff__image" />
//                   <p>Darcie Bagott<br />
//                     <span>darcie.bagott@wsu.edu</span><br />
//                     <span>(509) 335-6387</span>
//                   </p>
//                 </div>
//                 <div className="staff__member">
//                   <img src="../../public/Corrie_Image.png" alt="Cory Bolkan" className="staff__image" />
//                   <p>Cory Bolkan<br />
//                     <span>bolkan@wsu.edu</span><br />
//                     <span>(360) 546-9336</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Form */}
//             <div className="contact__half contact__right">
//               <form onSubmit={handleSubmit} id="contact__form">
//                 <div className="form__item">
//                   <label className="form__item--label">Name*</label>
//                   <input type="text" className="input" name="user_name" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Email Address*</label>
//                   <input type="email" className="input" name="user_email" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Phone Number*</label>
//                   <input type="text" className="input" name="user_phone" required />
//                 </div>
//                 <div className="form__item">
//                   <label className="form__item--label">Message*</label>
//                   <textarea className="input" name="message" required></textarea>
//                 </div>
//                 <button type="submit" id="contact__submit" className="form__submit">
//                   Submit
//                 </button>
//               </form>

//               {/* Conditionally render loading or success overlay */}
//               {loading && (
//                 <div className="contact__overlay contact__overlay--loading contact__overlay--visible">
//                   <i className="fas fa-spinner"></i>
//                 </div>
//               )}

//               {success && (
//                 <div className="contact__overlay contact__overlay--success contact__overlay--visible">
//                   <h1>Thank you for the message!<br /> I hope you have a nice day!</h1>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css'; // Ensure the CSS styles remain consistent

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        'service_wp048se',
        'template_si8f8fp',
        event.target,
        'IoiwiKiSBN_lWY9MM'
      )
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        alert('The email service is temporarily unavailable.');
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
              

              {/* Staff Contact Information */}
              <div className="staff__info">
                <div className="staff__member">
                  {/* <img src="../../public/darcie_Image.png" alt="Darcie Bagott" className="staff__image" /> */}
                  <img src={`${process.env.PUBLIC_URL}/darcie_Image.png`} alt="Darcie Bagott" className="staff__image" />
                  <p>Darcie Bagott<br />
                    <span>darcie.bagott@wsu.edu</span><br />
                    <span>(509) 335-6387</span>
                  </p>
                </div>
                <div className="staff__member">
                    {/* <img src="../../public/Corrie_Image.png" alt="Cory Bolkan" className="staff__image" /> */}
                    <img src={`${process.env.PUBLIC_URL}/Corrie_Image.png`} alt="Darcie Bagott" className="staff__image" />
                    <p>Cory Bolkan<br />
                        <span>bolkan@wsu.edu</span><br />
                        <span>(360) 546-9336</span>
                    </p>
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

export default Contact;
