import React from 'react'
import styles from './Contact.module.scss'
import Card from '../../components/card/Card'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go'

const Contact = () => {

  const sendEmail = () => {

  };

  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <h2>Contact Us</h2>
        <div className={styles.section}>
          <form onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              {/* Name */}
              <label>Name:</label>
              <input
                type='text'
                placeholder='Full Name'
                name='user_name'
                required
              />
              {/* Email */}
              <label>Email:</label>
              <input
                type='email'
                placeholder='Your Active Email'
                name='user_email'
                required
              />
              {/* Subject */}
              <label>Subject:</label>
              <input
                type='text'
                placeholder='Subject'
                name='subject'
                required
              />
              {/* Body Message*/}
              <label>Message:</label>
              <textarea
                name='message'
                cols='30'
                rows='10'>
              </textarea>
              <button className='--btn --btn-primary' type='submit'>Send Message</button>
            </Card>
          </form>
          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our Contact Information</h3>
              <p>Fill the form or contact us via other channels listed below</p>
              <div className={styles.icons}>
                <span>
                  <FaPhoneAlt />
                  <p>+999 999 999 999</p>
                </span>
                <span>
                  <FaEnvelope />
                  <p>Support@eshop.com</p>
                </span>
                <span>
                  <GoLocation />
                  <p>Ind, </p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact