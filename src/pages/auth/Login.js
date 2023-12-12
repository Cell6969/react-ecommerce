import React, { useState } from 'react'
import styles from './auth.module.scss';
import loginImg from '../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Card from '../../components/card/Card';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { selectPreviousURL } from '../../redux/slice/cartSlice';

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const previousURL = useSelector(selectPreviousURL)

    const redirectUser = () => {
        if (previousURL.includes("cart")) {
            return navigate("/cart")
        }
        return navigate("/")
    }

    // Email and Password Login
    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setIsLoading(false);
            toast.success("Login Success")
            redirectUser()
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message)
        }
    }

    // Google Login
    const provider = new GoogleAuthProvider();
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider)
            toast.success("Login Success")
            redirectUser()
        } catch (error) {
            toast.error("Login Error")
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            <section className={`container ${styles.auth}`}>
                <div className={styles.img}>
                    <img src={loginImg} alt='login-img' width="400" />
                </div>
                <Card>
                    <div className={styles.form}>
                        <h2>Login</h2>
                        <form onSubmit={loginUser}>
                            <input
                                type='text'
                                placeholder='Email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type='password'
                                placeholder='Password'
                                required
                                autoComplete='on'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type='submit' className='--btn --btn-primary --btn-block'>Login</button>
                            <div className={styles.links}>
                                <Link to="/reset">Forgot Password?</Link>
                            </div>
                            <p>-- or --</p>
                        </form>

                        <button className="--btn --btn-danger --btn-block" onClick={loginWithGoogle}>
                            <FaGoogle color='#fff' />
                            Login with Google
                        </button>
                        <span className={styles.register}>
                            <p>Don't have an Account?</p>
                            <Link to="/register">Register Here</Link>
                        </span>
                    </div>
                </Card>
            </section>
        </>

    )
}

export default Login