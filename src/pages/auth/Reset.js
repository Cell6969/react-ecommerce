import React, { useState } from 'react'
import resetImg from '../../assets/forgot.png'
import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify'

const Reset = () => {
    const [email, setEmail] = useState('')

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email)
            toast.success('Send to Email')
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <section className={`container ${styles.auth}`}>
            <div className={styles.img}>
                <img src={resetImg} alt='login-img' width="400" />
            </div>
            <Card>
                <div className={styles.form}>
                    <h2>Reset Password</h2>
                    <form onSubmit={resetPassword}>
                        <input
                            type='text'
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type='submit' className='--btn --btn-primary --btn-block'>Reset Password</button>
                        <div className={styles.links}>
                            <p>
                                <Link to="/login">Login ---</Link>
                            </p>
                            <p>
                                <Link to="/register">--- Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </Card>
        </section>
    )
}

export default Reset